import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import Navbar from "../components/Navbar"; // Adjust the path as needed
import Footer from "../components/Footer"; // Adjust the path as needed

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // For loading state
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Set loading state to true

    try {
      const action = await dispatch(login(credentials));
      if (action.type === "auth/login/fulfilled") {
        navigate("/"); // Redirect to the dashboard
      } else {
        setError(action.payload || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="bg-[#e5e7eb] min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Login Form */}
      <div className="min-h-screen flex items-center justify-center bg-[#e5e7eb]">
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-3xl font-semibold text-center text-[#506169]">Login</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#6e7f87]">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                className="w-full mt-2 px-4 py-2 border border-[#6e7f87] rounded-md focus:outline-none focus:ring-2 focus:ring-[#506169]"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#6e7f87]">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                className="w-full mt-2 px-4 py-2 border border-[#6e7f87] rounded-md focus:outline-none focus:ring-2 focus:ring-[#506169]"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#506169] text-white font-semibold rounded-md hover:bg-[#daf1f4] focus:outline-none focus:ring-2 focus:ring-[#506169]"
                disabled={loading} // Disable the button while loading
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          {/* Error message */}
          {error && (
            <p className="text-center text-sm text-red-500">{error}</p>
          )}

          <p className="text-center text-sm text-[#6e7f87]">
            Don't have an account?{" "}
            <a href="/register" className="text-[#506169] hover:underline">
              Sign up here
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Login;
