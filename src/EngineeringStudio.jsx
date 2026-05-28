import { useState } from "react";

import CADCanvas from "./CADCanvas";
import FanCurveEngine from "./FanCurveEngine";
import PsychrometricEngine from "./PsychrometricEngine";
import CoilEngine from "./CoilEngine";
import BOMEngine from "./BOMEngine";

import { generateEngineeringPDF }
from "./PDFReportEngine";

import "./App.css";

function EngineeringStudio() {

  const [activeModule, setActiveModule] =
    useState("AHU Studio");

  const [selectedComponent, setSelectedComponent] =
    useState(null);

  const [engineeringResults, setEngineeringResults] =
    useState(null);

  const [projectComponents, setProjectComponents] =
    useState([]);

  const modules = [

    "AHU Studio",
    "Cleanroom",
    "Psychrometric",
    "Fan Selection",
    "Duct Design",
    "BOM & Costing",
    "Reports",
  ];

  function updateSelected(key, value) {

    if (!selectedComponent) {
      return;
    }

    const updated = {

      ...selectedComponent,

      [key]: value,
    };

    setSelectedComponent(
      updated
    );

    if (
      window.updateSelectedCADComponent
    ) {

      window.updateSelectedCADComponent(
        updated
      );
    }
  }

  function exportPDF() {

    generateEngineeringPDF({

      projectName:
        "Pharma AHU Project",

      clientName:
        "Demo Client",

      engineeringResults,

      components:
        projectComponents,
    });
  }

  return (

    <div className="studio">

      <header className="studioTop">

        <div>

          <h1>
            Apfel Globus Engineering Studio
          </h1>

          <p>
            Professional HVAC • Pharma • Cleanroom Design Platform
          </p>

        </div>

        <div className="ribbon">

          <button>
            New Project
          </button>

          <button>
            Save
          </button>

          <button
            onClick={exportPDF}
          >
            Export PDF
          </button>

          <button>
            Export DXF
          </button>

        </div>

      </header>

      <div className="studioBody">

        <aside className="leftPanel">

          <h2>
            Modules
          </h2>

          {modules.map((m) => (

            <button

              key={m}

              className={

                activeModule === m

                  ? "activeBtn"

                  : ""
              }

              onClick={() =>
                setActiveModule(
                  m
                )
              }
            >
              {m}
            </button>

          ))}

        </aside>

        <main className="canvasArea">

          <div className="canvasHeader">

            <h2>
              {activeModule}
            </h2>

            <span>
              Live CAD + Engineering Platform
            </span>

          </div>

          <CADCanvas

            selectedComponent={
              selectedComponent
            }

            setSelectedComponent={
              setSelectedComponent
            }

            setEngineeringResults={
              setEngineeringResults
            }

            setProjectComponents={
              setProjectComponents
            }
          />

        </main>

        <aside className="rightPanel">

          <h2>
            Properties
          </h2>

          {!selectedComponent && (

            <div className="resultBox">

              <h3>
                No Component Selected
              </h3>

              <p>
                Click any component.
              </p>

            </div>

          )}

          {selectedComponent && (

            <>

              <label>
                Component Type
              </label>

              <input

                value={
                  selectedComponent.type
                }

                readOnly
              />

              <label>
                X Position
              </label>

              <input

                type="number"

                value={
                  selectedComponent.x
                }

                onChange={(e)=>

                  updateSelected(

                    "x",

                    Number(
                      e.target.value
                    )
                  )
                }
              />

              <label>
                Y Position
              </label>

              <input

                type="number"

                value={
                  selectedComponent.y
                }

                onChange={(e)=>

                  updateSelected(

                    "y",

                    Number(
                      e.target.value
                    )
                  )
                }
              />

              <label>
                Width
              </label>

              <input

                type="number"

                value={
                  selectedComponent.w
                }

                onChange={(e)=>

                  updateSelected(

                    "w",

                    Number(
                      e.target.value
                    )
                  )
                }
              />

              <label>
                Height
              </label>

              <input

                type="number"

                value={
                  selectedComponent.h
                }

                onChange={(e)=>

                  updateSelected(

                    "h",

                    Number(
                      e.target.value
                    )
                  )
                }
              />

              <label>
                Rotation
              </label>

              <input

                type="range"

                min="0"

                max="360"

                value={
                  selectedComponent.rotation || 0
                }

                onChange={(e)=>

                  updateSelected(

                    "rotation",

                    Number(
                      e.target.value
                    )
                  )
                }
              />

              <div className="rotationValue">

                {selectedComponent.rotation || 0}°

              </div>

            </>

          )}

          {engineeringResults && (

            <div className="resultBox">

              <h3>
                Live Engineering Results
              </h3>

              <p>
                Airflow:
                {" "}
                {engineeringResults.airflow}
                CMH
              </p>

              <p>
                Pressure:
                {" "}
                {engineeringResults.pressureDrop.toFixed(0)}
                Pa
              </p>

              <p>
                Velocity:
                {" "}
                {engineeringResults.faceVelocity.toFixed(2)}
                m/s
              </p>

              <p>
                Fan:
                {" "}
                {engineeringResults.fanKW.toFixed(2)}
                kW
              </p>

              <p>
                Motor:
                {" "}
                {engineeringResults.motorHP.toFixed(2)}
                HP
              </p>

              <p>
                AHU Length:
                {" "}
                {engineeringResults.totalLength}
                mm
              </p>

            </div>

          )}

          {engineeringResults && (

            <FanCurveEngine

              results={
                engineeringResults
              }
            />

          )}

          <PsychrometricEngine />

          <CoilEngine />

          <BOMEngine

            components={
              projectComponents
            }
          />

        </aside>

      </div>

      <footer className="bottomPanel">

        <strong>
          Calculation Log:
        </strong>

        {" "}

        Full engineering platform active.

      </footer>

    </div>

  );
}

export default EngineeringStudio;