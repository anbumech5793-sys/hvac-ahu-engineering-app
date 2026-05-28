import { useState } from "react";
import { calculateEngineeringSystem } from "./engineeringEngine";

const GRID_SIZE = 25;

function snap(value) {
  return Math.max(
    GRID_SIZE,
    Math.round(value / GRID_SIZE) * GRID_SIZE
  );
}

function CADCanvas({
  selectedComponent,
  setSelectedComponent,
  setEngineeringResults,
  setProjectComponents,
}) {
  const [components, setComponents] =
    useState([]);

  const [connections, setConnections] =
    useState([]);

  const [dragItem, setDragItem] =
    useState(null);

  const [resizingId, setResizingId] =
    useState(null);

  const [showDimensions, setShowDimensions] =
    useState(true);

  const [connectionMode, setConnectionMode] =
    useState(false);

  const [connectionStart, setConnectionStart] =
    useState(null);

  const library = [
    { type:"Filter", color:"#dddddd", w:100, h:80 },
    { type:"Coil", color:"#cce5ff", w:120, h:80 },
    { type:"Fan", color:"#ffe6cc", w:90, h:90 },
    { type:"Motor", color:"#e6ffe6", w:110, h:80 },
    { type:"Damper", color:"#ffd6d6", w:90, h:70 },
  ];

  function getCenter(c) {
    if (c.type === "Fan") {
      return { x:c.x, y:c.y };
    }

    return {
      x:c.x + c.w/2,
      y:c.y + c.h/2,
    };
  }

  function refreshAll(updatedComponents) {

    setProjectComponents(
      updatedComponents
    );

    const results =
      calculateEngineeringSystem(
        updatedComponents
      );

    setEngineeringResults(
      results
    );
  }

  function addComponent(item, x, y) {

    const newComponent = {

      id:Date.now(),

      ...item,

      x:snap(x),
      y:snap(y),

      rotation:0,

      rpm:"",
      efficiency:"",

      material:"MS",
    };

    const updatedComponents = [

      ...components,

      newComponent,
    ];

    setComponents(
      updatedComponents
    );

    refreshAll(
      updatedComponents
    );

    setSelectedComponent(
      newComponent
    );
  }

  function updateComponent(updated) {

    const snapped = {

      ...updated,

      x:snap(Number(updated.x || 0)),
      y:snap(Number(updated.y || 0)),

      w:snap(Number(updated.w || 0)),
      h:snap(Number(updated.h || 0)),
    };

    const updatedComponents =

      components.map((c)=>

        c.id === snapped.id

          ? snapped

          : c
      );

    setComponents(
      updatedComponents
    );

    refreshAll(
      updatedComponents
    );

    setSelectedComponent(
      snapped
    );
  }

  function resizeComponent(
    id,
    mouseX,
    mouseY,
    svgElement
  ) {

    const rect =
      svgElement.getBoundingClientRect();

    const x =
      mouseX - rect.left;

    const y =
      mouseY - rect.top;

    const updatedComponents =

      components.map((c)=>{

        if(c.id !== id){
          return c;
        }

        const newWidth =

          snap(
            x - c.x
          );

        const newHeight =

          c.type === "Fan"

            ? newWidth

            : snap(
                y - c.y
              );

        const updated = {

          ...c,

          w:newWidth,
          h:newHeight,
        };

        setSelectedComponent(
          updated
        );

        return updated;

      });

    setComponents(
      updatedComponents
    );

    refreshAll(
      updatedComponents
    );
  }

  function handleComponentClick(component) {

    setSelectedComponent(
      component
    );

    if(!connectionMode){
      return;
    }

    if(!connectionStart){

      setConnectionStart(
        component
      );

      return;
    }

    if(
      connectionStart.id ===
      component.id
    ){

      setConnectionStart(
        null
      );

      return;
    }

    const newConnection = {

      id:Date.now(),

      from:connectionStart.id,

      to:component.id,
    };

    setConnections([

      ...connections,

      newConnection,
    ]);

    setConnectionStart(
      null
    );
  }

  function getComponentById(id) {

    return components.find(

      (c)=>c.id === id
    );
  }

  window.updateSelectedCADComponent =
    updateComponent;

  return (

    <div className="cadStudio">

      <div className="componentLibrary">

        <h3>
          Component Library
        </h3>

        {library.map((item)=>(

          <div

            key={item.type}

            className="libraryItem"

            draggable

            onDragStart={()=>

              setDragItem(
                item
              )
            }
          >
            {item.type}
          </div>

        ))}

        <button
          className="dimensionToggle"

          onClick={()=>

            setShowDimensions(
              !showDimensions
            )
          }
        >

          {showDimensions

            ? "Hide Dimensions"

            : "Show Dimensions"}

        </button>

        <button

          className={

            connectionMode

              ? "connectionActive"

              : "dimensionToggle"
          }

          onClick={()=>{

            setConnectionMode(
              !connectionMode
            );

            setConnectionStart(
              null
            );

          }}
        >

          {connectionMode

            ? "Connection Mode ON"

            : "Connection Mode OFF"}

        </button>

      </div>

      <div

        className="dropCanvas"

        onDragOver={(e)=>
          e.preventDefault()
        }

        onDrop={(e)=>{

          const rect =

            e.currentTarget.getBoundingClientRect();

          const x =
            e.clientX - rect.left;

          const y =
            e.clientY - rect.top;

          if(dragItem){

            addComponent(
              dragItem,
              x,
              y
            );
          }

        }}
      >

        <svg
          width="100%"
          height="100%"
          viewBox="0 0 900 500"

          onMouseMove={(e)=>{

            if(resizingId){

              resizeComponent(

                resizingId,

                e.clientX,
                e.clientY,

                e.currentTarget
              );
            }

          }}

          onMouseUp={()=>
            setResizingId(null)
          }

          onMouseLeave={()=>
            setResizingId(null)
          }
        >

          <defs>

            <pattern

              id="grid"

              width={GRID_SIZE}

              height={GRID_SIZE}

              patternUnits="userSpaceOnUse"
            >

              <path

                d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`}

                fill="none"

                stroke="#dddddd"

                strokeWidth="1"
              />

            </pattern>

          </defs>

          <rect
            width="900"
            height="500"
            fill="url(#grid)"
          />

          {connections.map((conn)=>{

            const from =

              getComponentById(
                conn.from
              );

            const to =

              getComponentById(
                conn.to
              );

            if(!from || !to){
              return null;
            }

            const p1 =
              getCenter(from);

            const p2 =
              getCenter(to);

            const midX =

              (p1.x + p2.x)/2;

            return (

              <polyline

                key={conn.id}

                points={

                  `${p1.x},${p1.y}
                   ${midX},${p1.y}
                   ${midX},${p2.y}
                   ${p2.x},${p2.y}`
                }

                fill="none"

                stroke="#e00000"

                strokeWidth="4"
              />

            );

          })}

          {components.map((c)=>{

            const isSelected =

              selectedComponent?.id ===
              c.id;

            const cx =

              c.type === "Fan"

                ? c.x

                : c.x + c.w/2;

            const cy =

              c.type === "Fan"

                ? c.y

                : c.y + c.h/2;

            return (

              <g

                key={c.id}

                onClick={()=>

                  handleComponentClick(
                    c
                  )
                }

                transform={

                  `rotate(
                    ${c.rotation || 0}
                    ${cx}
                    ${cy}
                  )`
                }
              >

                {c.type === "Fan"

                  ? (

                    <circle

                      cx={c.x}
                      cy={c.y}

                      r={c.w/2}

                      fill={c.color}

                      stroke={

                        isSelected

                          ? "#e00000"

                          : "#111"
                      }

                      strokeWidth="4"
                    />

                  ) : (

                    <rect

                      x={c.x}
                      y={c.y}

                      width={c.w}
                      height={c.h}

                      fill={c.color}

                      stroke={

                        isSelected

                          ? "#e00000"

                          : "#111"
                      }

                      strokeWidth="4"
                    />

                  )
                }

                <text
                  x={cx-20}
                  y={cy+5}
                  fontSize="16"
                >
                  {c.type}
                </text>

              </g>

            );

          })}

        </svg>

      </div>

    </div>
  );
}

export default CADCanvas;