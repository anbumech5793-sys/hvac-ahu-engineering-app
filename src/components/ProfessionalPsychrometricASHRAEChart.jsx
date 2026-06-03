import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  Legend,
} from "recharts";

import { generatePsychrometricProcess, fanCurvePoints, systemCurvePoints } from "../engines/ProfessionalPsychrometricEngine";

export default function ProfessionalPsychrometricASHRAEChart({
  projectData = {},
  designResult = {},
}) {
  const chartKey = JSON.stringify({
    indoorTemp: projectData.indoorTemp,
    outdoorTemp: projectData.outdoorTemp,
    rh: projectData.relativeHumidity,
    cfm: designResult.requiredCFM,
    sp: designResult.staticPressure,
  });

  const psych = useMemo(() => {
    return generatePsychrometricProcess(projectData, designResult);
  }, [chartKey]);

  const processData = psych.processPoints.map((p, index) => ({
    ...p,
    order: index + 1,
  }));

  const fanCurve = useMemo(() => {
    return fanCurvePoints(
      designResult.requiredCFM || 1500,
      designResult.staticPressure || 75
    );
  }, [chartKey]);

  const systemCurve = useMemo(() => {
    return systemCurvePoints(
      designResult.requiredCFM || 1500,
      designResult.staticPressure || 75
    );
  }, [chartKey]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Easy Psychrometric Process Chart</h2>

        <p style={styles.note}>
          X-axis = Dry Bulb Temperature. Y-axis = Moisture / Humidity Ratio.
          When temperature or RH changes, the points move.
        </p>

        <ResponsiveContainer width="100%" height={420}>
          <LineChart data={processData} margin={{ top: 25, right: 35, bottom: 35, left: 25 }}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              type="number"
              dataKey="dryBulb"
              domain={[0, 50]}
              unit="°C"
              label={{
                value: "Dry Bulb Temperature (°C)",
                position: "insideBottom",
                offset: -20,
              }}
            />

            <YAxis
              type="number"
              dataKey="humidityRatio"
              domain={[0, 30]}
              unit=" g/kg"
              label={{
                value: "Humidity Ratio (g/kg)",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <Tooltip
              formatter={(value, name) => [`${value}`, name]}
              labelFormatter={() => "Psychrometric Point"}
            />

            <Legend />

            <Line
              type="linear"
              dataKey="humidityRatio"
              name="Air Process Line"
              stroke="#e60000"
              strokeWidth={4}
              dot={{ r: 7 }}
              activeDot={{ r: 10 }}
              isAnimationActive={false}
            />

            <Scatter
              name="Process Points"
              data={processData}
              fill="#111827"
            />
          </LineChart>
        </ResponsiveContainer>

        <div style={styles.pointGrid}>
          {processData.map((point) => (
            <div key={point.label} style={styles.pointBox}>
              <strong>{point.label}</strong>
              <span>Dry Bulb: {point.dryBulb} °C</span>
              <span>RH: {point.rh} %</span>
              <span>Humidity: {point.humidityRatio} g/kg</span>
              <span>Enthalpy: {point.enthalpy} kJ/kg</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>Fan Curve + System Curve</h2>

        <p style={styles.note}>
          When CFM or static pressure changes, duty point and curves change.
        </p>

        <ResponsiveContainer width="100%" height={420}>
          <LineChart margin={{ top: 25, right: 35, bottom: 35, left: 25 }}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="airflow"
              type="number"
              domain={["auto", "auto"]}
              unit=" CFM"
              label={{
                value: "Airflow (CFM)",
                position: "insideBottom",
                offset: -20,
              }}
            />

            <YAxis
              type="number"
              unit=" mmWC"
              label={{
                value: "Static Pressure (mmWC)",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <Tooltip />
            <Legend />

            <Line
              data={fanCurve}
              type="monotone"
              dataKey="staticPressure"
              name="Fan Curve"
              stroke="#2563eb"
              strokeWidth={4}
              dot={false}
              isAnimationActive={false}
            />

            <Line
              data={systemCurve}
              type="monotone"
              dataKey="staticPressure"
              name="System Curve"
              stroke="#e60000"
              strokeWidth={4}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "24px",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
  },

  title: {
    fontSize: "24px",
    fontWeight: "900",
    color: "#111827",
    marginBottom: "8px",
  },

  note: {
    background: "#fef3c7",
    padding: "12px",
    borderRadius: "12px",
    fontWeight: "700",
    marginBottom: "16px",
  },

  pointGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "14px",
    marginTop: "18px",
  },

  pointBox: {
    background: "#f3f4f6",
    borderRadius: "14px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "13px",
  },
};