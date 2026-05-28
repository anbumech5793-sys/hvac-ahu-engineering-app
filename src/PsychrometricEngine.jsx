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
} from "recharts";

function humidityApprox(dbt, rh) {
  return (dbt * rh) / 250;
}

function enthalpyApprox(dbt, rh) {
  return 1.006 * dbt + (rh / 100) * (2501 + 1.86 * dbt);
}

function PsychrometricEngine() {
  const outsideDBT = 35;
  const outsideRH = 60;

  const coilDBT = 14;
  const coilRH = 95;

  const supplyDBT = 22;
  const supplyRH = 45;

  const chartData = [
    {
      point: "Outside Air",
      dbt: outsideDBT,
      humidity: humidityApprox(outsideDBT, outsideRH),
    },
    {
      point: "Cooling Coil",
      dbt: coilDBT,
      humidity: humidityApprox(coilDBT, coilRH),
    },
    {
      point: "Supply Air",
      dbt: supplyDBT,
      humidity: humidityApprox(supplyDBT, supplyRH),
    },
  ];

  const rhCurves = [
    { dbt: 10, rh50: 2, rh70: 3, rh90: 4 },
    { dbt: 15, rh50: 3, rh70: 4.2, rh90: 5.5 },
    { dbt: 20, rh50: 4.5, rh70: 6.2, rh90: 8 },
    { dbt: 25, rh50: 6.2, rh70: 8.6, rh90: 11 },
    { dbt: 30, rh50: 8.2, rh70: 11.5, rh90: 14.8 },
    { dbt: 35, rh50: 11, rh70: 15.5, rh90: 20 },
    { dbt: 40, rh50: 14, rh70: 20, rh90: 25 },
  ];

  const outsideEnthalpy = enthalpyApprox(outsideDBT, outsideRH);
  const supplyEnthalpy = enthalpyApprox(supplyDBT, supplyRH);
  const deltaH = outsideEnthalpy - supplyEnthalpy;

  return (
    <div className="psyEnginePanel">
      <h3>Psychrometric Process Engine</h3>

      <div className="psySummary">
        <div>
          <strong>Outside Air</strong>
          <p>{outsideDBT}°C / {outsideRH}% RH</p>
        </div>

        <div>
          <strong>Cooling Coil Leaving</strong>
          <p>{coilDBT}°C / {coilRH}% RH</p>
        </div>

        <div>
          <strong>Supply Air</strong>
          <p>{supplyDBT}°C / {supplyRH}% RH</p>
        </div>

        <div>
          <strong>Δ Enthalpy</strong>
          <p>{deltaH.toFixed(2)} kJ/kg</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={rhCurves}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="dbt"
            label={{
              value: "Dry Bulb Temperature °C",
              position: "insideBottom",
              offset: -5,
            }}
          />

          <YAxis
            label={{
              value: "Humidity Ratio Approx.",
              angle: -90,
              position: "insideLeft",
            }}
          />

          <Tooltip />
          <Legend />

          <Line type="monotone" dataKey="rh50" stroke="#8884d8" name="50% RH" />
          <Line type="monotone" dataKey="rh70" stroke="#82ca9d" name="70% RH" />
          <Line type="monotone" dataKey="rh90" stroke="#ffc658" name="90% RH" />

          <Line
            data={chartData}
            type="linear"
            dataKey="humidity"
            stroke="#e00000"
            strokeWidth={4}
            name="Process Line"
          />

          <Scatter
            data={chartData}
            dataKey="humidity"
            fill="#111111"
            name="Air State Points"
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="psyNote">
        Process: Outside Air → Cooling Coil → Supply Air
      </p>
    </div>
  );
}

export default PsychrometricEngine;