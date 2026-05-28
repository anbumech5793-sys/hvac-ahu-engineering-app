export function generateAHUGA(data) {
  const airFlowCFM = Number(data.airFlowCFM);
  const coolingTR = Number(data.coolingTR);

  // Approximate AHU sizing logic
  const baseLength =
    2500 + coolingTR * 120;

  const baseWidth =
    1200 + airFlowCFM * 0.01;

  const baseHeight =
    1400 + airFlowCFM * 0.005;

  // Sections
  const sections = [
    {
      name: "Mixing Box",
      length: 600,
    },

    {
      name: "Filter Section",
      length: 700,
    },

    {
      name: "Cooling Coil Section",
      length: 800,
    },

    {
      name: "Fan Section",
      length: 1000,
    },

    {
      name: "Motor Section",
      length: 500,
    },
  ];

  // BOM generation
  const casingArea =
    2 *
    (
      (baseLength * baseWidth) +
      (baseLength * baseHeight) +
      (baseWidth * baseHeight)
    ) /
    1000000;

  const insulationArea =
    casingArea;

  const frameWeight =
    baseLength * 0.025;

  const sheetWeight =
    casingArea * 8;

  return {
    baseLength:
      baseLength.toFixed(0),

    baseWidth:
      baseWidth.toFixed(0),

    baseHeight:
      baseHeight.toFixed(0),

    casingArea:
      casingArea.toFixed(2),

    insulationArea:
      insulationArea.toFixed(2),

    frameWeight:
      frameWeight.toFixed(2),

    sheetWeight:
      sheetWeight.toFixed(2),

    sections,
  };
}