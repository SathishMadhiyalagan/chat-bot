import React, { useState, useEffect } from "react";
import { getUploadedFiles, performRagForFile } from "../api/AllUserApi"; // Assuming the file is named AllUserApi.js

export default function UploadedFilesList() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch uploaded files on component mount
  useEffect(() => {
    const fetchUploadedFiles = async () => {
      const token = localStorage.getItem("accessToken"); // Assuming token is stored in localStorage
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }
      setLoading(true);
      try {
        const files = await getUploadedFiles(token);
        setUploadedFiles(files);
      } catch (err) {
        setError("Error fetching files.");
      } finally {
        setLoading(false);
      }
    };

    fetchUploadedFiles();
  }, []);

  // Handle the RAG button click
  const handleRagClick = async (fileId) => {
    const token = localStorage.getItem("accessToken"); // Retrieve token from localStorage
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }
    try {
      setLoading(true);
      const result = await performRagForFile(fileId, token);
      console.log("RAG process result:", result);
      // Update the file's status after RAG processing is successful
      setUploadedFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === fileId ? { ...file, rag: true } : file
        )
      );
    } catch (error) {
      setError("Error performing RAG process.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {loading && <p className="text-center text-gray-500">Loading files...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && uploadedFiles.length === 0 && (
        <p className="text-center text-gray-500">No files uploaded.</p>
      )}
      {!loading && !error && uploadedFiles.length > 0 && (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">File Name</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">File Caption</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Uploaded By</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Ragged</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700"></th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((file) => (
                <tr key={file.id} className="border-t">
                  <td className="px-4 py-2 text-sm text-gray-800">{file.file_name}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{file.file_caption}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{file.uploaded_by}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {file.rag ? "Merged" : "Waiting Merge"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    <button
                      disabled={file.rag}
                      onClick={() => handleRagClick(file.id)}
                      className={`px-4 py-1 text-white rounded ${
                        file.rag ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {file.rag ? "RAG-Done" : "RAG"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
