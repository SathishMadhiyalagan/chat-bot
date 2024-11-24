import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/users/";

// API call to login
export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}login/`, credentials);
  return response.data; // Return the data for Redux to use
};

// API call to register
export const registerUser = async (credentials) => {
  const response = await axios.post(`${API_URL}register/`, credentials);
  return response.data;
};

// API call to logout
export const logoutUser = async (refreshToken, accessToken) => {
  const response = await axios.post(
    `${API_URL}logout/`,
    { refresh: refreshToken },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data; // Return data if needed
};

// API call to fetch user information
export const fetchUserInfo = async (accessToken) => {
  const response = await axios.get(`${API_URL}info/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data; // Return the user data
};
