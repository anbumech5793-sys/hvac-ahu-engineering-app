import { useState } from "react";

const GRID = 25;

function snap(v) {
  return Math.round(v / GRID) * GRID;
}

function RealCADEngine() {
  const [tool, setTool] = useState("select");
  const [items, setItems] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  function getPoint(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: snap(e.clientX - rect.left),
      y: snap(e.clientY - rect.top),
    };
  }

  function handleCanvasClick(e) {
    const p = getPoint(e);

    if (tool === "line") {
      if (!startPoint) {
        setStartPoint(p);
      } else {
        setItems([
          ...items,
          {
            id: Date.now(),
            type: "line",
            x1: startPoint.x,
            y1: startPoint.y,
            x2: p.x,
            y2: p.y,
            layer: "Duct",
          },
        ]);
        setStartPoint(null);
      }
    }

    if (tool === "rect") {
      if (!startPoint) {
        setStartPoint(p);
      } else {
        setItems([
          ...items,
          {
            id: Date.now(),
            type: "rect",
            x: Math.min(startPoint.x, p.x),
            y: Math.min(startPoint.y, p.y),
            w: Math.abs(p.x - startPoint.x),
            h: Math.abs(p.y - startPoint.y),
            layer: "Room",
          },
        ]);
        setStartPoint(null);
      }
    }
  }

  function deleteSelected() {
    setItems(items.filter((i) => i.id !== selectedId));
    setSelectedId(null);
  }

  function clearAll() {
    setItems([]);
    setSelectedId(null);
    setStartPoint(null);
  }

  function exportDXF() {
    let dxf = `0
SECTION
2
ENTITIES
`;

    items.forEach((i) => {
      if (i.type === "line") {
        dxf += `0
LINE
8
${i.layer}
10
${i.x1}
20
${i.y1}
11
${i.x2}
21
${i.y2}
`;
      }

      if (i.type === "rect") {
        const x = i.x;
        const y = i.y;
        const w = i.w;
        const h = i.h;

        dxf += `0
LINE
8
${i.layer}
10
${x}
20
${y}
11
${x + w}
21
${y}
0
LINE
8
${i.layer}
10
${x + w}
20
${y}
11
${x + w}
21
${y + h}
0
LINE
8
${i.layer}
10
${x + w}
20
${y + h}
11
${x}
21
${y + h}
0
LINE
8
${i.layer}
10
${x}
20
${y + h}
11
${x}
21
${y}
`;
      }
    });

    dxf += `0
ENDSEC
0
EOF`;

    const blob = new Blob([dxf], { type: "application/dxf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Apfel_Globus_CAD_Drawing.dxf";
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="realCad">
      <div className="cadToolbar">
        <h3>Real CAD Engine</h3>

        <button className={tool === "select" ? "toolActive" : ""} onClick={() => setTool("select")}>
          Select
        </button>

        <button className={tool === "line" ? "toolActive" : ""} onClick={() => setTool("line")}>
          Line
        </button>

        <button className={tool === "rect" ? "toolActive" : ""} onClick={() => setTool("rect")}>
          Rectangle
        </button>

        <button onClick={deleteSelected}>Delete</button>
        <button onClick={clearAll}>Clear</button>
        <button onClick={exportDXF}>Export DXF</button>

        <div className="cadInfo">
          <p>Tool: {tool}</p>
          <p>Objects: {items.length}</p>
          <p>Grid: {GRID} mm</p>
          <p>
            {startPoint
              ? `Start: X ${startPoint.x}, Y ${startPoint.y}`
              : "Click canvas to start drawing"}
          </p>
        </div>
      </div>

      <div className="cadDrawingArea">
        <svg
          width="100%"
          height="600"
          viewBox="0 0 1000 600"
          onClick={handleCanvasClick}
        >
          <defs>
            <pattern id="realGrid" width={GRID} height={GRID} patternUnits="userSpaceOnUse">
              <path
                d={`M ${GRID} 0 L 0 0 0 ${GRID}`}
                fill="none"
                stroke="#dddddd"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          <rect width="1000" height="600" fill="url(#realGrid)" />

          {items.map((i) => {
            const stroke = selectedId === i.id ? "#e00000" : "#111111";

            if (i.type === "line") {
              return (
                <g key={i.id} onClick={(e) => { e.stopPropagation(); setSelectedId(i.id); }}>
                  <line
                    x1={i.x1}
                    y1={i.y1}
                    x2={i.x2}
                    y2={i.y2}
                    stroke={stroke}
                    strokeWidth="4"
                  />
                  <text
                    x={(i.x1 + i.x2) / 2}
                    y={(i.y1 + i.y2) / 2 - 8}
                    fill="#e00000"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    {Math.round(Math.hypot(i.x2 - i.x1, i.y2 - i.y1))} mm
                  </text>
                </g>
              );
            }

            if (i.type === "rect") {
              return (
                <g key={i.id} onClick={(e) => { e.stopPropagation(); setSelectedId(i.id); }}>
                  <rect
                    x={i.x}
                    y={i.y}
                    width={i.w}
                    height={i.h}
                    fill="rgba(0,102,255,0.08)"
                    stroke={stroke}
                    strokeWidth="4"
                  />
                  <text
                    x={i.x + 10}
                    y={i.y - 8}
                    fill="#e00000"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    {i.w} × {i.h} mm
                  </text>
                </g>
              );
            }

            return null;
          })}

          {startPoint && (
            <circle cx={startPoint.x} cy={startPoint.y} r="6" fill="#e00000" />
          )}
        </svg>
      </div>
    </div>
  );
}

export default RealCADEngine;