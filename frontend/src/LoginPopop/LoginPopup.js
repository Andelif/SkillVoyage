import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import cross_icon_dark from "../assets/cross_icon_dark.png";
import eye_icon from "../assets/eye_icon.png";
import eye_icon_closed from "../assets/eye_icon_closed.png";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import { AuthContext } from "../adminPanel/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPopup = ({ setShowLogin, theme }) => {
  const { url, setAccessToken, setRefreshToken } = useContext(StoreContext);
  const { user, loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    try {
      const response = await axios.post(newUrl, data);
      console.log(response.data); // Check the response data

      if (response.data.success) {
        const { accessToken, refreshToken, user } = response.data.data || {};

        if (accessToken && refreshToken) {
          localStorage.setItem("user", JSON.stringify(user)); // Save user data
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          loginUser(user); // Update the user context
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
          setShowLogin(false);

          //Redirect to Admin Panel if the logged-in user is an admin
          const mail = user.email;

          if (mail === "andelif33@gmail.com") {
            localStorage.setItem("isAdmin", true);
          } else {
            localStorage.removeItem("isAdmin");
          }
          navigate("/home");

          window.location.reload();
        } else {
          //console.error("Access token or refresh token is missing in the response");
          localStorage.setItem("user", JSON.stringify(user)); // Save user data
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          loginUser(user); // Update the user context
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
          setShowLogin(false);
        }
      } else {
        alert(response.data.message);
        console.log("Problem in onLogin of loginpopup");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className={`login-popup ${theme}`}>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={cross_icon_dark}
            alt="Close"
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? null : (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Name"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Email"
            required
          />
          <div className="Pass">
            <input
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Password"
              required
              className="password-input"
            />
            <img
              src={isPasswordVisible ? eye_icon_closed :  eye_icon}
              alt="Toggle visibility"
              className="password-visibility-toggle"
              onClick={() => setPasswordVisible(!isPasswordVisible)}
            />
          </div>
        </div>
        <button type="submit">
          {currState === "Sign Up" ? "Create account" : "Login"}
        </button>

        {currState === "Login" ? (
          <p>
            Don't have an account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>
              <p className="link_line">Click here</p>
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>
              <p className="link_line">Login</p>
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
