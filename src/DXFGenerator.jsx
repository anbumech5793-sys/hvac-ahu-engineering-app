function DXFGenerator({ data, update, setResult }) {
  function generateDXF() {
    const width = Number(data.dxfWidth || 1000);
    const height = Number(data.dxfHeight || 500);

    const dxf = `0
SECTION
2
ENTITIES
0
LINE
8
AHU_PANEL
10
0
20
0
11
${width}
21
0
0
LINE
8
AHU_PANEL
10
${width}
20
0
11
${width}
21
${height}
0
LINE
8
AHU_PANEL
10
${width}
20
${height}
11
0
21
${height}
0
LINE
8
AHU_PANEL
10
0
20
${height}
11
0
21
0
0
ENDSEC
0
EOF`;

    const blob = new Blob([dxf], { type: "application/dxf" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "AHU_Panel.dxf";
    link.click();

    URL.revokeObjectURL(url);

    setResult(`DXF generated: ${width} mm × ${height} mm AHU panel`);
  }

  return (
    <>
      <input
        type="number"
        placeholder="Panel Width mm"
        value={data.dxfWidth || ""}
        onChange={(e) => update("dxfWidth", e.target.value)}
      />

      <input
        type="number"
        placeholder="Panel Height mm"
        value={data.dxfHeight || ""}
        onChange={(e) => update("dxfHeight", e.target.value)}
      />

      <button onClick={generateDXF}>Generate DXF</button>
    </>
  );
}

export default DXFGenerator;