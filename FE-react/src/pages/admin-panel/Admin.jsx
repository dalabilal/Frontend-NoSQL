import React, { useState } from "react";
import "./admin.css";
import { Trash } from "phosphor-react";

const STORAGE_KEY = "users";

// ✅ Read localStorage ONCE (outside component)
const getInitialUsers = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const Admin = () => {
  // ✅ Initialize state DIRECTLY from localStorage
  const [users, setUsers] = useState(getInitialUsers);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // ✅ Single writer function
  const updateUsers = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
  };

  const toggleSelect = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const approveSelected = () => {
    updateUsers(
      users.map((u) =>
        selectedUsers.includes(u._id)
          ? { ...u, profile_status: "approved" }
          : u
      )
    );
    setSelectedUsers([]);
  };

  const deleteUser = (id) => {
    updateUsers(users.filter((u) => u._id !== id));
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <>
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
              {users.map((user) => (
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
                    <Trash
                      size={18}
                      style={{ cursor: "pointer" }}
                      onClick={() => deleteUser(user._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={approveSelected} className="approve-btn">
            Approve Selected
          </button>
        </>
      )}
    </div>
  );
};

export default Admin;
