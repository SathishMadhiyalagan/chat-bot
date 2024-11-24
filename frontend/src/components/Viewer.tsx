import React, { useState } from 'react';
import axios from 'axios';

export default function Viewer() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const apiResponse = await axios.post('http://127.0.0.1:8000/api/genai/query/', {
        query: query.trim(),
      });

      setResponse(apiResponse.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
     
      <form onSubmit={handleQuerySubmit}>
        <label htmlFor="query" style={{ display: 'block', marginBottom: '8px' }}>
          Enter your query:
        </label>
        <input
          type="text"
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your question here..."
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 15px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Submit
        </button>
      </form>

      {loading && <p style={{ color: 'blue' }}>Loading...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {response && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <h2>Response</h2>
          <p><strong>Query:</strong> {response.query}</p>
          {/* <p><strong>Context:</strong> {response.context}</p> */}
          <p><strong>Answer:</strong> {response.answer}</p>
        </div>
      )}
    </div>
  );
}
