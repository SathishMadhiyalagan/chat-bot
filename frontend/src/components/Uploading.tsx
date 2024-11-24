import React, { useState } from 'react';
import { uploadFile } from "../api/AllUserApi";

export default function Uploading() {
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const token = localStorage.getItem("accessToken"); // Replace with actual token from your authentication logic

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only PDF and Word files are allowed!');
        setSelectedFile(null);
      } else {
        setError('');
        setSelectedFile(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption || !selectedFile) {
      alert('Please enter a caption and select a valid file before submitting!');
      return;
    }

    setLoading(true);
    setSuccessMessage('');
    setError('');

    try {
      // Call the uploadFile function from the API module
      const response = await uploadFile(selectedFile, caption, token);

      // Handle successful file upload
      setLoading(false);
      setSuccessMessage('File uploaded successfully!');
      console.log('Upload successful:', response);

    } catch (error) {
      // Handle error during file upload
      setLoading(false);
      setError('Error uploading file. Please try again.');
      console.error('Upload error:', error.response?.data || error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Upload Your File</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Caption Field */}
          <div>
            <label htmlFor="caption" className="block text-gray-700 font-medium mb-2">File Caption</label>
            <input 
              type="text" 
              id="caption"
              value={caption}
              onChange={handleCaptionChange}
              className="border border-gray-300 p-2 rounded-md w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a caption for your file"
            />
          </div>

          {/* File Input */}
          <div>
            <label htmlFor="file" className="block text-gray-700 font-medium mb-2">Choose a File</label>
            <input 
              type="file" 
              id="file"
              onChange={handleFileChange} 
              className="border border-gray-300 p-2 rounded-md w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Description text */}
            <p className="text-sm text-gray-500 mt-2">Only PDF and Word files are allowed.</p>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Success Message */}
          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button 
              type="submit" 
              className="bg-[#506169] text-white py-2 px-6 rounded-lg hover:bg-[#daf1f4] transition duration-300"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
        
        {selectedFile && (
          <div className="mt-4 text-center text-gray-700">
            <p>Selected File: {selectedFile.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}
