import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

const Logout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return <button className="text-white hover:text-[#daf1f4] transition duration-300" onClick={handleLogout}>Logout</button>;
};

export default Logout;
