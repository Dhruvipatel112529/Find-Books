import "../pages-css/Profile.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Navbar } from "../components/Navbar";
import { ProfileMenu } from "../components/ProfileMenu";
import { useState, useEffect } from "react";
import { useAuth } from "../Context/AdminContext";
import { Plus, Mail, Phone, User, MapPin, Calendar } from "lucide-react";
import Load from "../components/Load";

export const Profile = () => {
    const [user, setUser] = useState(null);
    const [image, setImage] = useState(Cookies.get("profileImage") || "src/images/findbook.png");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user: authUser } = useAuth();

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
        const fetchProfile = async () => {
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
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="profile-container">
                    <ProfileMenu />
                    <div className="profile-page">
                        <Load />
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="profile-container">
                <ProfileMenu />
                <div className="profile-page">
                    <header className="profile-header">
                        <h1>My Profile</h1>
                        <p className="profile-subtitle">Manage your account settings and preferences</p>
                    </header>
                    
                    <section className="profile-details">
                        <div className="profile-image-section">
                            <div className="profile-image-container">
                                <img src={image} alt="Profile" className="profile-image" />
                                <label className="upload-button" title="Change profile picture">
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
                            <h2 className="profile-name">{user ? `${user.First_name} ${user.Last_name}` : "Guest"}</h2>
                            <p className="profile-role">{user?.isAdmin ? "Administrator" : "User"}</p>
                        </div>

                        <div className="profile-info">
                            <div className="info-section">
                                <h3>Personal Information</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <Mail className="info-icon" />
                                        <div className="info-content">
                                            <label>Email Address</label>
                                            <span>{user?.Email || "Not provided"}</span>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <Phone className="info-icon" />
                                        <div className="info-content">
                                            <label>Phone Number</label>
                                            <span>{user?.Phone_no || "Not provided"}</span>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <User className="info-icon" />
                                        <div className="info-content">
                                            <label>Account Type</label>
                                            <span>{user?.isAdmin ? "Administrator" : "Regular User"}</span>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <Calendar className="info-icon" />
                                        <div className="info-content">
                                            <label>Member Since</label>
                                            <span>{new Date(user?.createdAt).toLocaleDateString() || "Not available"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="profile-actions">
                        <button 
                            className="edit-btn"
                            onClick={() => navigate("/EditProfile", { state: { user } })}
                            title="Edit your profile information"
                        >
                            Edit Profile
                        </button>
                        <button 
                            className="log-out-btn"
                            onClick={handleLogout}
                            title="Log out of your account"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};