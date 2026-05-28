import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";

function PsychrometricChart({ dbt, rh }) {
  const chartData = [
    { temp: 10, rh30: 2.3, rh50: 3.8, rh70: 5.3, rh90: 6.8 },
    { temp: 15, rh30: 3.2, rh50: 5.3, rh70: 7.4, rh90: 9.5 },
    { temp: 20, rh30: 4.4, rh50: 7.3, rh70: 10.2, rh90: 13.1 },
    { temp: 25, rh30: 5.9, rh50: 9.9, rh70: 13.8, rh90: 17.8 },
    { temp: 30, rh30: 7.9, rh50: 13.2, rh70: 18.5, rh90: 23.8 },
    { temp: 35, rh30: 10.5, rh50: 17.5, rh70: 24.5, rh90: 31.5 },
    { temp: 40, rh30: 13.8, rh50: 23.0, rh70: 32.2, rh90: 41.4 },
  ];

  const point = [
    {
      temp: Number(dbt || 0),
      humidity: Number(rh || 0) / 4,
    },
  ];

  return (
    <div className="chartBox">
      <h2>Psychrometric Chart</h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="temp"
            label={{
              value: "Dry Bulb Temperature °C",
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis
            label={{
              value: "Humidity Ratio g/kg",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Legend />

          <Line type="monotone" dataKey="rh30" stroke="#8884d8" name="30% RH" />
          <Line type="monotone" dataKey="rh50" stroke="#82ca9d" name="50% RH" />
          <Line type="monotone" dataKey="rh70" stroke="#ffc658" name="70% RH" />
          <Line type="monotone" dataKey="rh90" stroke="#ff0000" name="90% RH" />
        </LineChart>
      </ResponsiveContainer>

      <p className="chartNote">
        Current Point: DBT {dbt || "-"}°C / RH {rh || "-"}%
      </p>
    </div>
  );
}

export default PsychrometricChart;