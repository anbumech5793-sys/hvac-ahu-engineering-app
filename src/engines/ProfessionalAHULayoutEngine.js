export function generateAHULayout(data) {
  const airFlowCFM = Number(data.airFlowCFM);
  const coolingTR = Number(data.coolingTR);

  const totalLength =
    3500 + coolingTR * 100;

  const totalHeight =
    1600;

  const totalWidth =
    1400;

  const sections = [
    {
      name: "Mixing Box",
      x: 0,
      width: 700,
      color: "#dbeafe",
    },

    {
      name: "Filter",
      x: 700,
      width: 700,
      color: "#dcfce7",
    },

    {
      name: "Cooling Coil",
      x: 1400,
      width: 900,
      color: "#fee2e2",
    },

    {
      name: "Fan Section",
      x: 2300,
      width: 1200,
      color: "#fef3c7",
    },

    {
      name: "Motor Section",
      x: 3500,
      width: 700,
      color: "#ede9fe",
    },
  ];

  return {
    airFlowCFM,
    coolingTR,

    totalLength,
    totalHeight,
    totalWidth,

    sections,
  };
}