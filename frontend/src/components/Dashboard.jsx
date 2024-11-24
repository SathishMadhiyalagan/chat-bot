import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserInfo } from "../store/authSlice"; // Adjust the path to your auth slice
import Navbar from "../components/Navbar"; // Adjust the path as needed
import Footer from "../components/Footer"; // Adjust the path as needed
import Admin from "../components/Admin"; // Adjust the path to your Admin component
import Editor from "../components/Editor"; // Adjust the path to your User component
import Viewer from "../components/Viewer";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { user, isAuthenticated, status, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated && !user) {
      // Fetch user info if authenticated and user data is not already available
      dispatch(getUserInfo());
    }
  }, [isAuthenticated, user, dispatch]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <h1 className="text-2xl text-blue-600 font-semibold">
          Loading Dashboard...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <h1 className="text-2xl text-red-600 font-semibold">
          Error: {error}
        </h1>
      </div>
    );
  }

  // Ensure user data is available before rendering role-based components
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <h1 className="text-2xl text-gray-600 font-semibold">
          User data not available.
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Conditional rendering based on user role */}
      {user.role_id === 1 ? (
        <Admin />
      ) : user.role_id === 2 ? (
        <Editor />
      ) :  user.role_id === 3 ? (
        <Viewer />
      ) :(
        <div className="flex items-center justify-center h-screen bg-yellow-50">
          <h1 className="text-2xl text-yellow-600 font-semibold">
            No Role Assigned
          </h1>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;
