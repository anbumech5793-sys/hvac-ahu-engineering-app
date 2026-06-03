import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

import { runMultiRoomZoningEngine } from "./multiRoomZoningEngine";

function MultiRoomDashboard() {
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: "Granulation Room",
      type: "Cleanroom",
      length: 6,
      width: 5,
      height: 3,
    },
    {
      id: 2,
      name: "Airlock",
      type: "Airlock",
      length: 3,
      width: 3,
      height: 3,
    },
    {
      id: 3,
      name: "Corridor",
      type: "Corridor",
      length: 8,
      width: 2,
      height: 3,
    },
  ]);

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

  function addRoom() {
    setRooms([
      ...rooms,
      {
        id: Date.now(),
        name: "New Room",
        type: "Cleanroom",
        length: 4,
        width: 4,
        height: 3,
      },
    ]);
  }

  function deleteRoom(id) {
    setRooms(rooms.filter((room) => room.id !== id));
  }

  function calculateZoning() {
    const zoning = runMultiRoomZoningEngine(rooms);
    setResult(zoning);
  }

  const airflowChart =
    result?.rooms.map((room) => ({
      name: room.name,
      supply: Number(room.supplyCMH.toFixed(0)),
      exhaust: Number(room.exhaustCMH.toFixed(0)),
      return: Number(room.returnCMH.toFixed(0)),
    })) || [];

  const pressureChart =
    result?.rooms.map((room) => ({
      name: room.name,
      pressure: room.pressure,
    })) || [];

  return (
    <div className="multiRoomApp">
      <header className="multiHeader">
        <div>
          <h1>Multi-Room HVAC Zoning Engine</h1>
          <p>Room-by-room cleanroom HVAC airflow, pressure, duct and AHU sizing</p>
        </div>

        <button onClick={calculateZoning}>Calculate Zoning</button>
      </header>

      <div className="multiGrid">
        <aside className="roomInputPanel">
          <h2>Rooms</h2>

          <button onClick={addRoom}>+ Add Room</button>

          {rooms.map((room) => (
            <div className="roomCard" key={room.id}>
              <input
                value={room.name}
                placeholder="Room Name"
                onChange={(e) => updateRoom(room.id, "name", e.target.value)}
              />

              <select
                value={room.type}
                onChange={(e) => updateRoom(room.id, "type", e.target.value)}
              >
                <option>Cleanroom</option>
                <option>Airlock</option>
                <option>Corridor</option>
                <option>Packing</option>
                <option>Office</option>
                <option>Toilet</option>
                <option>Warehouse</option>
              </select>

              <input
                type="number"
                value={room.length}
                placeholder="Length m"
                onChange={(e) => updateRoom(room.id, "length", e.target.value)}
              />

              <input
                type="number"
                value={room.width}
                placeholder="Width m"
                onChange={(e) => updateRoom(room.id, "width", e.target.value)}
              />

              <input
                type="number"
                value={room.height}
                placeholder="Height m"
                onChange={(e) => updateRoom(room.id, "height", e.target.value)}
              />

              <button onClick={() => deleteRoom(room.id)}>Delete</button>
            </div>
          ))}
        </aside>

        <main className="multiOutputPanel">
          {!result && (
            <section className="emptyState">
              <h2>Ready for Multi-Room Design</h2>
              <p>Add rooms and click Calculate Zoning.</p>
            </section>
          )}

          {result && (
            <>
              <section className="kpiGrid">
                <div>
                  <span>Total Supply</span>
                  <strong>{result.totals.totalSupplyCMH.toFixed(0)} CMH</strong>
                </div>

                <div>
                  <span>Total Return</span>
                  <strong>{result.totals.totalReturnCMH.toFixed(0)} CMH</strong>
                </div>

                <div>
                  <span>Total Exhaust</span>
                  <strong>{result.totals.totalExhaustCMH.toFixed(0)} CMH</strong>
                </div>

                <div>
                  <span>Total Load</span>
                  <strong>{result.totals.totalTR.toFixed(2)} TR</strong>
                </div>

                <div>
                  <span>Motor</span>
                  <strong>{result.totals.motorHP} HP</strong>
                </div>

                <div>
                  <span>Main Duct</span>
                  <strong>{result.totals.mainDuctDiaMM.toFixed(0)} mm</strong>
                </div>
              </section>

              <section className="tablePanel">
                <h2>Room-by-Room Zoning Calculation</h2>

                <table>
                  <thead>
                    <tr>
                      <th>Room</th>
                      <th>Type</th>
                      <th>Volume</th>
                      <th>ACH</th>
                      <th>Supply</th>
                      <th>Return</th>
                      <th>Exhaust</th>
                      <th>Pressure</th>
                      <th>Diffusers</th>
                      <th>Duct Dia</th>
                    </tr>
                  </thead>

                  <tbody>
                    {result.rooms.map((room) => (
                      <tr key={room.id}>
                        <td>{room.name}</td>
                        <td>{room.type}</td>
                        <td>{room.volume.toFixed(1)} m³</td>
                        <td>{room.ach}</td>
                        <td>{room.supplyCMH.toFixed(0)} CMH</td>
                        <td>{room.returnCMH.toFixed(0)} CMH</td>
                        <td>{room.exhaustCMH.toFixed(0)} CMH</td>
                        <td>{room.pressure} Pa</td>
                        <td>{room.diffuserQty}</td>
                        <td>{room.ductDiaMM.toFixed(0)} mm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className="drawingPanel">
                <h2>Auto Multi-Room Layout Concept</h2>

                <svg viewBox="0 0 1000 420">
                  <rect x="50" y="60" width="900" height="290" fill="#fff" stroke="#111" strokeWidth="4" />

                  {result.rooms.map((room, index) => {
                    const x = 80 + index * 210;
                    const y = 100;
                    const w = 180;
                    const h = 150;

                    return (
                      <g key={room.id}>
                        <rect
                          x={x}
                          y={y}
                          width={w}
                          height={h}
                          fill={room.pressure > 10 ? "#e8f3ff" : "#f5f5f5"}
                          stroke="#111"
                          strokeWidth="3"
                        />

                        <text x={x + 15} y={y + 50} fontSize="16">
                          {room.name}
                        </text>

                        <text x={x + 15} y={y + 80} fontSize="14">
                          {room.supplyCMH.toFixed(0)} CMH
                        </text>

                        <text x={x + 15} y={y + 110} fontSize="14">
                          {room.pressure} Pa
                        </text>

                        <circle cx={x + w / 2} cy={300} r="18" fill="#0066ff" />
                      </g>
                    );
                  })}

                  <line x1="100" y1="300" x2="900" y2="300" stroke="#e00000" strokeWidth="7" />
                  <text x="430" y="285" fill="#e00000" fontSize="20">
                    Main Supply Duct
                  </text>
                </svg>
              </section>

              <section className="chartGrid">
                <div className="chartCard">
                  <h2>Room Airflow Distribution</h2>

                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={airflowChart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="supply" fill="#e00000" name="Supply CMH" />
                      <Bar dataKey="return" fill="#0066ff" name="Return CMH" />
                      <Bar dataKey="exhaust" fill="#111111" name="Exhaust CMH" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chartCard">
                  <h2>Pressure Cascade</h2>

                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={pressureChart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="pressure"
                        stroke="#e00000"
                        strokeWidth={4}
                        name="Pressure Pa"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {result.warnings.length > 0 && (
                <section className="warningPanel">
                  <h2>Warnings</h2>

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

export default MultiRoomDashboard;