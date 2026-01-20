import React, { useState } from "react";
import "./admin.css";
import { Trash } from "phosphor-react";

const USERS_KEY = "users";
const PROJECTS_KEY = "projects";
const PUBLICATIONS_KEY = "publications";

// ✅ Read localStorage ONCE
const getInitialUsers = () => {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// ✅ Top 5 Collaborative Researchers
const getTopCollaborativePairs = () => {
  const projects = JSON.parse(localStorage.getItem("projects")) || [];
  const publications = JSON.parse(localStorage.getItem("publications")) || [];

  const pairCount = {};

  const countPairs = (people = []) => {
    for (let i = 0; i < people.length; i++) {
      for (let j = i + 1; j < people.length; j++) {
        const pair = [people[i], people[j]].sort().join(" & ");
        pairCount[pair] = (pairCount[pair] || 0) + 1;
      }
    }
  };

  projects.forEach((p) => countPairs(p.researchers));
  publications.forEach((p) => countPairs(p.authors));

  return Object.entries(pairCount)
    .map(([pair, collaborations]) => ({ pair, collaborations }))
    .sort((a, b) => b.collaborations - a.collaborations)
    .slice(0, 5);
};

const getTopActiveUsers = () => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

    return users
      .filter((u) => u.last_login)
      .sort(
        (a, b) =>
          new Date(b.last_login).getTime() -
          new Date(a.last_login).getTime()
      )
      .slice(0, 5);
  };
const Admin = () => {
  const [users, setUsers] = useState(getInitialUsers);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const topPairs = getTopCollaborativePairs();
  const topActiveUsers = getTopActiveUsers();


  const updateUsers = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
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
      <h3 style={{ marginTop: "40px" }}>Top Active Users</h3>

      {topActiveUsers.length === 0 ? (
        <p>No active users yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Last Login</th>
            </tr>
          </thead>
          <tbody>
            {topActiveUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <span style={{ color: "green", fontSize: "18px" }}>●</span>
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.contact?.phone || "—"}</td>
                <td>
                  {new Date(user.last_login).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3 style={{ marginTop: "30px" }}>Top 5 Collaborative Pairs</h3>

      {topPairs.length === 0 ? (
        <p>No collaboration data found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Pair</th>
              <th>Collaborations</th>
            </tr>
          </thead>
          <tbody>
            {topPairs.map((p, index) => (
              <tr key={p.pair}>
                <td>{index + 1}</td>
                <td>{p.pair}</td>
                <td>{p.collaborations}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 👤 Users Table */}
      <h3 style={{ marginTop: "40px" }}>All Users</h3>

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
                <th>Interests</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.department}</td>
                  <td>{user.contact?.phone}</td>
                  <td>{user.research_interests?.join(", ")}</td>
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
