import React, { useState } from "react";
import "../pages-css/Login.css";
import { useNavigate ,Link } from "react-router-dom";
import Cookies from 'js-cookie';
// import User from "../../../backend/Schema/User";


export const Login = () => {
  const [isPanelActive, setIsPanelActive] = useState(false);

  const [Regcredentials, SetRegcredentials] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [Logcredentials, Setlogcredentials] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleReg = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("http://localhost:2606/api/User", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Regcredentials),
            credentials: "include"
        });

        const json = await response.json();

        if (json.authtoken) {
            Cookies.set('token',json.authtoken );
            alert("Registered successfully!");
            navigate("/");
        } else {
            alert(json.message || "Registration failed");
        }
    } catch (error) {
        alert("An error occurred. Please try again later.");
        console.error(error);
    }
};

const HandleLog = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("http://localhost:2606/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Logcredentials),
            credentials: "include"
        });

        const json = await response.json();
        if (json.success && json.authtoken) {
            Cookies.set('token', json.authtoken);
          alert("Login successful!");
          if (json.user.Role[0].isDeliveryPerson===true) {
            navigate("/profile")
          } else {
            navigate("/");
          }
            
        } else {
            alert("Invalid credentials");
        }
    } catch (error) {
        console.error(error.message);
    }
};

  const RegChange = (e) => {
    const { name, value } = e.target;
    SetRegcredentials((prev) => ({ ...prev, [name]: value }));
  };

  const LogChange = (e) => {
    const { name, value } = e.target;
    Setlogcredentials((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
    className={`container ${isPanelActive ? "right-panel-active" : ""}`}
    id="container"
  >
    <div className="form-container sign-up-container">
      <form onSubmit={handleReg}>
        <h1>Registration</h1><br/>
        {/* <div className="social-container">
          {/* <a href="#" className="social">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="social">
            <i className="fab fa-google-plus-g"></i>
          </a>
          <a href="#" className="social">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div> */}
        <span>or use your email for registration</span>
        <input type="text" name="firstName" id="firstName" placeholder="First name" value={Regcredentials.firstName} onChange={RegChange}/>
        <input type="text" name="lastName" id="lastName" placeholder="Last name" value={Regcredentials.lastName} onChange={RegChange}/>
        <input type="email" name="email" id="email" placeholder="Email" value={Regcredentials.email} onChange={RegChange}/>
        <input type="text" name="mobile" id="mobile" placeholder="Mobile No" value={Regcredentials.mobile} onChange={RegChange}/>
        <input type="password" name="password" id="password" placeholder="Password" value={Regcredentials.password} onChange={RegChange} />
        <button>Register</button>
      </form>
    </div>

    <div className="form-container sign-in-container">
      <form onSubmit={HandleLog}>
        <h1>Login</h1><br/>
        {/* <div className="social-container">
          {/* <a href="#" className="social">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="social">
            <i className="fab fa-google-plus-g"></i>
          </a>
          <a href="#" className="social">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div> */}
        <span>or use your account</span>
        <input type="email" name="email" id="email2" placeholder="Email" value={Logcredentials.email} onChange={LogChange} />
        <input type="password" name="password" id="password2" placeholder="Password" value={Logcredentials.password} onChange={LogChange}/><br/>
        <p className="forget"><Link to="/ForgotPassword">Forgot your password?</Link></p><br/>
        <button>Login</button>
      </form>
    </div>

    <div className="overlay-container">
      <div className="overlay">
        <div className="overlay-panel overlay-left">
          <h1>Welcome Back!</h1><br/>
          <p>
            To keep connected with us please login with your personal info
          </p><br/>
          <button className="ghost" id="signIn" onClick={() => setIsPanelActive(false)}>Login</button>
        </div>
        <div className="overlay-panel overlay-right">
          <h1>Hello, Friend!</h1><br/>
          <p>Enter your personal details and start your journey with us</p><br/>
          <button className="ghost" id="signUp" onClick={() => setIsPanelActive(true)}>Registration</button>
        </div>
      </div>
    </div>
  </div>
  );
};
