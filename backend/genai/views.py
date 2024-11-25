from rest_framework.decorators import api_view
from rest_framework.response import Response

from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import PyPDFLoader

from django.http import JsonResponse
from users.models import File



from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User
from .models import UserMessage


@api_view(['GET'])
def perform_rag_lll(request, file_id):
    """
    Performs RAG LLL (Retrieve and Generate) processing on the uploaded file using the provided file ID.
    The function retrieves the file from the database, processes it using the `ragLLL` function, and returns 
    the result in a response.

    Args:
    request (HttpRequest): The HTTP request object.
    file_id (int): The ID of the file to process.

    Returns:
    Response: A Response object containing the message and processing result, or an error if the file is not found.

    Raises:
    File.DoesNotExist: If the file with the given ID is not found in the database.
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
    Processes the provided file for RAG LLL (Retrieve and Generate) using Langchain.
    The function loads the PDF document, splits it into chunks, creates embeddings, 
    stores them in a Chroma vector store, and updates the file's status in the database.

    Args:
    file_path (str): The file path of the uploaded document.
    file_id (int): The ID of the file being processed.

    Returns:
    dict: A dictionary containing the document count or an error message.

    Raises:
    Exception: If any error occurs during the processing of the file.
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
    """
    Retrieves the relevant context for a given query from the Chroma vector database.
    The function performs a similarity search based on the query and returns the most relevant context.

    Args:
    query (str): The query for which the context is to be retrieved.

    Returns:
    str: The relevant context retrieved from the database, or a default message if no context is found.

    Raises:
    HTTPException: If there is an error during the search process.
    """
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
    """
    Generates a prompt for the Gemini Generative AI model based on the provided query and context.

    Args:
    query (str): The user's query.
    context (str): The relevant context to be incorporated into the answer.

    Returns:
    str: The generated prompt for the Gemini model.
    """
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
    """
    Generates an answer using the Gemini Generative AI model based on the provided prompt.

    Args:
    prompt (str): The prompt to be sent to the Gemini model.

    Returns:
    str: The generated answer from the Gemini model.

    Raises:
    HTTPException: If an error occurs while generating the answer.
    """
    try:
        model = genai.GenerativeModel(model_name="gemini-pro")
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating answer: {str(e)}")

# @api_view(['POST'])
# def handle_query(request):
#     """
#     Handles user queries by fetching relevant context from the database
#     and generating an answer using Gemini Generative AI.
#     """
#     # Parse the query from the request data
#     query = request.data.get('query')

#     # Validate that the query is not empty
#     if not query or query.strip() == "":
#         raise ValidationError("Query cannot be empty.")

#     # Fetch context from the database using the query
#     context = get_relevant_context_from_db(query)
    
#     # Generate the RAG prompt
#     prompt = generate_rag_prompt(query, context)
    
#     # Generate the answer using Gemini
#     answer = generate_answer(prompt)

#     # Return the response
#     return Response({
#         "query": query,
#         "context": context,
#         "answer": answer
#     })





@api_view(['POST'])
def handle_query(request):
    """
    Handles user queries by fetching relevant context from the database and generating an answer 
    using the Gemini Generative AI model. The query and user ID are validated, the answer is generated, 
    and the chat history is saved in the database.

    Args:
    request (HttpRequest): The HTTP request object containing the user's query and user ID.

    Returns:
    Response: A Response object containing the original query, relevant context, and the generated answer.

    Raises:
    ValidationError: If the query is empty or the user ID is not provided or invalid.
    HTTPException: If there is an error in fetching context from the database or generating the answer.
    """
    # Extract user_id and query from request data
    user_id = request.data.get('user_id')
    query = request.data.get('query')

    # Validate inputs
    if not query or query.strip() == "":
        raise ValidationError("Query cannot be empty.")
    if not user_id:
        raise ValidationError("User ID is required.")

    try:
        # Fetch the user object
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        raise ValidationError("User not found.")

    # Fetch relevant context and generate a response
    context = get_relevant_context_from_db(query)
    prompt = generate_rag_prompt(query, context)
    answer = generate_answer(prompt)

    # Save the chat history
    UserMessage.objects.create(
        user_id=user,
        user_question=query,
        bot_reply=answer
    )

    # Return the response
    return Response({
        "query": query,
        "context": context,
        "answer": answer
    })


@api_view(['GET'])
def get_chat_history(request, user_id):
    """
    Retrieves the chat history for a given user. It fetches the user's messages from the database 
    and returns them in chronological order.

    Args:
    request (HttpRequest): The HTTP request object.
    user_id (int): The ID of the user for whom the chat history is being retrieved.

    Returns:
    Response: A Response object containing a list of user messages and bot replies in chronological order.

    Raises:
    ValidationError: If the user is not found in the database.
    """
    try:
        # Fetch the user object
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        raise ValidationError("User not found.")

    # Retrieve messages for the user
    messages = UserMessage.objects.filter(user_id=user).order_by('-timestamp')

    # Prepare the data for response
    data = [
        {
            "id": message.id,
            "user_question": message.user_question,
            "bot_reply": message.bot_reply,
            "timestamp": message.timestamp
        }
        for message in messages
    ]

    return Response(data)

