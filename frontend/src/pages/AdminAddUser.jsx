import { useState } from "react";
import "../pages-css/AdminAddUser.css"; // External CSS
import { useNavigate } from "react-router-dom";


export const AdminAddUser = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    role: "",
  });
  const Navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("User Data Submitted:", user);

    try {
      const response = await fetch("http://localhost:2606/api/User", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const result = await response.json();

      if (response.ok) {
        alert("User added successfully!");
        setUser({
          firstName: "",
          lastName: "",
          email: "",
          mobile: "",
          role: "",
          password: "",
        });
        Navigate("/Admin/ManageUsers");
      } else {
        alert(result.error || "Failed to add user.");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("An error occurred while adding the user.");
    }
  };


  return (
    <div className="add-user-container">
      <h2 className="form-title">Add New User</h2>
      <form className="add-user-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First_Name:</label>
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Last_Name:</label>
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Mobile No :</label>
          <input type="tel" name="mobile" value={user.mobile} onChange={handleChange} required />

        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Role:</label>
          <select name="role" value={user.role} onChange={handleChange} required>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="DeliveryPerson">DeliveryPerson</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">
          Add User
        </button>
      </form>
    </div>
  );
};
