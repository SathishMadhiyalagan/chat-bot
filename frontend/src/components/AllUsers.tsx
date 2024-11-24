import { useEffect, useState } from "react";
import { getAllUsers, updateUserRoleApi } from "../api/AllUserApi";
import { format } from "date-fns";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("accessToken"); // Replace with your authentication method

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers(token);
        setUsers(data.users);
        setLoading(false);
      } catch (err) {
        setError(err.detail || "Something went wrong.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleEdit = (userId) => {
    console.log(`Edit user with ID: ${userId}`);
    // Implement edit functionality here
  };

  const handleDelete = (userId) => {
    console.log(`Delete user with ID: ${userId}`);
    // Implement delete functionality here
  };

  const handleRoleChange = async (userId, newRoleId) => {
    try {
      await updateUserRoleApi(userId, newRoleId, token);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role_id: newRoleId } : user
        )
      );
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <h1 className="text-2xl text-blue-600 font-semibold">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <h1 className="text-2xl text-red-600 font-semibold">Error: {error}</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        All Users
      </h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Username</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">First Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Last Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Role</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Active</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date Joined</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-700">{user.id}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{user.username}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{user.email || "N/A"}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{user.first_name || "N/A"}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{user.last_name || "N/A"}</td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  <select
                    value={user.role_id || ""}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1"
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
                    <option value="1">Admin</option>
                    <option value="2">Editor</option>
                    <option value="3">Viewer</option>
                  </select>
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">{user.is_active ? "Yes" : "No"}</td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {format(new Date(user.date_joined), "yyyy-MM-dd HH:mm")}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  <button
                    onClick={() => handleEdit(user.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
