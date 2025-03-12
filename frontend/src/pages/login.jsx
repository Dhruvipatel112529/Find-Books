import React, { useState } from "react";
import "../pages-css/Login.css";
import { useNavigate, Link } from "react-router-dom";
import Cookies from 'js-cookie';

export const Login = () => {
  const [isPanelActive, setIsPanelActive] = useState(false);
  const [errors, setErrors] = useState({});

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

  const validateRegistration = () => {
    const newErrors = {};

    // First Name validation
    if (Regcredentials.firstName.trim().length < 2) {
      newErrors.firstName = "First name is required and must be at least 2 characters";
    }

    // Last Name validation
    if (Regcredentials.lastName.trim().length < 2) {
      newErrors.lastName = "Last name is required and must be at least 2 characters";
    }

    // Email validation
    if (!Regcredentials.email.toLowerCase().endsWith("@gmail.com")) {
      newErrors.email = "Please enter a valid Gmail address";
    }

    // Mobile validation
    if (!/^\d{10}$/.test(Regcredentials.mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits";
    }

    // Password validation
    if (Regcredentials.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLogin = () => {
    const newErrors = {};

    // Email validation
    if (!Logcredentials.email.toLowerCase().endsWith("@gmail.com")) {
      newErrors.loginEmail = "Please enter a valid Gmail address";
    }

    // Password validation
    if (Logcredentials.password.length < 6) {
      newErrors.loginPassword = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReg = async (e) => {
    e.preventDefault();
    if (!validateRegistration()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:2606/api/User", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Regcredentials),
        credentials: "include"
      });

      const json = await response.json();

      if (json.authtoken) {
        Cookies.set('token', json.authtoken);
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
    if (!validateLogin()) {
      return;
    }

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
        navigate("/");
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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const LogChange = (e) => {
    const { name, value } = e.target;
    Setlogcredentials((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[`login${name.charAt(0).toUpperCase() + name.slice(1)}`]) {
      setErrors(prev => ({ ...prev, [`login${name.charAt(0).toUpperCase() + name.slice(1)}`]: "" }));
    }
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
        <div className="input-group">
          <input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="First name"
            value={Regcredentials.firstName}
            onChange={RegChange}
            className={errors.firstName ? 'error' : ''}
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </div>
        <div className="input-group">
          <input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Last name"
            value={Regcredentials.lastName}
            onChange={RegChange}
            className={errors.lastName ? 'error' : ''}
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>
        <div className="input-group">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={Regcredentials.email}
            onChange={RegChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        <div className="input-group">
          <input
            type="text"
            name="mobile"
            id="mobile"
            placeholder="Mobile No"
            value={Regcredentials.mobile}
            onChange={RegChange}
            className={errors.mobile ? 'error' : ''}
            maxLength="10"
          />
          {errors.mobile && <span className="error-message">{errors.mobile}</span>}
        </div>
        <div className="input-group">
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={Regcredentials.password}
            onChange={RegChange}
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>
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
        <div className="input-group">
          <input
            type="email"
            name="email"
            id="email2"
            placeholder="Email"
            value={Logcredentials.email}
            onChange={LogChange}
            className={errors.loginEmail ? 'error' : ''}
          />
          {errors.loginEmail && <span className="error-message">{errors.loginEmail}</span>}
        </div>
        <div className="input-group">
          <input
            type="password"
            name="password"
            id="password2"
            placeholder="Password"
            value={Logcredentials.password}
            onChange={LogChange}
            className={errors.loginPassword ? 'error' : ''}
          />
          {errors.loginPassword && <span className="error-message">{errors.loginPassword}</span>}
        </div>
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
