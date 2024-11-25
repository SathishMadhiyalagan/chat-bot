from django.urls import path
from .views import perform_rag_lll,handle_query,get_chat_history  # Import your perform_rag_lll view

urlpatterns = [
    path('perform-rag/<int:file_id>/', perform_rag_lll, name='perform-rag-lll'),  # Handle RAG LLL for specific file
    path('query/',handle_query,name="handle_query"),
    path('chat_history/<int:user_id>/',get_chat_history,name="get_chat_history")
]
