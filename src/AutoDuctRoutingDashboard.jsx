import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { runAutoDuctRoutingEngine } from "./autoDuctRoutingEngine";

function AutoDuctRoutingDashboard() {
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: "Cleanroom",
      type: "Cleanroom",
      supplyCMH: 2250,
    },
    {
      id: 2,
      name: "Airlock",
      type: "Airlock",
      supplyCMH: 540,
    },
    {
      id: 3,
      name: "Corridor",
      type: "Corridor",
      supplyCMH: 480,
    },
  ]);

  const [settings, setSettings] = useState({
    mainVelocity: 8,
    branchVelocity: 6,
    mainLengthM: 15,
    branchLengthM: 8,
  });

  const [result, setResult] = useState(null);

  function updateRoom(id, key, value) {
    setRooms(
      rooms.map((room) =>
        room.id === id
          ? {
              ...room,
              [key]: value,
            }
          : room
      )
    );
  }

  function updateSetting(key, value) {
    setSettings({
      ...settings,
      [key]: value,
    });
  }

  function addRoom() {
    setRooms([
      ...rooms,
      {
        id: Date.now(),
        name: "New Room",
        type: "Cleanroom",
        supplyCMH: 1000,
      },
    ]);
  }

  function deleteRoom(id) {
    setRooms(rooms.filter((room) => room.id !== id));
  }

  function calculateDuctRouting() {
    const ductResult = runAutoDuctRoutingEngine({
      rooms,
      mainVelocity: Number(settings.mainVelocity),
      branchVelocity: Number(settings.branchVelocity),
      mainLengthM: Number(settings.mainLengthM),
      branchLengthM: Number(settings.branchLengthM),
    });

    setResult(ductResult);
  }

  const pressureChart =
    result?.branches.map((branch) => ({
      room: branch.roomName,
      pressure: Number(branch.totalBranchLossPa.toFixed(1)),
    })) || [];

  return (
    <div className="ductApp">
      <header className="ductHeader">
        <div>
          <h1>Auto Duct Routing Engine</h1>
          <p>Main duct • branch duct • diffuser • pressure loss • route sketch</p>
        </div>

        <button onClick={calculateDuctRouting}>
          Calculate Duct Routing
        </button>
      </header>

      <div className="ductGrid">
        <aside className="ductInputPanel">
          <h2>Duct Inputs</h2>

          <h3>Velocity Settings</h3>

          <input
            type="number"
            value={settings.mainVelocity}
            placeholder="Main Duct Velocity m/s"
            onChange={(e) => updateSetting("mainVelocity", e.target.value)}
          />

          <input
            type="number"
            value={settings.branchVelocity}
            placeholder="Branch Duct Velocity m/s"
            onChange={(e) => updateSetting("branchVelocity", e.target.value)}
          />

          <input
            type="number"
            value={settings.mainLengthM}
            placeholder="Main Duct Length m"
            onChange={(e) => updateSetting("mainLengthM", e.target.value)}
          />

          <input
            type="number"
            value={settings.branchLengthM}
            placeholder="Branch Duct Length m"
            onChange={(e) => updateSetting("branchLengthM", e.target.value)}
          />

          <h3>Rooms / Airflow</h3>

          <button onClick={addRoom}>+ Add Room</button>

          {rooms.map((room) => (
            <div className="ductRoomCard" key={room.id}>
              <input
                value={room.name}
                placeholder="Room Name"
                onChange={(e) => updateRoom(room.id, "name", e.target.value)}
              />

              <input
                value={room.type}
                placeholder="Room Type"
                onChange={(e) => updateRoom(room.id, "type", e.target.value)}
              />

              <input
                type="number"
                value={room.supplyCMH}
                placeholder="Supply Airflow CMH"
                onChange={(e) => updateRoom(room.id, "supplyCMH", e.target.value)}
              />

              <button onClick={() => deleteRoom(room.id)}>Delete</button>
            </div>
          ))}
        </aside>

        <main className="ductOutputPanel">
          {!result && (
            <section className="emptyState">
              <h2>Ready for Auto Duct Routing</h2>
              <p>
                Enter room airflow values and click Calculate Duct Routing.
              </p>
            </section>
          )}

          {result && (
            <>
              <section className="kpiGrid">
                <div>
                  <span>Total Airflow</span>
                  <strong>{result.totalAirflowCMH.toFixed(0)} CMH</strong>
                </div>

                <div>
                  <span>Main Round Duct</span>
                  <strong>{result.mainDuct.roundDiaMM.toFixed(0)} mm</strong>
                </div>

                <div>
                  <span>Main Rect Duct</span>
                  <strong>
                    {result.mainDuct.rectangularWidthMM} ×{" "}
                    {result.mainDuct.rectangularHeightMM}
                  </strong>
                </div>

                <div>
                  <span>Duct Pressure</span>
                  <strong>{result.totalDuctPressurePa.toFixed(1)} Pa</strong>
                </div>
              </section>

              <section className="drawingPanel">
                <h2>Automatic Duct Route Sketch</h2>

                <svg viewBox="0 0 1000 450">
                  <rect
                    x="50"
                    y="50"
                    width="900"
                    height="330"
                    fill="#fff"
                    stroke="#111"
                    strokeWidth="4"
                  />

                  <line
                    x1="100"
                    y1="320"
                    x2="900"
                    y2="320"
                    stroke="#e00000"
                    strokeWidth="10"
                  />

                  <text x="390" y="305" fill="#e00000" fontSize="20">
                    Main Supply Duct {result.mainDuct.roundDiaMM.toFixed(0)} mm
                  </text>

                  {result.branches.map((branch, index) => {
                    const x = 170 + index * 230;
                    const roomY = 90;

                    return (
                      <g key={branch.id}>
                        <rect
                          x={x - 70}
                          y={roomY}
                          width="160"
                          height="110"
                          fill="#f5f5f5"
                          stroke="#111"
                          strokeWidth="3"
                        />

                        <text x={x - 50} y={roomY + 40} fontSize="16">
                          {branch.roomName}
                        </text>

                        <text x={x - 50} y={roomY + 70} fontSize="14">
                          {branch.airflowCMH.toFixed(0)} CMH
                        </text>

                        <line
                          x1={x}
                          y1="320"
                          x2={x}
                          y2={roomY + 110}
                          stroke="#0066ff"
                          strokeWidth="7"
                        />

                        <circle cx={x} cy={roomY + 110} r="18" fill="#0066ff" />

                        <text x={x - 55} y={roomY + 145} fontSize="13" fill="#0066ff">
                          Ø {branch.branchDuct.roundDiaMM.toFixed(0)} mm
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </section>

              <section className="tablePanel">
                <h2>Branch Duct Sizing Table</h2>

                <table>
                  <thead>
                    <tr>
                      <th>Room</th>
                      <th>Airflow</th>
                      <th>Round Dia</th>
                      <th>Rect Duct</th>
                      <th>Diffusers</th>
                      <th>Air / Diffuser</th>
                      <th>Branch Loss</th>
                    </tr>
                  </thead>

                  <tbody>
                    {result.branches.map((branch) => (
                      <tr key={branch.id}>
                        <td>{branch.roomName}</td>
                        <td>{branch.airflowCMH.toFixed(0)} CMH</td>
                        <td>{branch.branchDuct.roundDiaMM.toFixed(0)} mm</td>
                        <td>
                          {branch.branchDuct.rectangularWidthMM} ×{" "}
                          {branch.branchDuct.rectangularHeightMM} mm
                        </td>
                        <td>{branch.diffuserQty}</td>
                        <td>{branch.diffuserAirflowCMH.toFixed(0)} CMH</td>
                        <td>{branch.totalBranchLossPa.toFixed(1)} Pa</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className="chartCard">
                <h2>Branch Pressure Loss</h2>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pressureChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="room" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="pressure"
                      fill="#e00000"
                      name="Pressure Loss Pa"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </section>

              {result.warnings.length > 0 && (
                <section className="warningPanel">
                  <h2>Duct Routing Warnings</h2>

                  {result.warnings.map((warning, index) => (
                    <p key={index}>⚠ {warning}</p>
                  ))}
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default AutoDuctRoutingDashboard;