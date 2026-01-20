import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../service/UserContext";
import useNotification from "../../hook/notification.hook";
import InputPassword from "../../component/common/input-password/inputpassword.component";
import logo from "../../assests/logo.jpg";
import Input from "../../component/common/input/input.component";
import Home from "../../assests/home.png";
import "./login.css";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setNotification } = useNotification();
  const { setUserRole, setNoUser, verificationCode, setEmailVerify } =
    useUser();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setNotification({ message: "Invalid email format", status: "error" });
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // 🔍 Find user by email
    const user = storedUsers.find((u) => u.email === email);

    if (!user) {
      setNotification({
        message: "No account found with this email",
        status: "error",
      });
      return;
    }

    // 🔐 Match password
    if (user.password !== password) {
      setNotification({
        message: "Invalid email or password",
        status: "error",
      });
      return;
    }

    // ⛔ Block pending users
    if (user.profile_status === "pending") {
      setNotification({
        message: "Your account is pending admin approval",
        status: "warning",
      });
      return;
    }

    // ✅ Save logged-in user session
    localStorage.setItem(
      "loggedUser",
      JSON.stringify({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      })
    );
    // 🔄 Update login activity
    const updatedUsers = storedUsers.map((u) =>
      u.email === email
        ? {
          ...u,
          last_login: new Date().toISOString(),
          login_count: (u.login_count || 0) + 1,
          isActive: true,
        }
        : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setUserRole(user.role);
    setNoUser(false);

    setNotification({
      message: "Login successful!",
      status: "success",
    });

    navigate("/create-research");
  };

  return (
    <div className="main">
      <img
        src={Home}
        alt="homepage"
        className="img-sign"
        onClick={() => navigate("/")}
      />
      <div className="sign-in-form">
        <div className="title">
          <span>Sign In</span>
        </div>
        <form onSubmit={handleSubmit}>
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <InputPassword
            label="Password"
            value={password}
            placeholder="************"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="span-text">
            <span className="condition">You Don't have an account yet?</span>
            <span className="sign-up">
              <Link to={"/signup"}>Sign up</Link>
            </span>
          </div>
          <div className="signIn-button">
            <button type="submit">Sign In</button>
          </div>
        </form>
      </div>
      {/* <img src={logo} alt="" className="img-log" /> */}
    </div>
  );
};

export default SignInForm;
