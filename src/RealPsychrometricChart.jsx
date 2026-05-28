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

function saturationPressureKPa(tempC) {
  return 0.61078 * Math.exp((17.27 * tempC) / (tempC + 237.3));
}

function humidityRatio(tempC, rhPercent) {
  const pressureKPa = 101.325;
  const pws = saturationPressureKPa(tempC);
  const pv = (rhPercent / 100) * pws;
  return (0.62198 * pv) / (pressureKPa - pv) * 1000;
}

function makeRHCurve(rh) {
  const points = [];

  for (let t = 0; t <= 50; t += 2) {
    points.push({
      dbt: t,
      humidity: humidityRatio(t, rh),
    });
  }

  return points;
}

function RealPsychrometricChart({ design }) {
  const rh30 = makeRHCurve(30);
  const rh50 = makeRHCurve(50);
  const rh70 = makeRHCurve(70);
  const rh90 = makeRHCurve(90);

  const processPoints = design?.psychrometrics?.processPoints || [];

  const processLine = processPoints.map((p) => ({
    dbt: p.dbt,
    humidity: p.humidityRatio,
    name: p.name,
  }));

  return (
    <div className="realPsyPanel">
      <h2>Real Psychrometric Chart</h2>

      <ResponsiveContainer width="100%" height={420}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            type="number"
            dataKey="dbt"
            domain={[0, 50]}
            label={{
              value: "Dry Bulb Temperature °C",
              position: "insideBottom",
              offset: -5,
            }}
          />

          <YAxis
            type="number"
            dataKey="humidity"
            domain={[0, 35]}
            label={{
              value: "Humidity Ratio g/kg dry air",
              angle: -90,
              position: "insideLeft",
            }}
          />

          <Tooltip />
          <Legend />

          <Line
            data={rh30}
            type="monotone"
            dataKey="humidity"
            stroke="#8884d8"
            dot={false}
            name="30% RH"
          />

          <Line
            data={rh50}
            type="monotone"
            dataKey="humidity"
            stroke="#82ca9d"
            dot={false}
            name="50% RH"
          />

          <Line
            data={rh70}
            type="monotone"
            dataKey="humidity"
            stroke="#ffc658"
            dot={false}
            name="70% RH"
          />

          <Line
            data={rh90}
            type="monotone"
            dataKey="humidity"
            stroke="#ff7300"
            dot={false}
            name="90% RH"
          />

          <Line
            data={processLine}
            type="linear"
            dataKey="humidity"
            stroke="#e00000"
            strokeWidth={4}
            name="HVAC Process Line"
          />

          <Scatter
            data={processLine}
            dataKey="humidity"
            fill="#111111"
            name="State Points"
          />
        </LineChart>
      </ResponsiveContainer>

      {design && (
        <div className="psyDetails">
          <h3>Psychrometric Calculation Summary</h3>

          <p>
            Outside Air: {design.psychrometrics.outside.dbt}°C /
            {design.psychrometrics.outside.rh}% RH
          </p>

          <p>
            Room Condition: {design.psychrometrics.room.dbt}°C /
            {design.psychrometrics.room.rh}% RH
          </p>

          <p>
            Supply Air: {design.psychrometrics.supply.dbt}°C /
            {design.psychrometrics.supply.rh}% RH
          </p>

          <p>
            Total Cooling: {design.psychrometrics.totalCoolingKW.toFixed(2)} kW
            / {design.psychrometrics.totalCoolingTR.toFixed(2)} TR
          </p>

          <p>
            Sensible Cooling:{" "}
            {design.psychrometrics.sensibleCoolingKW.toFixed(2)} kW
          </p>

          <p>
            Latent Cooling:{" "}
            {design.psychrometrics.latentCoolingKW.toFixed(2)} kW
          </p>

          <p>
            Moisture Removal:{" "}
            {design.psychrometrics.moistureRemovalKgHr.toFixed(2)} kg/hr
          </p>
        </div>
      )}
    </div>
  );
}

export default RealPsychrometricChart;