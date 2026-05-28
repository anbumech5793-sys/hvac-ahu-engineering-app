import React from "react";

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Label,
} from "recharts";

export default function ProfessionalPsychrometricChart({
  dryBulbTemp = 24,
  relativeHumidity = 55,
  humidityRatio = 10,
}) {
  const chartData = [];

  for (let t = 0; t <= 50; t += 1) {
    chartData.push({
      t,

      rh20: calculateHumidityRatio(t, 20),
      rh40: calculateHumidityRatio(t, 40),
      rh60: calculateHumidityRatio(t, 60),
      rh80: calculateHumidityRatio(t, 80),
      rh100: calculateHumidityRatio(t, 100),
    });
  }

  const currentPoint = [
    {
      x: Number(dryBulbTemp),
      y: Number(humidityRatio),
    },
  ];

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>
        Professional Psychrometric Chart
      </h2>

      <p style={styles.subHeading}>
        HVAC Air Condition Visualization
      </p>

      <ResponsiveContainer
        width="100%"
        height={600}
      >
        <ComposedChart
          data={chartData}
          margin={{
            top: 30,
            right: 40,
            left: 20,
            bottom: 40,
          }}
        >
          <CartesianGrid
            stroke="#d1d5db"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="t"
            type="number"
            domain={[0, 50]}
            tickCount={11}
            label={{
              value:
                "Dry Bulb Temperature (°C)",
              position: "insideBottom",
              offset: -10,
            }}
          />

          <YAxis
            type="number"
            domain={[0, 35]}
            tickCount={8}
            label={{
              value:
                "Humidity Ratio (g/kg)",
              angle: -90,
              position: "insideLeft",
            }}
          />

          <Tooltip />

          {/* 20% RH */}

          <Line
            type="monotone"
            dataKey="rh20"
            stroke="#94a3b8"
            strokeWidth={2}
            dot={false}
          />

          {/* 40% RH */}

          <Line
            type="monotone"
            dataKey="rh40"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />

          {/* 60% RH */}

          <Line
            type="monotone"
            dataKey="rh60"
            stroke="#16a34a"
            strokeWidth={2}
            dot={false}
          />

          {/* 80% RH */}

          <Line
            type="monotone"
            dataKey="rh80"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
          />

          {/* 100% RH */}

          <Line
            type="monotone"
            dataKey="rh100"
            stroke="#111827"
            strokeWidth={4}
            dot={false}
          />

          {/* CURRENT CONDITION */}

          <Scatter
            data={currentPoint}
            fill="#e60000"
            shape="circle"
          />

          {/* DBT LINE */}

          <ReferenceLine
            x={Number(dryBulbTemp)}
            stroke="#e60000"
            strokeWidth={2}
            strokeDasharray="5 5"
          >
            <Label
              value={`DBT ${dryBulbTemp}°C`}
              position="top"
              fill="#e60000"
            />
          </ReferenceLine>

          {/* HUMIDITY LINE */}

          <ReferenceLine
            y={Number(humidityRatio)}
            stroke="#2563eb"
            strokeWidth={2}
            strokeDasharray="5 5"
          >
            <Label
              value={`W ${humidityRatio} g/kg`}
              position="right"
              fill="#2563eb"
            />
          </ReferenceLine>
        </ComposedChart>
      </ResponsiveContainer>

      {/* RH COLOR LEGEND */}

      <div style={styles.legendBox}>
        <LegendColor
          color="#94a3b8"
          text="20% RH - Dry Air"
        />

        <LegendColor
          color="#3b82f6"
          text="40% RH - Comfort Cooling"
        />

        <LegendColor
          color="#16a34a"
          text="60% RH - Normal Comfort"
        />

        <LegendColor
          color="#f59e0b"
          text="80% RH - High Moisture"
        />

        <LegendColor
          color="#111827"
          text="100% RH - Saturation Curve"
        />
      </div>

      {/* CURRENT RESULT */}

      <div style={styles.resultBox}>
        <ResultCard
          title="DBT"
          value={`${dryBulbTemp} °C`}
        />

        <ResultCard
          title="RH"
          value={`${relativeHumidity} %`}
        />

        <ResultCard
          title="Humidity Ratio"
          value={`${humidityRatio} g/kg`}
        />
      </div>
    </div>
  );
}

function calculateHumidityRatio(
  dbt,
  rh
) {
  const pws =
    0.61078 *
    Math.exp(
      (17.2694 * dbt) /
        (dbt + 237.3)
    );

  const pw =
    (rh / 100) * pws;

  const humidityRatio =
    0.62198 *
    pw /
    (101.325 - pw);

  return Number(
    (humidityRatio * 1000).toFixed(2)
  );
}

function LegendColor({
  color,
  text,
}) {
  return (
    <div style={styles.legendItem}>
      <div
        style={{
          width: "22px",
          height: "4px",
          background: color,
          borderRadius: "10px",
        }}
      />

      <span>{text}</span>
    </div>
  );
}

function ResultCard({
  title,
  value,
}) {
  return (
    <div style={styles.resultCard}>
      <strong>{title}</strong>

      <span>{value}</span>
    </div>
  );
}

const styles = {
  wrapper: {
    background: "white",
    borderRadius: "20px",
    padding: "30px",
    marginTop: "30px",
    boxShadow:
      "0 6px 20px rgba(0,0,0,0.15)",
  },

  heading: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#111827",
    marginBottom: "8px",
  },

  subHeading: {
    fontSize: "17px",
    color: "#374151",
    marginBottom: "20px",
  },

  legendBox: {
    display: "grid",
    gridTemplateColumns:
      "repeat(5, 1fr)",
    gap: "14px",
    marginTop: "25px",
  },

  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#f3f4f6",
    padding: "12px",
    borderRadius: "12px",
    fontSize: "14px",
  },

  resultBox: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "18px",
    marginTop: "25px",
  },

  resultCard: {
    background: "#f3f4f6",
    borderRadius: "14px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    fontSize: "18px",
  },
};