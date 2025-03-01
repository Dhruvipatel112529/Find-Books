import "../pages-css/Profile.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Navbar } from "../components/Navbar";
import { ProfileMenu } from "../components/ProfileMenu";
import { useState, useEffect } from "react";
import { useAuth } from "../Context/AdminContext";
import { Plus } from "lucide-react";

export const Profile = () => {
    const [user, setUser] = useState(null);
    const [image, setImage] = useState(Cookies.get("profileImage") || "src/images/findbook.png");
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove('token'); 
        setUser(null); 
        navigate("/");
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
            Cookies.set("profileImage", imageUrl);
        }
    };

    useEffect(() => {
        const fetchCarts = async () => {
            try {
                const response = await fetch("http://localhost:2606/api/profile", {
                    credentials: "include",
                });
                const json = await response.json();
                if (!json.user) {
                    console.log("No user data available");
                    return;
                }
                
                setUser(json.user);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchCarts();
    }, []);

    return (
        <>
            <Navbar />
            <div className="profile-container">
                <ProfileMenu />
                <div className="profile-page">
                    <header className="profile-header">
                        <h1>My Profile</h1>
                    </header>
                    <section className="profile-details">
                        <div className="profile-image">
                            <img src={image} alt="Profile" className="profile-image" />
                            <label  className="upload-button">
                                <Plus size={16} />
                            </label>
                            <input
                                type="file"
                                id="imageUpload"
                                className="file-input"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        <div className="profile-info">
                            <p><strong>NAME  : </strong>{user ? `${user.First_name} ${user.Last_name}` : "Guest"}</p>
                            <p><strong>EMAIL : </strong>{user ? `${user.Email}` : "Not logged in"}</p>
                        </div>
                    </section>
                    <div className="profile-btn">
                        {user ? (
                            <>
                                <button className="edit-btn">Edit Profile</button>
                                <button className="log-out-btn" onClick={handleLogout}>Log Out</button>
                            </>
                        ) : (
                            <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};