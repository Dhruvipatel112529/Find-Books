import { useState } from "react";
import { useLocation } from "react-router-dom";
import "../pages-css/EditProfile.css"; // Import external CSS

export const EditProfile = () => {
  const location = useLocation();
  const userData = location.state?.user; // Get passed user data

  // Initialize form data with received user details
  const [formData, setFormData] = useState({
    name: userData ? `${userData.First_name} ${userData.Last_name}` : "",
    email: userData ? userData.Email : "",
    bio: userData ? userData.Bio || "" : "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile Updated!");
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <label>
          Bio:
          <textarea name="bio" value={formData.bio} onChange={handleChange} />
        </label>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};
