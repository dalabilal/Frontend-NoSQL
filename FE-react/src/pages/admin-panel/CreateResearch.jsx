import React, { useState, useEffect } from "react";

import "./reserach.css";


const CreateResearch = () => {
  const [researchers, setResearchers] = useState([]);

  const [projectForm, setProjectForm] = useState({
    title: "",
    research_area: "",
    status: "",
    budget: "",
    description: "",
  });




  const [publicationForm, setPublicationForm] = useState({
    title: "",
    year: "",
    citations: "",
  });


  const [selectedAuthors, setSelectedAuthors] = useState({});
  const [selectedResearchers, setSelectedResearchers] = useState({});
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    const approvedResearchers = storedUsers.filter(
      (u) => u.role === "researcher" && u.profile_status === "approved"
    );

    setResearchers(approvedResearchers);
  }, []);

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("projects");
    return saved ? JSON.parse(saved) : [];
  });

  const [publications, setPublications] = useState(() => {
    const saved = localStorage.getItem("publications");
    return saved ? JSON.parse(saved) : [];
  });



  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("publications", JSON.stringify(publications));
  }, [publications]);

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
  const handlePublicationChange = (e) => {
    setPublicationForm({
      ...publicationForm,
      [e.target.name]: e.target.value,
    });
  };

  const createPublication = () => {
    if (!publicationForm.title) {
      return alert("Title is required");
    }

    setPublications([
      ...publications,
      { ...publicationForm, authors: [] },
    ]);

    setPublicationForm({
      title: "",
      year: "",
      citations: "",
    });
  };
  const handleAuthorChange = (index, author) => {
    setSelectedAuthors({ ...selectedAuthors, [index]: author });
  };

  const confirmAuthor = (index) => {
    const author = selectedAuthors[index];
    if (!author) return alert("Select an author first");

    const updatedPublications = [...publications];

    if (!updatedPublications[index].authors.includes(author)) {
      updatedPublications[index].authors.push(author);
      setPublications(updatedPublications);
    }

    setSelectedAuthors({ ...selectedAuthors, [index]: "" });
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
            <th>Description</th>
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
              <input
                name="description"
                value={projectForm.description}
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
                <th>Description</th>
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
                  <td>{project.description}</td>
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
                      {researchers.map((r) => (
                        <option key={r._id} value={r.name}>
                          {r.name}
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
      <h2 style={{ marginTop: "40px" }}>Create Publication</h2>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Year</th>
            <th>Citations</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                name="title"
                value={publicationForm.title}
                onChange={handlePublicationChange}
              />
            </td>
            <td>
              <input
                name="year"
                type="number"
                value={publicationForm.year}
                onChange={handlePublicationChange}
              />
            </td>
            <td>
              <input
                name="citations"
                type="number"
                value={publicationForm.citations}
                onChange={handlePublicationChange}
              />
            </td>
            <td>
              <button id="approve" onClick={createPublication}>
                Create
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {publications.length > 0 && (
        <>
          <h2 style={{ marginTop: "40px" }}>Publications List</h2>

          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Year</th>
                <th>Citations</th>
                <th>Assign Author</th>
                <th>Authors</th>
              </tr>
            </thead>
            <tbody>
              {publications.map((pub, index) => (
                <tr key={index}>
                  <td>{pub.title}</td>
                  <td>{pub.year}</td>
                  <td>{pub.citations}</td>
                  <td>
                    {pub.authors.length > 0
                      ? pub.authors.join(", ")
                      : "None"}
                  </td>
                  <td>
                    <select
                      value={selectedAuthors[index] || ""}
                      onChange={(e) =>
                        handleAuthorChange(index, e.target.value)
                      }
                    >
                      <option value="">Select Researcher</option>
                      {researchers.map((r) => (
                        <option key={r._id} value={r.name}>
                          {r.name}
                        </option>
                      ))}

                    </select>

                    <button
                      style={{ marginLeft: "5px" }}
                      onClick={() => confirmAuthor(index)}
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
