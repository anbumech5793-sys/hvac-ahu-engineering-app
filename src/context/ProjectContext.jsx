import React, { createContext, useContext, useMemo, useState } from "react";
import { runMasterAHUDesignEngine } from "../engines/MasterAHUDesignEngine";

const ProjectContext = createContext();

const defaultProjectData = {
  projectName: "",
  clientName: "",
  location: "",
  roomName: "",

  roomLength: 10,
  roomWidth: 8,
  roomHeight: 3,

  peopleCount: 10,
  lightingLoad: 1200,
  equipmentLoad: 2500,

  indoorTemp: 24,
  outdoorTemp: 35,
  relativeHumidity: 55,

  freshAirCFM: 0,

  wallU: 1.8,
  roofU: 1.5,
  glassU: 5.7,
  glassArea: 0,
  solarFactor: 180,
};

export function ProjectProvider({ children }) {
  const [projectData, setProjectData] = useState(defaultProjectData);

  const designResult = useMemo(() => {
    return runMasterAHUDesignEngine(projectData);
  }, [projectData]);

  const updateProjectData = (newData) => {
    setProjectData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  return (
    <ProjectContext.Provider
      value={{
        projectData,
        updateProjectData,
        designResult,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}