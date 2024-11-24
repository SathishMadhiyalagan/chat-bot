import React, { useState, useEffect } from "react";
import { getUploadedFiles } from "../api/AllUserApi"; // Assuming the file is named api.js

export default function UploadedFilesList() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
                {file.raged ? "Merged" : "Waiting Merge" }
              </td>
              <td className="px-4 py-2 text-sm text-gray-800">
                <button
                  onClick={() => handleRagClick(file.id)}
                  className={`px-4 py-1 text-white rounded ${
                    file.raged ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {file.raged ? "RAG-Done" : "RAG"}
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
