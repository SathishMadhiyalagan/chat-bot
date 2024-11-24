import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./store/authSlice";

// Create Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
