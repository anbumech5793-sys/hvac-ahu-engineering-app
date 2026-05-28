import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
} from "recharts";

function FanCurve({ airflow, pressure }) {
  const q = Number(airflow || 0);
  const sp = Number(pressure || 0);

  const curveData = [
    { airflow: 1000, pressure: 900, efficiency: 45 },
    { airflow: 2000, pressure: 850, efficiency: 55 },
    { airflow: 3000, pressure: 780, efficiency: 62 },
    { airflow: 4000, pressure: 680, efficiency: 68 },
    { airflow: 5000, pressure: 560, efficiency: 65 },
    { airflow: 6000, pressure: 420, efficiency: 58 },
    { airflow: 7000, pressure: 300, efficiency: 48 },
  ];

  const dutyPoint = [
    {
      airflow: q,
      pressure: sp,
    },
  ];

  return (
    <div className="chartBox">
      <h2>Fan Curve & Duty Point</h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={curveData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="airflow"
            label={{
              value: "Airflow (CMH)",
              position: "insideBottom",
              offset: -5,
            }}
          />

          <YAxis
            label={{
              value: "Static Pressure (Pa)",
              angle: -90,
              position: "insideLeft",
            }}
          />

          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="pressure"
            stroke="#e00000"
            strokeWidth={3}
            name="Fan Static Pressure"
          />

          <Scatter
            data={dutyPoint}
            fill="#111111"
            name="Duty Point"
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="chartNote">
        Duty Point: {q || "-"} CMH / {sp || "-"} Pa
      </p>
    </div>
  );
}

export default FanCurve;