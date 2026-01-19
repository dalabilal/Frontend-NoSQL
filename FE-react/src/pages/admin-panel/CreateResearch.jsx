import React, { useState } from "react";
import "./reserach.css";

const RESEARCHERS = [
  "Alice Smith",
  "Bob Johnson",
  "Charlie Lee",
  "Dana White",
  "Eve Adams",
];

const CreateResearch = () => {
  const [projectForm, setProjectForm] = useState({
    title: "",
    research_area: "",
    status: "",
    budget: "",
  });

  const [projects, setProjects] = useState([]);

  // Track selected researcher per project row
  const [selectedResearchers, setSelectedResearchers] = useState({});

  const handleChange = (e) => {
    setProjectForm({ ...projectForm, [e.target.name]: e.target.value });
  };

  const createProject = () => {
    if (!projectForm.title) return alert("Title required");

    setProjects([
      ...projects,
      { ...projectForm, researchers: [] }, // initialize empty researchers array
    ]);

    setProjectForm({
      title: "",
      research_area: "",
      status: "",
      budget: "",
    });
  };

  const handleResearcherChange = (index, researcher) => {
    setSelectedResearchers({ ...selectedResearchers, [index]: researcher });
  };

  const confirmResearcher = (index) => {
    const researcher = selectedResearchers[index];
    if (!researcher) return alert("Select a researcher first");

    const updatedProjects = [...projects];
    // Add researcher only if not already in the array
    if (!updatedProjects[index].researchers.includes(researcher)) {
      updatedProjects[index].researchers.push(researcher);
      setProjects(updatedProjects);
    }

    // Reset the select for that row
    setSelectedResearchers({ ...selectedResearchers, [index]: "" });
  };

  return (
    <div className="all-users">
      {/* ========== CREATE PROJECT FORM ========== */}
      <h2>Create Project</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Research Area</th>
            <th>Status</th>
            <th>Budget</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                name="title"
                value={projectForm.title}
                onChange={handleChange}
              />
            </td>
            <td>
              <input
                name="research_area"
                value={projectForm.research_area}
                onChange={handleChange}
              />
            </td>
            <td>
              <select
                name="status"
                value={projectForm.status}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="planned">Planned</option>
              </select>
            </td>
            <td>
              <input
                name="budget"
                type="number"
                value={projectForm.budget}
                onChange={handleChange}
              />
            </td>
            <td>
              <button id="approve" onClick={createProject}>
                Create
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ========== PROJECTS LIST ========== */}
      {projects.length > 0 && (
        <>
          <h2 style={{ marginTop: "40px" }}>Projects List</h2>

          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Research Area</th>
                <th>Status</th>
                <th>Budget</th>
                <th>Assign Researchers</th>
                <th>Researchers</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={index}>
                  <td>{project.title}</td>
                  <td>{project.research_area}</td>
                  <td>{project.status}</td>
                  <td>{project.budget}</td>
                      <td>
                        {project.researchers.length > 0
                          ? project.researchers.join(", ")
                          : "None"}
                      </td>
                  <td>
                    <select
                      value={selectedResearchers[index] || ""}
                      onChange={(e) =>
                        handleResearcherChange(index, e.target.value)
                      }
                    >
                      <option value="">Select Researcher</option>
                      {RESEARCHERS.map((r, i) => (
                        <option key={i} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <button
                      style={{ marginLeft: "5px" }}
                      onClick={() => confirmResearcher(index)}
                    >
                      Confirm
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default CreateResearch;
