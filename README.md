

# Document Management and Q&A Application

## Project Overview

This project is a **Document Management and Q&A Application** designed to provide a platform where users can interact with a knowledge base of documents. The system includes roles such as **Admin**, **Editor**, and **Viewer** (normal user), each with different levels of access and permissions. The application allows **Editors** to upload PDF documents and perform **document processing** using **LangChain** to enable **question-answering (Q&A)** functionality. **Normal users** (Viewers) can ask questions, and the system provides relevant answers based on the uploaded documents.

## Technology Stack

- **Backend**: Python (Django Framework)
- **Frontend**: React.js, Redux
- **Document Processing**: LangChain
  - **Chroma** for vector storage
  - **HuggingFaceEmbeddings** for embeddings
  - **RecursiveCharacterTextSplitter** for text splitting
  - **PyPDFLoader** for loading PDF documents
- **Authentication**: Gemniai Token (for token-based authentication)

## Features

- **Admin Panel**: 
  - Full control over the system
  - Manages Editor and Viewer roles and permissions
- **Editor**:
  - Uploads relevant PDF documents
  - Converts documents into vectors for easy querying
- **Viewer (Normal User)**:
  - Asks questions in the dashboard
  - Receives answers from the uploaded documents using the Q&A system

## Setup Instructions

### Backend Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/SathishMadhiyalagan/chat-bot
   cd backend
   ```

2. **Set up Python environment**:

   It is recommended to use a virtual environment. You can create one by running:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use 'venv\Scripts\activate'
   django-admin startproject backend
   cd backend
   python manage.py startapp users
   python manage.py startapp genai

   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Database**:

   Set up your database (Mysql) as per your needs. The default is SQLite.

5. **Run Migrations**:

   ```bash
   python manage.py migrate
   ```

6. **Set up Superuser (Admin)**:

   ```bash
   python manage.py createsuperuser
   ```

   Follow the prompts to create an admin user.

7. **Start Django server**:

   ```bash
   python manage.py runserver
   ```

   The backend API will be running on `http://127.0.0.1:8000`.

### Frontend Setup

1. **Navigate to the frontend directory**:

   ```bash
   cd ../frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the application**:

   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`.

### LangChain Setup

1. **Install necessary LangChain dependencies**:

   ```bash
   pip install langchain chromadb
   ```

2. **Configure LangChain in your Django project**:
   
   Use the following imports in your `views.py` or wherever you're handling the document processing:

   ```python
   from langchain.vectorstores import Chroma
   from langchain.embeddings import HuggingFaceEmbeddings
   from langchain.text_splitter import RecursiveCharacterTextSplitter
   from langchain.document_loaders import PyPDFLoader
   ```

   - **Chroma**: This is used for vector storage to enable quick document querying.
   - **HuggingFaceEmbeddings**: Embedding models for document embedding.
   - **RecursiveCharacterTextSplitter**: For splitting large documents into manageable chunks.
   - **PyPDFLoader**: For loading and processing PDF documents.

### Roles and Permissions

- **Admin**: Full control over the system, including role management.
- **Editor**: Can upload PDF documents, which are processed and converted into vectors for Q&A functionality.
- **Viewer**: Normal users who can ask questions based on the uploaded content in their dashboard.

## Usage

- **Editors** upload PDF documents to the system, which are then processed into vector embeddings for efficient Q&A searching.
- **Viewers** ask questions, and the system uses LangChain to return the most relevant answers based on the content of the uploaded documents.

## Conclusion

This application provides an efficient way to manage documents and retrieve relevant information via a Q&A interface, utilizing modern AI technologies for document processing and query answering.

