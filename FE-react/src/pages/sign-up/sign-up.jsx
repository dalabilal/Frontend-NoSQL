import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../component/common/input/input.component";
import Select from "../../component/common/select/select.component";
import useNotification from "../../hook/notification.hook";
import Home from "../../assests/home.png";
import "./sign-up.css";
import "./ProfileForm.css"

const INTEREST_OPTIONS = [
  "Machine Learning",
  "Computer Vision",
  "AI Ethics",
  "Natural Language Processing",
  "Robotics",
];

const SignUp = () => {
  const navigate = useNavigate();
  const { setNotification } = useNotification();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");

  const [contact, setContact] = useState({
    phone: "",
    city: "",
    street: "",
  });

  const [researchInterests, setResearchInterests] = useState([]);
  const [role, setRole] = useState("user");

  const toggleInterest = (interest) => {
    setResearchInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };
  const saveUserToLocalStorage = (user) => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    storedUsers.push(user);
    localStorage.setItem("users", JSON.stringify(storedUsers));
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  // 🔒 Prevent duplicate email
  const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
  const emailExists = storedUsers.some((u) => u.email === email);

  if (emailExists) {
    setNotification({
      message: "Email already exists",
      status: "error",
    });
    return;
  }

  const newUser = {
    _id: Date.now().toString(),
    name,
    email,
    password, // ⚠️ only for demo, not secure
    department,
    contact,
    research_interests: researchInterests,
    role,
    profile_status: "pending",
    created_at: new Date().toISOString(),
    last_login: null,
    login_count: 0,
  };

  // ✅ Save to localStorage
  localStorage.setItem("users", JSON.stringify([...storedUsers, newUser]));

  setNotification({
    message: "Account created successfully",
    status: "success",
  });

  navigate("/signin");
};


  return (
    <div className="main1">
      <img
        src={Home}
        alt="home"
        className="img-sign"
        onClick={() => navigate("/")}
      />

      <form className="sign-up-form" onSubmit={handleSubmit}>
        <div className="title">
          <span>Sign Up</span>
        </div>

        <Input label="Name" required onChange={(e) => setName(e.target.value)} />
        <Input label="Email" required onChange={(e) => setEmail(e.target.value)} />
        <Input
          label="Password"
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Department */}


        {/* Contact */}
        <Input
          label="Phone"
          required
          onChange={(e) =>
            setContact({ ...contact, phone: e.target.value })
          }
        />
        <Input
          label="City"
          required
          onChange={(e) =>
            setContact({ ...contact, city: e.target.value })
          }
        />
        <Input
          label="Street"
          required
          onChange={(e) =>
            setContact({ ...contact, street: e.target.value })
          }
        />
        <Select
          label="Department"
          required
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">Select Department</option>
          <option value="Computer Engineering">Computer Engineering</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Artificial Intelligence">Artificial Intelligence</option>
        </Select>

        {/* Research Interests */}
        <div className="research-section">
          <p>Research Interests</p>
          <div className="interests">
            {INTEREST_OPTIONS.map((interest) => (
              <label key={interest} className="interest-item">
                <input
                  type="checkbox"
                  checked={researchInterests.includes(interest)}
                  onChange={() => toggleInterest(interest)}
                />
                {interest}
              </label>
            ))}
          </div>
        </div>


        <div className="span-text1">
          <span className="condition">Already have an account? </span>
          <span className="signin">
            <Link to="/signin">Sign in</Link>
          </span>
        </div>

        <div className="signIn-button">
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
