import React, { useState } from "react";
import "./admin.css";
// import { Trash } from "@phosphor-icons/react";


// Mock users (same as signup structure)
const MOCK_USERS = [
  {
    _id: "1",
    name: "Ahmed Khaled",
    email: "ahmed@gmail.com",
    department: "Computer Science",
    contact: { phone: "0591234567", city: "Gaza", street: "Al-Wehda" },
    profile_status: "pending",
    role: "researcher",
    research_interests: ["Machine Learning", "AI Ethics"],
    created_at: "2024-01-10",
    last_login: "2024-01-20",
    login_count: 5,
  },
  {
    _id: "2",
    name: "Sara Ali",
    email: "sara@gmail.com",
    department: "Artificial Intelligence",
    contact: { phone: "0599876543", city: "Ramallah", street: "Main St" },
    profile_status: "approved",
    role: "researcher",
    research_interests: ["Computer Vision"],
    created_at: "2024-02-01",
    last_login: "2024-02-10",
    login_count: 2,
  },
];

const Admin = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const toggleSelect = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const approveSelected = () => {
    setUsers((prev) =>
      prev.map((u) =>
        selectedUsers.includes(u._id)
          ? { ...u, profile_status: "approved" }
          : u
      )
    );
    setSelectedUsers([]);
  };

  const deleteUser = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u._id === id ? { ...u, profile_status: "deleted" } : u
      )
    );
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Interests</th>
            <th>Approve</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {users
            .filter((u) => u.profile_status !== "deleted")
            .map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.department}</td>
                <td>{user.contact.phone}</td>
                <td className={`status ${user.profile_status}`}>
                  {user.profile_status}
                </td>
                <td>{user.research_interests.join(", ")}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => toggleSelect(user._id)}
                    disabled={user.profile_status === "approved"}
                  />
                </td>
                <td>
                  {/* <Trash
                    size={18}
                    onClick={() => deleteUser(user._id)}
                    style={{ cursor: "pointer" }}
                  /> */}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <button onClick={approveSelected} className="approve-btn">
        Approve Selected
      </button>
    </div>
  );
};

export default Admin;
