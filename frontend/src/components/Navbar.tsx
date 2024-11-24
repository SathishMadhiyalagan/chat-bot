import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { useDispatch, useSelector } from "react-redux"; // Import hooks from react-redux
import Logout from "./Logout";

const Navbar = () => {
  const dispatch = useDispatch();

  // Access authentication state from Redux
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" }); // Dispatch a logout action (replace with your actual logic)
  };

  return (
    <nav className="bg-[#506169] p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo - Redirect to Home Page */}
        <div className="text-white font-bold text-2xl">
          <Link to="/" className="text-xl hover:text-[#daf1f4]">
            LLL
          </Link>
        </div>
        {/* Navbar Links */}
        <div className="space-x-4">
         
          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className="text-white hover:text-[#daf1f4] transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-white hover:text-[#daf1f4] transition duration-300"
              >
                Register
              </Link>
            </>
          )}
          <Link
            to="/contact"
            className="text-white hover:text-[#daf1f4] transition duration-300"
          >
            Contact
          </Link>
          {isAuthenticated && <Logout />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
