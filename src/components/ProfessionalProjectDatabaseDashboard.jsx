import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../authEngine";
import { useProject } from "../context/ProjectContext";

export default function ProfessionalProjectDatabaseDashboard() {
  const { updateProjectData } = useProject();

  const [projects, setProjects] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [message, setMessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setMessage("Loading projects...");

    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*");

    if (projectError) {
      setMessage(projectError.message);
      return;
    }

    setProjects(projectData || []);
    setProfiles(profileData || []);
    setMessage("");
  }

  async function deleteProject(projectId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Project deleted successfully.");
    await loadProjects();
  }

  function openProject(project) {
    const savedData =
      project.project_data?.projectData ||
      project.input_data ||
      project.project_data ||
      {};

    updateProjectData(savedData);
    setMessage("Project loaded into design modules.");
  }

  function exportCSV() {
    const rows = filteredProjects.map((p) => ({
      Project_Name: p.project_name || "",
      Client_Name: p.client_name || "",
      Location: p.location || "",
      Application: p.application || "",
      Created_At: formatDate(p.created_at),
      User: getUserEmail(p.user_id),
    }));

    const headers = Object.keys(rows[0] || {});
    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers.map((h) => `"${String(row[h] || "").replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "hvac-projects.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  }

  function getUserEmail(userId) {
    const user = profiles.find((p) => p.id === userId);
    return user?.email || userId || "-";
  }

  const filteredProjects = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    if (!q) return projects;

    return projects.filter((p) => {
      return (
        String(p.project_name || "").toLowerCase().includes(q) ||
        String(p.client_name || "").toLowerCase().includes(q) ||
        String(p.location || "").toLowerCase().includes(q) ||
        String(p.application || "").toLowerCase().includes(q) ||
        String(getUserEmail(p.user_id) || "").toLowerCase().includes(q)
      );
    });
  }, [projects, profiles, searchText]);

  const totalProjects = projects.length;
  const totalClients = new Set(projects.map((p) => p.client_name).filter(Boolean)).size;
  const totalUsers = new Set(projects.map((p) => p.user_id).filter(Boolean)).size;

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Professional Project Database Dashboard V2</h1>

      <p style={styles.subHeading}>
        View, search, load, delete, and export saved HVAC AHU projects.
      </p>

      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.summaryCard}>
        <SummaryBox label="Total Projects" value={totalProjects} />
        <SummaryBox label="Total Clients" value={totalClients} />
        <SummaryBox label="Users With Projects" value={totalUsers} />
        <SummaryBox label="Filtered Results" value={filteredProjects.length} />
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Project Search</h2>

        <div style={styles.searchRow}>
          <input
            style={styles.searchInput}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by project, client, location, application, or user email..."
          />

          <button style={styles.blueButton} onClick={loadProjects}>
            Refresh
          </button>

          <button style={styles.greenButton} onClick={exportCSV}>
            Export CSV
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Saved Projects</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Project Name</th>
              <th style={styles.th}>Client</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Application</th>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Created</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProjects.length === 0 ? (
              <tr>
                <td style={styles.td} colSpan="7">
                  No projects found.
                </td>
              </tr>
            ) : (
              filteredProjects.map((project) => (
                <tr key={project.id}>
                  <td style={styles.td}>{project.project_name || "-"}</td>
                  <td style={styles.td}>{project.client_name || "-"}</td>
                  <td style={styles.td}>{project.location || "-"}</td>
                  <td style={styles.td}>{project.application || "-"}</td>
                  <td style={styles.td}>{getUserEmail(project.user_id)}</td>
                  <td style={styles.td}>{formatDate(project.created_at)}</td>

                  <td style={styles.td}>
                    <button
                      style={styles.greenButton}
                      onClick={() => openProject(project)}
                    >
                      Open
                    </button>

                    <button
                      style={styles.blueButton}
                      onClick={() => setSelectedProject(project)}
                    >
                      View
                    </button>

                    <button
                      style={styles.redButton}
                      onClick={() => deleteProject(project.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedProject && (
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Project Details</h2>

          <button
            style={styles.redButton}
            onClick={() => setSelectedProject(null)}
          >
            Close Details
          </button>

          <div style={styles.detailsGrid}>
            <DetailBox label="Project Name" value={selectedProject.project_name} />
            <DetailBox label="Client Name" value={selectedProject.client_name} />
            <DetailBox label="Location" value={selectedProject.location} />
            <DetailBox label="Application" value={selectedProject.application} />
            <DetailBox label="User" value={getUserEmail(selectedProject.user_id)} />
            <DetailBox label="Created At" value={formatDate(selectedProject.created_at)} />
          </div>

          <h3 style={styles.jsonTitle}>Stored Project Data</h3>

          <pre style={styles.jsonBox}>
            {JSON.stringify(
              selectedProject.project_data ||
                selectedProject.input_data ||
                selectedProject,
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
}

function SummaryBox({ label, value }) {
  return (
    <div style={styles.summaryBox}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function DetailBox({ label, value }) {
  return (
    <div style={styles.detailBox}>
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

const styles = {
  page: { minHeight: "100vh" },

  heading: {
    fontSize: "40px",
    fontWeight: "800",
    color: "#111827",
    marginBottom: "10px",
  },

  subHeading: {
    fontSize: "18px",
    color: "#374151",
    marginBottom: "22px",
  },

  message: {
    background: "#fef3c7",
    padding: "14px",
    borderRadius: "12px",
    marginBottom: "18px",
    fontWeight: "800",
  },

  summaryCard: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  },

  summaryBox: {
    background: "#111827",
    color: "white",
    borderRadius: "18px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  card: {
    background: "white",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    marginBottom: "30px",
    overflowX: "auto",
  },

  sectionTitle: {
    fontSize: "24px",
    color: "#111827",
    borderBottom: "2px solid #e60000",
    paddingBottom: "8px",
    marginBottom: "20px",
  },

  searchRow: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },

  searchInput: {
    flex: 1,
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    fontSize: "16px",
    outline: "none",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1250px",
  },

  th: {
    background: "#111827",
    color: "white",
    padding: "14px",
    textAlign: "left",
  },

  td: {
    borderBottom: "1px solid #e5e7eb",
    padding: "14px",
    verticalAlign: "top",
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginTop: "20px",
  },

  detailBox: {
    background: "#f3f4f6",
    borderRadius: "14px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  jsonTitle: {
    marginTop: "25px",
    marginBottom: "12px",
    fontSize: "20px",
  },

  jsonBox: {
    background: "#111827",
    color: "white",
    borderRadius: "16px",
    padding: "20px",
    overflowX: "auto",
    fontSize: "13px",
    maxHeight: "420px",
  },

  greenButton: button("#16a34a"),
  blueButton: button("#2563eb"),
  redButton: button("#dc2626"),
};

function button(bg) {
  return {
    background: bg,
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "10px 14px",
    fontWeight: "800",
    cursor: "pointer",
    marginRight: "8px",
    marginBottom: "6px",
  };
}