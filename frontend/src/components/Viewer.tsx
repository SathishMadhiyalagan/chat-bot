import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function ChatUI() {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Replace with dynamic user ID if needed
  const userId = 4;

  // Create a reference for scrolling to the bottom
  const bottomOfChat = useRef(null);

  // Fetch chat history from the backend
  const fetchChatHistory = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/genai/chat_history/${userId}/`);
      setChatHistory(response.data);
      console.log(response.data);
    } catch (err) {
      console.error('Failed to load chat history:', err.message);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  // Scroll to the bottom after the message is added
  useEffect(() => {
    bottomOfChat.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Handle submitting a user query
  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    // Add user's query to the UI optimistically
    const newMessage = { user_question: query, bot_reply: null };
    setChatHistory((prev) => [...prev, newMessage]);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/genai/query/', {
        user_id: userId,
        query: query.trim(),
      });

      // Get the answer from the response and update the latest message with the bot's reply
      const botReply = response.data.answer;
      setChatHistory((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1 ? { user_question: msg.user_question, bot_reply: botReply } : msg
        )
      );

      setQuery('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 relative">

      {/* Chat Header */}
      <div className="bg-blue-600 text-white text-center py-4 shadow-lg">
        <h1 className="text-lg font-bold">AI Chat Assistant</h1>
      </div>

      {/* Chat Window */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 && !loading && (
          <p className="text-gray-500 text-center">No messages yet. Start a conversation!</p>
        )}
        {chatHistory.map((message, index) => (
          <div className="space-y-2" key={index}>
            <div
              className={`flex ${message.user_question ? 'justify-end' : 'justify-start'} w-full`}
            >
              {/* User's message on the left */}
              {message.user_question && (
                <div className="max-w-[80%] p-3 bg-gray-300 text-gray-800 rounded-lg shadow-lg">
                  <p><strong>You:</strong> {message.user_question}</p>
                </div>
              )}
            </div>

            <div
              className={`flex ${message.bot_reply ? 'justify-end' : 'justify-start'} w-full`}
            >
              {/* Bot's reply on the right */}
              {message.bot_reply && (
                <div className="max-w-[80%] p-3 bg-blue-500 text-white rounded-lg shadow-lg">
                  <p><strong>AI:</strong> {message.bot_reply}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        {/* Empty div at the bottom to trigger scroll */}
        <div ref={bottomOfChat}></div>
      </div>

      {/* Fixed Input Box */}
      <form
        className="bg-white p-4 border-t shadow-lg flex items-center fixed bottom-0 left-0 w-full"
        onSubmit={handleQuerySubmit}
      >
        <input
          type="text"
          className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Type your message..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>

      {/* Fixed Error Message */}
      {error && <p className="text-center text-red-500 mt-2 fixed bottom-16 left-0 w-full">{error}</p>}

    </div>
  );
}
