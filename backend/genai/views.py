from rest_framework.decorators import api_view
from rest_framework.response import Response

from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import PyPDFLoader

from django.http import JsonResponse
from users.models import File


@api_view(['GET'])
def perform_rag_lll(request, file_id):
    """
    Perform the RAG LLL processing on the uploaded file using the file_id.
    """
    try:
        # Retrieve the file from the database by ID
        uploaded_file = File.objects.get(id=file_id)

        # Get the file path of the uploaded file
        file_path = uploaded_file.file.path

        # print(file_path)

        # Perform the RAG LLL operation by passing the file path
        result = ragLLL(file_path,file_id)

        return Response({'message': 'RAG processing completed', 'result': result}, status=200)

    except File.DoesNotExist:
        return Response({'error': 'File not found'}, status=404)


def ragLLL(file_path,file_id):
    """
    Process the provided file for RAG LLL using langchain.
    """
    try:
        # Load the document using PyPDFLoader
        loader = PyPDFLoader(file_path)  # Use the file path directly here
        docs = loader.load()

        # Split the documents into chunks
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        docs = text_splitter.split_documents(docs)

        # Create embeddings for the documents
        embedding_function = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2", model_kwargs={'device': 'cpu'})

        # Initialize Chroma vector store and persist the documents
        vectorstore = Chroma.from_documents(docs, embedding_function, persist_directory="./chroma_db_nccn")

        # Get the count of documents in the collection
        doc_count = vectorstore._collection.count()

        if doc_count:
            uploaded_file = File.objects.get(id=file_id)
            uploaded_file.raged=True
            uploaded_file.save()

        return {'document_count': doc_count}

    except Exception as e:
        return {'error': str(e)}

# FastAPI Application for handling queries
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from backend.settings import GEMEINI_API_KEY

app = FastAPI()

# Configure generative AI API key
genai.configure(api_key=GEMEINI_API_KEY)

# Initialize Chroma vector database
embedding_function = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    model_kwargs={"device": "cpu"}
)

vector_db = Chroma(persist_directory="./chroma_db_nccn", embedding_function=embedding_function)

# Function to get context from the database
def get_relevant_context_from_db(query: str):
    try:
        context = ""
        search_results = vector_db.similarity_search(query, k=6)
        for result in search_results:
            context += result.page_content + "\n"
        return context.strip() or "No relevant context available from the database."
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching context: {str(e)}")

# Function to generate a prompt for Gemini
def generate_rag_prompt(query: str, context: str):
    escaped = context.replace("'", "").replace('"', "").replace("\n", " ")
    prompt = (f"""
    You are an AI assistant, tasked with providing informative and comprehensive answers to user queries. You have access to a vast amount of information, but your primary goal is to provide the most relevant and accurate response based on the given query and context.

    **Query:** {query}
    **Context:** {escaped}

    **Your Task:**

    1. **Understand the Query:** Carefully analyze the query to identify the user's intent and information needs.
    2. **Leverage the Context:** Utilize the provided context to enhance your response. If the context is relevant, incorporate it into your answer.
    3. **Generate a Response:** Craft a clear, concise, and informative response that directly addresses the query.
    4. **Maintain Objectivity:** Present information objectively, avoiding any personal biases or opinions.
    5. **Cite Sources:** If applicable, cite the sources of your information.
    6. **Provide Proper Formatting:** Ensure your response is formatted well to enhance readability. Use headings, paragraphs, bullet points, or HTML tags to structure your answer. For code snippets, include <code>&lt;pre&gt;</code> and <code>&lt;code&gt;</code> tags:

    **Example Response:**

    > Based on the provided context, the answer to your query is: ...

    Remember to tailor your response to the specific query and context. Strive to provide the best possible answer, even if it requires synthesizing information from multiple sources.
    """)
    return prompt

# Function to generate an answer using Gemini
def generate_answer(prompt: str):
    try:
        model = genai.GenerativeModel(model_name="gemini-pro")
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating answer: {str(e)}")

@api_view(['POST'])
def handle_query(request):
    """
    Handles user queries by fetching relevant context from the database
    and generating an answer using Gemini Generative AI.
    """
    # Parse the query from the request data
    query = request.data.get('query')

    # Validate that the query is not empty
    if not query or query.strip() == "":
        raise ValidationError("Query cannot be empty.")

    # Fetch context from the database using the query
    context = get_relevant_context_from_db(query)
    
    # Generate the RAG prompt
    prompt = generate_rag_prompt(query, context)
    
    # Generate the answer using Gemini
    answer = generate_answer(prompt)

    # Return the response
    return Response({
        "query": query,
        "context": context,
        "answer": answer
    })