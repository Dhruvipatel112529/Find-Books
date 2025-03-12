import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../pages-css/AdminAddUser.css";

export const AdminEditUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { User } = location.state || {}; // Extract User object from location state

  console.log("User received in Edit Page:", User); // Debugging

  // Initialize user state with received data (or empty fields if not found)
  const [user, setUser] = useState({
    id : "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    //password: "",
    role: "",
  });

  // Update state when User is available
  useEffect(() => {
    if (User) {
      setUser({
        id : User._id,
        firstName: User.First_name || "",
        lastName: User.Last_name || "",
        email: User.Email || "",
        mobile: User.Phone_no || "", // Keep empty for security reasons
        role: User.role || (User.isAdmin ? "Admin" : "User"),
      });
    }
  }, [User]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const editUser = async (e) => {
    e.preventDefault();
  
    console.log("Submitting User Data:", user); // ✅ Check the final state before sending
  
    if (!user.id) {
      alert("User ID is missing. Cannot update.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:2606/api/User", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: user.id, 
          firstname: user.firstName,
          lastname : user.lastName,  
          email: user.email,
          mobile: user.mobile,
          role: user.role,
        }),
      });
  
      console.log("Response status:", response.status);
  
      const result = await response.json();
      console.log("API Response:", result);
  
      if (response.ok) {
        alert("User updated successfully!");
        navigate("/Admin/ManageUsers");
      } else {
        alert(result.error || "Failed to update user.");
      }
    } catch (error) {
      console.error("Error in try block:", error);
      alert("An error occurred.");
    }
  };
  
  
  return (
    <div className="add-user-container">
      <h2 className="form-title">Edit User</h2>
      <form className="add-user-form" onSubmit={editUser}>
        <div className="form-group">
          <label>First Name:</label>
          <input type="text" name="firstName" value={user.firstName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Last Name:</label>
          <input type="text" name="lastName" value={user.lastName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={user.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Mobile No:</label>
          <input type="tel" name="mobile" value={user.mobile} onChange={handleChange} required />
        </div>

        {/* <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" value={user.password} onChange={handleChange} placeholder="Enter new password (optional)" />
        </div> */}

        <div className="form-group">
          <label>Role:</label>
          <select name="role" value={user.role} onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">
          Update User Data
        </button>
      </form>
    </div>
  );
};
