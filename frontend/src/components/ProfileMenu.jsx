import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "../components-css/ProfileMenu.css";
import Load from "../components/Load";
import { MdDashboard } from "react-icons/md";
import { ImBooks } from "react-icons/im";
import { MdOutlineSell } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaBars, FaShoppingCart, FaUserCircle } from 'react-icons/fa';

export function ProfileMenu() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const GetUser = async () => {
      try {
        const response = await fetch("http://localhost:2606/api/User", {
          credentials: "include",
        });
        const json = await response.json();
        setAdmin(json.user.isAdmin);

        if(loading){
          return <div><Load/></div>;
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    GetUser();
  }, []);

  const handleAdminClick = (e) => {
    if (admin) {
      e.preventDefault(); // Prevent default <Link> behavior
      navigate("/Admin");
    }
  };

  return (
    <div className="profile-container">
      <div className="side-menu">
        <h3 className="menu-title"><FaUserCircle/> My Account</h3>
        {!loading && (
          <ul>
            {admin && (
              <li className="menu-item">
                <Link to="/Admin" onClick={handleAdminClick}><MdDashboard/> Dashboard</Link>
              </li>
            )}
            <li className="menu-item"><Link to="/Profile"><CgProfile/> My Profile</Link></li>
            <li className="menu-item"><Link to="/Orders"><ImBooks/> Orders</Link></li>
            <li className="menu-item"><Link to="/Sellorders"><MdOutlineSell/> Sell Orders</Link></li>
          </ul>
        )}
      </div>
    </div>
  );
}
