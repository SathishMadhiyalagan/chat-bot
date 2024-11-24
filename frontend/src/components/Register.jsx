import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; // Adjust the path as needed
import Footer from "./Footer"; // Adjust the path as needed

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // For loading state
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const { username, email, password, confirmPassword } = credentials;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true); // Set loading state to true
    setError(null); // Clear previous errors

    try {
      await axios.post("http://127.0.0.1:8000/api/users/register/", {
        username,
        email,
        password,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate("/login"); // Redirect to login page after a short delay
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="bg-[#e5e7eb] min-h-screen">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[#e5e7eb]">
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-3xl font-semibold text-center text-[#506169]">Sign Up</h2>

          {/* Success Message */}
          {success && (
            <p className="text-green-500 text-center">Registration successful! Redirecting to login...</p>
          )}

          {/* Error Message */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          <form onSubmit={handleRegister} className="space-y-6">
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
              <label htmlFor="email" className="block text-sm font-medium text-[#6e7f87]">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
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
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#6e7f87]">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={credentials.confirmPassword}
                onChange={(e) =>
                  setCredentials({ ...credentials, confirmPassword: e.target.value })
                }
                className="w-full mt-2 px-4 py-2 border border-[#6e7f87] rounded-md focus:outline-none focus:ring-2 focus:ring-[#506169]"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#506169] text-white font-semibold rounded-md hover:bg-[#daf1f4] focus:outline-none focus:ring-2 focus:ring-[#506169]"
                disabled={loading} // Disable button during loading
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-[#6e7f87]">
            Already have an account?{" "}
            <a href="/login" className="text-[#506169] hover:underline">
              Log in here
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
