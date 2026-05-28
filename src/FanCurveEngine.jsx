import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ResponsiveContainer,
} from "recharts";

function FanCurveEngine({ results }) {
  const airflow = results?.airflow || 5000;
  const pressureDrop = results?.pressureDrop || 700;

  const curveData = [
    { airflow: 1000, fanPressure: 980, systemPressure: 40 },
    { airflow: 2000, fanPressure: 920, systemPressure: 120 },
    { airflow: 3000, fanPressure: 830, systemPressure: 260 },
    { airflow: 4000, fanPressure: 720, systemPressure: 460 },
    { airflow: 5000, fanPressure: 600, systemPressure: 700 },
    { airflow: 6000, fanPressure: 460, systemPressure: 1000 },
    { airflow: 7000, fanPressure: 300, systemPressure: 1360 },
  ];

  const dutyPoint = [
    {
      airflow,
      pressure: pressureDrop,
    },
  ];

  return (
    <div className="fanCurvePanel">
      <h3>Fan Curve + System Curve</h3>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={curveData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="airflow"
            label={{
              value: "Airflow CMH",
              position: "insideBottom",
              offset: -5,
            }}
          />

          <YAxis
            label={{
              value: "Pressure Pa",
              angle: -90,
              position: "insideLeft",
            }}
          />

          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="fanPressure"
            stroke="#e00000"
            strokeWidth={3}
            name="Fan Curve"
          />

          <Line
            type="monotone"
            dataKey="systemPressure"
            stroke="#0066ff"
            strokeWidth={3}
            name="System Curve"
          />

          <Scatter
            data={dutyPoint}
            dataKey="pressure"
            fill="#111111"
            name="Duty Point"
          />
        </LineChart>
      </ResponsiveContainer>

      <p>
        Duty Point: {airflow} CMH / {pressureDrop.toFixed(0)} Pa
      </p>
    </div>
  );
}

export default FanCurveEngine;