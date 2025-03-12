import { useState, useEffect } from "react";
import "../pages-css/ManageUsers.css";
import { useNavigate } from "react-router-dom";

export const ManageUsers = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const GetUsers = async () => {
      try {
        const response = await fetch("http://localhost:2606/api/AllUser", {
          credentials: "include",
        });
        const json = await response.json();
        setUsers(json.users);
        setFilteredUsers(json.users); // Initialize with all users
      } catch (error) {
        alert("An error occurred. Please try again later.");
        console.error(error);
      }
    };
    GetUsers();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter((user) =>
          user.First_name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, users]);
  
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
  
    try {
      const response = await fetch("http://localhost:2606/api/User", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userId: id }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setUsers(users.filter((user) => user._id !== id));
        setFilteredUsers(filteredUsers.filter((user) => user._id !== id));
        alert("User deleted successfully!");
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred. Please try again later.");
    }
  };
  

  const handleEdit = (id) => {
    const newName = prompt("Enter new name:");
    if (newName) {
      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, First_name: newName } : user
        )
      );
      setFilteredUsers(
        filteredUsers.map((user) =>
          user._id === id ? { ...user, First_name: newName } : user
        )
      );
    }
  };

  const handleAddUser = () => {
    
  };

  return (
    <div className="users-page">
      <h1 className="title">Users Management</h1>
      <div className="users-card">
        <div className="card-content">
          <div className="header">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button className="add-user" onClick={()=> navigate("/Admin/ManageUsers/adduser")}>
              Add User
            </button>
          </div>
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user._id} className="user-row centered">
                  <td className="centered">{index + 1}</td>
                  <td className="centered">
                    {user.First_name} {user.Last_name}
                  </td>
                  <td className="centered">{user.Email}</td>
                  <td className="centered">
                    {user.Role[0].isAdmin ? "Admin" : user.Role[0].isDeliveryPerson ?"DeliveryPerson":"User" }
                  </td>
                  <td className="centered">
                    <div className="actions centered">
                      <button
                        className="edit-btn centered"
                        onClick={() => handleEdit(user._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn centered"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
