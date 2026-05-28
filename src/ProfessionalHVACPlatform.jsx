import { useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  getRoomDesignBasis,
} from "./roomIntelligenceEngine";

import {
  runCatalogSelection,
} from "./catalogEngine";

import {
  generateProfessionalReport,
} from "./reportEngine";

function ProfessionalHVACPlatform() {

  const [d, setD] =
    useState({});

  const [r, setR] =
    useState(null);

  function update(k, v) {

    setD({

      ...d,

      [k]: v,
    });
  }

  function n(k) {

    return Number(
      d[k] || 0
    );
  }

  function calculateAll() {

    const roomBasis =

      getRoomDesignBasis(
        d.roomType
      );

    const volume =

      n("length") *
      n("width") *
      n("height");

    const ach =

      n("ach") ||

      roomBasis.recommendedACH;

    const airflow =
      volume * ach;

    const peopleLoad =
      n("people") * 150;

    const lightingLoad =
      n("lighting");

    const equipmentLoad =
      n("equipment");

    const totalHeatW =

      peopleLoad +

      lightingLoad +

      equipmentLoad;

    const totalTR =
      totalHeatW / 3517;

    const freshAir =

      airflow *

      (
        n("freshAir") / 100
      );

    const coilKW =

      airflow *

      (

        n("enterTemp") -

        n("leaveTemp")

      ) *

      0.000335;

    const coilTR =
      coilKW / 3.517;

    const chwFlow =
      coilTR * 2.4;

    const staticPressure =

      n("filterPD") +

      n("coilPD") +

      n("ductPD") +

      n("hepaPD") +

      150;

    const fanKW =

      (
        (airflow / 3600) *

        staticPressure
      ) /

      (

        1000 *

        (
          (
            n("fanEff") ||

            65
          ) / 100
        )
      );

    const fanHP =
      fanKW / 0.746;

    const ductArea =

      airflow /

      (

        3600 *

        (

          n("ductVelocity") ||

          8
        )
      );

    const ductDia =

      Math.sqrt(

        (

          4 *

          ductArea

        ) /

        Math.PI

      ) *

      1000;

    const catalog =

      runCatalogSelection({

        airflow,

        pressure:
          staticPressure,

        fanHP,

        coilTR,
      });

    const materialCost =

      airflow * 18 +

      catalog.selectedFilters.hepaQty * 6500 +

      coilTR * 18000 +

      fanHP * 12000;

    const fabrication =
      materialCost * 0.18;

    const overhead =
      materialCost * 0.12;

    const profit =

      (

        materialCost +

        fabrication +

        overhead

      ) * 0.25;

    const selling =

      materialCost +

      fabrication +

      overhead +

      profit;

    setR({

      roomBasis,

      catalog,

      volume,

      airflow,

      ach,

      totalTR,

      freshAir,

      coilKW,

      coilTR,

      chwFlow,

      staticPressure,

      fanKW,

      fanHP,

      ductDia,

      materialCost,

      fabrication,

      overhead,

      profit,

      selling,
    });
  }

  function exportReport() {

    generateProfessionalReport(
      r,
      d
    );
  }

  const fanCurve = [

    { q:1000, fan:980, system:50 },

    { q:2500, fan:900, system:180 },

    { q:4000, fan:760, system:420 },

    { q:5500, fan:590, system:760 },

    { q:7000, fan:380, system:1200 },
  ];

  const pressureData = [

    { room:"Change", pa:5 },

    { room:"Process", pa:15 },

    { room:"Filling", pa:25 },

    { room:"Sterile", pa:35 },
  ];

  const costData = r

    ? [

        {
          name:"Material",
          value:r.materialCost,
        },

        {
          name:"Fabrication",
          value:r.fabrication,
        },

        {
          name:"Overhead",
          value:r.overhead,
        },

        {
          name:"Profit",
          value:r.profit,
        },
      ]

    : [];

  const colors = [

    "#e00000",

    "#111111",

    "#777777",

    "#0066ff",
  ];

  return (

    <div className="proApp">

      <header className="proHeader">

        <div>

          <h1>
            Apfel Globus HVAC & AHU Design Automation Platform
          </h1>

          <p>
            Cleanroom • AHU • HVAC • Pharma • Commercial Engineering Software
          </p>

        </div>

        <div
          style={{
            display:"flex",
            gap:"10px",
          }}
        >

          <button
            onClick={calculateAll}
          >
            Calculate
          </button>

          <button
            onClick={exportReport}
          >
            Export Report
          </button>

        </div>

      </header>

      <div className="proGrid">

        <aside className="proInput">

          <h2>
            Project Input
          </h2>

          <input
            placeholder="Project Name"
            onChange={(e)=>

              update(
                "project",
                e.target.value
              )
            }
          />

          <input
            placeholder="Client Name"
            onChange={(e)=>

              update(
                "client",
                e.target.value
              )
            }
          />

          <input
            placeholder="Room Type"
            onChange={(e)=>

              update(
                "roomType",
                e.target.value
              )
            }
          />

          <input
            type="number"
            placeholder="Length"
            onChange={(e)=>

              update(
                "length",
                e.target.value
              )
            }
          />

          <input
            type="number"
            placeholder="Width"
            onChange={(e)=>

              update(
                "width",
                e.target.value
              )
            }
          />

          <input
            type="number"
            placeholder="Height"
            onChange={(e)=>

              update(
                "height",
                e.target.value
              )
            }
          />

          <input
            type="number"
            placeholder="People"
            onChange={(e)=>

              update(
                "people",
                e.target.value
              )
            }
          />

          <input
            type="number"
            placeholder="Lighting W"
            onChange={(e)=>

              update(
                "lighting",
                e.target.value
              )
            }
          />

          <input
            type="number"
            placeholder="Equipment W"
            onChange={(e)=>

              update(
                "equipment",
                e.target.value
              )
            }
          />

          <input
            type="number"
            placeholder="Fresh Air %"
            onChange={(e)=>

              update(
                "freshAir",
                e.target.value
              )
            }
          />

          <input
            type="number"
            placeholder="Entering Temp"
            onChange={(e)=>

              update(
                "enterTemp",
                e.target.value
              )
            }
          />

          <input
            type="number"
            placeholder="Leaving Temp"
            onChange={(e)=>

              update(
                "leaveTemp",
                e.target.value
              )
            }
          />

          <input
            type="number"
            placeholder="Filter PD"
            onChange={(e)=>

              update(
                "filterPD",
                e.target.value
              )
            }
          />

          <input
            type="number"
            placeholder="Coil PD"
            onChange={(e)=>

              update(
                "coilPD",
                e.target.value
              )
            }
          />

          <input
            type="number"
            placeholder="Duct PD"
            onChange={(e)=>

              update(
                "ductPD",
                e.target.value
              )
            }
          />

          <input
            type="number"
            placeholder="HEPA PD"
            onChange={(e)=>

              update(
                "hepaPD",
                e.target.value
              )
            }
          />

          <input
            type="number"
            placeholder="Fan Efficiency"
            onChange={(e)=>

              update(
                "fanEff",
                e.target.value
              )
            }
          />

          <input
            type="number"
            placeholder="Duct Velocity"
            onChange={(e)=>

              update(
                "ductVelocity",
                e.target.value
              )
            }
          />

        </aside>

        <main className="proOutput">

          {r && (

            <section className="proCards">

              <div>

                <h3>
                  Airflow
                </h3>

                <p>
                  {
                    r.airflow.toFixed(0)
                  }
                  {" "}CMH
                </p>

              </div>

              <div>

                <h3>
                  Fan
                </h3>

                <p>
                  {
                    r.catalog.selectedFan.model
                  }
                </p>

              </div>

              <div>

                <h3>
                  Motor
                </h3>

                <p>
                  {
                    r.catalog.selectedMotor.model
                  }
                </p>

              </div>

              <div>

                <h3>
                  Selling
                </h3>

                <p>
                  ₹
                  {
                    r.selling.toFixed(0)
                  }
                </p>

              </div>

            </section>

          )}

          <section className="chartGrid">

            <div className="chartCard">

              <h2>
                Fan Curve
              </h2>

              <ResponsiveContainer
                width="100%"
                height={260}
              >

                <LineChart
                  data={fanCurve}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="q"
                  />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Line
                    dataKey="fan"
                    stroke="#e00000"
                  />

                  <Line
                    dataKey="system"
                    stroke="#0066ff"
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

            <div className="chartCard">

              <h2>
                Pressure
              </h2>

              <ResponsiveContainer
                width="100%"
                height={260}
              >

                <BarChart
                  data={pressureData}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="room"
                  />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="pa"
                    fill="#e00000"
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

            <div className="chartCard">

              <h2>
                Cost Split
              </h2>

              <ResponsiveContainer
                width="100%"
                height={260}
              >

                <PieChart>

                  <Pie
                    data={costData}
                    dataKey="value"
                    outerRadius={90}
                    label
                  >

                    {costData.map(

                      (_, i)=>(

                        <Cell

                          key={i}

                          fill={
                            colors[
                              i %
                              colors.length
                            ]
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}

export default ProfessionalHVACPlatform;