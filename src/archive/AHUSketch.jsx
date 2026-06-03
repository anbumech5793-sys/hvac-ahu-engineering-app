function AHUSketch({ data }) {
  const width = Number(data.ahuWidth || 1200);
  const height = Number(data.ahuHeight || 600);

  return (
    <div className="chartBox">
      <h2>2D AHU Sketch</h2>

      <svg width="100%" height="260" viewBox="0 0 900 260">
        <rect x="80" y="70" width="700" height="120" fill="#ffffff" stroke="#111" strokeWidth="3" />

        <rect x="100" y="90" width="90" height="80" fill="#ddd" stroke="#111" />
        <text x="113" y="135" fontSize="18">Filter</text>

        <rect x="220" y="90" width="110" height="80" fill="#cce5ff" stroke="#111" />
        <text x="240" y="135" fontSize="18">Coil</text>

        <circle cx="430" cy="130" r="38" fill="#ffe6cc" stroke="#111" />
        <text x="410" y="136" fontSize="16">Fan</text>

        <rect x="530" y="90" width="110" height="80" fill="#e6ffe6" stroke="#111" />
        <text x="548" y="135" fontSize="18">Motor</text>

        <line x1="40" y1="130" x2="80" y2="130" stroke="#e00000" strokeWidth="4" markerEnd="url(#arrow)" />
        <line x1="780" y1="130" x2="840" y2="130" stroke="#e00000" strokeWidth="4" markerEnd="url(#arrow)" />

        <text x="20" y="115" fontSize="16">Air In</text>
        <text x="805" y="115" fontSize="16">Air Out</text>

        <text x="300" y="220" fontSize="18">
          AHU Size: {width} mm W × {height} mm H
        </text>

        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#e00000" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

export default AHUSketch;