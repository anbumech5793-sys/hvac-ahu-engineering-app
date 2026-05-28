function ProjectManager({
  projectName,
  setProjectName,
  components,
  setProjectComponents,
}) {
  function saveProject() {
    const projectData = {
      projectName,
      components,
      savedAt: new Date().toLocaleString(),
    };

    localStorage.setItem(
      "apfelGlobusProject",
      JSON.stringify(projectData)
    );

    alert("Project saved");
  }

  function loadProject() {
    const saved = localStorage.getItem("apfelGlobusProject");

    if (!saved) {
      alert("No saved project found");
      return;
    }

    const projectData = JSON.parse(saved);

    setProjectName(projectData.projectName || "");
    setProjectComponents(projectData.components || []);

    alert("Project loaded");
  }

  function clearProject() {
    localStorage.removeItem("apfelGlobusProject");
    alert("Saved project cleared");
  }

  return (
    <div className="projectPanel">
      <h3>Project Manager</h3>

      <input
        placeholder="Project Name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />

      <button onClick={saveProject}>Save Project</button>
      <button onClick={loadProject}>Load Project</button>
      <button onClick={clearProject}>Clear Saved Project</button>
    </div>
  );
}

export default ProjectManager;