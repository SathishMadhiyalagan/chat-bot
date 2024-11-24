import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/users"; // Base URL for your backend API

// Function to fetch all users
export const getAllUsers = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/allusers/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the JWT token for authentication
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message);
    throw error.response ? error.response.data : error;
  }
};

// Function to update a user's role
export const updateUserRoleApi = async (userId, roleId, token) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/${userId}/role/`, // Update this to match your backend route
      { role_id: roleId },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add token for authentication
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Role update response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating user role:", error.response?.data || error.message);
    throw error.response ? error.response.data : error;
  }
};


// Function to upload a file
export const uploadFile = async (file, caption, token) => {
  const formData = new FormData();
  formData.append('file', file); // Attach the file to the form data
  formData.append('file_caption', caption); // Add a caption if needed

  try {
    const response = await axios.post(`${API_BASE_URL}/upload/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token for authentication
        'Content-Type': 'multipart/form-data', // Important for file uploads
      },
    });
    console.log("File upload response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error.response?.data || error.message);
    throw error.response ? error.response.data : error;
  }
};


// Function to fetch uploaded files for the authenticated user
export const getUploadedFiles = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/uploaded-files/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the JWT token for authentication
      },
    });
    console.log(response.data); // Log the response to check the data
    return response.data;
  } catch (error) {
    console.error("Error fetching uploaded files:", error.response?.data || error.message);
    throw error.response ? error.response.data : error;
  }
};



// Function to perform RAG processing for a specific file
export const performRagForFile = async (fileId, token) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/genai/perform-rag/${fileId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the JWT token for authentication
      },
    });
    console.log("RAG processing response:", response.data); // Log the response to check the result
    return response.data;
  } catch (error) {
    console.error("Error performing RAG processing:", error.response?.data || error.message);
    throw error.response ? error.response.data : error;
  }
};