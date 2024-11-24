import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store/authSlice"; // Import the logout action
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Register from "./components/Register";
import Contact from "./components/Contact";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./components/NotFound";

const App = () => {
  const dispatch = useDispatch();

  // Access authentication state from Redux
  const { isAuthenticated } = useSelector((state) => state.auth);


  return (
    <Router>
      {/* <nav>
        <Link to="/">Home</Link>
        {!isAuthenticated && <Link to="/login">Login</Link>}
        {!isAuthenticated && <Link to="/register">Register</Link>}
        <Link to="/contact">Contact</Link>
        {isAuthenticated && <Logout />}
      </nav> */}
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard /> : <Home />}
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" /> : <Login />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/" /> : <Register />
          }
        />
        <Route path="/contact" element={<Contact />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
