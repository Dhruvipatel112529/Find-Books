import { useState, useEffect } from 'react';
import { FaBars, FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { GiMagnifyingGlass } from "react-icons/gi";
import { GiBookmark } from "react-icons/gi";
import { MdCategory, MdLibraryBooks } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import '../components-css/Navbar.css';
import Cookies from "js-cookie";
import { Category } from "../pages/Category"
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [showCategory, setShowCategory] = useState(false); // State to toggle Category visibility
  const [scrolling, setScrolling] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => {
    setMenuActive(false); // Close menu when an item is clicked
  };

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const handleLogout = () => {
    Cookies.remove('token');
  };

  const openCat = () => {
    setShowCategory(!showCategory); // Toggle the Category component visibility
    closeMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Function to check if token is available in cookies
  const checkToken = () => {
    const token = Cookies.get("token"); // Get the token from cookies
    if (token) {
      // If token is available, navigate to the BookForm
      navigate("/BookForm");
    } else {
      // If no token, navigate to the login page
      navigate("/login");
    }
  };

  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const checkTokencart = () => {
    const token = Cookies.get("token"); // Get the token from cookies
    if (token) {
      // If token is available, navigate to the cart
      navigate("/cart");
    } else {
      // If no token, navigate to the login page
      navigate("/login");
    }
  };

  return (
    <>
      <div className='navbar-container'>
      <nav className={`navbar ${scrolling  ? 'scrolled' : ''}`}>
          <div className='webname-container'>
            <div className="mobile-menu-icon" onClick={toggleMenu}>
              <FaBars />
            </div>
            <img src='src/images/findbook.png' className='logo-img' />
            <div className="appname"><NavLink to="/">FINDB<GiMagnifyingGlass className='glass' />OKS</NavLink></div>
          </div>
          <div className={`menulist ${menuActive ? 'active' : ''}`}>
            <NavLink to="/"><FaHome /> Home</NavLink>
            <NavLink to="#" onClick={checkToken}>
              <MdLibraryBooks /> SellBooks
            </NavLink>
            <NavLink to="#" onClick={openCat}  ><GiBookmark /> Category</NavLink>
            <NavLink to="#" onClick={checkTokencart}><FaShoppingCart /> Cart</NavLink>
            <NavLink to="/Profile"><FaUserCircle /> Profile</NavLink>
          </div>
          <div className='login'>
            {!Cookies.get('token') ? (<NavLink to="/login"><button className='login-btn'>login</button></NavLink>)
              : (<NavLink to="/"><button className='login-btn' onClick={handleLogout}>logout</button></NavLink>)}
          </div>
        </nav>
      </div>
      {showCategory && <Category />} {/* Conditionally render the Category component */}
    </>
  );
};
