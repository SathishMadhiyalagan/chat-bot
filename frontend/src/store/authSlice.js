import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, logoutUser, registerUser, fetchUserInfo } from "../services/authService";

// Create an async thunk for logging in
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginUser(credentials);
      return data; // This will be passed to the reducer
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

// Create an async thunk for registering
export const register = createAsyncThunk(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await registerUser(credentials);
      return data; // This will be passed to the reducer
    } catch (err) {
      return rejectWithValue(err.response?.data || "Registration failed");
    }
  }
);

// Create an async thunk for logging out
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const { refreshToken, accessToken } = auth;
      await logoutUser(refreshToken, accessToken);
      return true; // Indicate successful logout
    } catch (err) {
      return rejectWithValue(err.response?.data || "Logout failed");
    }
  }
);

// Create an async thunk for fetching user information
export const getUserInfo = createAsyncThunk(
  "auth/getUserInfo",
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const { accessToken } = auth;
      const response = await fetchUserInfo(accessToken);
      console.log("Fetched user info:", response.user); // Log response to check the structure
      return response.user; // Store the user data in the Redux store
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch user info");
    }
  }
);

// Initial state
const initialState = {
  isAuthenticated: !!localStorage.getItem("accessToken"),
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  user: null, // To store user data
  error: null,
  status: "idle", // Can be "idle", "loading", "succeeded", "failed"
};

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle login actions
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        localStorage.setItem("accessToken", action.payload.access);
        localStorage.setItem("refreshToken", action.payload.refresh);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Handle logout actions
    builder
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "succeeded";
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null; // Reset user data on logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Handle register actions
    builder
      .addCase(register.pending, (state) => {
        state.status = "loading";
      })
      .addCase(register.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Handle getUserInfo actions
    builder
      .addCase(getUserInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload; // Store user data
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export the reducer
export default authSlice.reducer;
