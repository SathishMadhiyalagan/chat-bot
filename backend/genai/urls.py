from django.urls import path
from .views import perform_rag_lll,handle_query  # Import your perform_rag_lll view

urlpatterns = [
    path('perform-rag/<int:file_id>/', perform_rag_lll, name='perform-rag-lll'),  # Handle RAG LLL for specific file
    path('query/',handle_query,name="handle_query")
]
