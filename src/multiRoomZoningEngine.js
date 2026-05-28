const ROOM_DEFAULTS = {
  cleanroom: {
    ach: 25,
    pressure: 15,
    exhaustPercent: 10,
    freshAirPercent: 20,
    filter: "G4 + F8 + H14 HEPA",
  },

  airlock: {
    ach: 20,
    pressure: 10,
    exhaustPercent: 10,
    freshAirPercent: 20,
    filter: "G4 + F8 + H14 HEPA",
  },

  corridor: {
    ach: 10,
    pressure: 5,
    exhaustPercent: 5,
    freshAirPercent: 15,
    filter: "G4 + F8",
  },

  packing: {
    ach: 18,
    pressure: 10,
    exhaustPercent: 8,
    freshAirPercent: 15,
    filter: "G4 + F8",
  },

  office: {
    ach: 6,
    pressure: 0,
    exhaustPercent: 5,
    freshAirPercent: 15,
    filter: "G4 + F7",
  },

  toilet: {
    ach: 10,
    pressure: -5,
    exhaustPercent: 100,
    freshAirPercent: 0,
    filter: "Exhaust only",
  },

  warehouse: {
    ach: 8,
    pressure: 0,
    exhaustPercent: 5,
    freshAirPercent: 10,
    filter: "G4 + F7",
  },
};

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function getRoomDefault(roomType) {
  const key = String(roomType || "")
    .toLowerCase()
    .trim();

  if (key.includes("clean")) return ROOM_DEFAULTS.cleanroom;
  if (key.includes("airlock")) return ROOM_DEFAULTS.airlock;
  if (key.includes("corridor")) return ROOM_DEFAULTS.corridor;
  if (key.includes("packing")) return ROOM_DEFAULTS.packing;
  if (key.includes("office")) return ROOM_DEFAULTS.office;
  if (key.includes("toilet") || key.includes("wash")) return ROOM_DEFAULTS.toilet;
  if (key.includes("warehouse") || key.includes("store")) return ROOM_DEFAULTS.warehouse;

  return ROOM_DEFAULTS.cleanroom;
}

function selectMotorHP(calculatedHP) {
  const hpList = [
    0.5, 1, 1.5, 2, 3, 5, 7.5, 10, 15, 20, 25, 30, 40, 50,
  ];

  return hpList.find((hp) => hp >= calculatedHP) || hpList[hpList.length - 1];
}

function calculateRoom(room) {
  const defaults = getRoomDefault(room.type);

  const length = num(room.length);
  const width = num(room.width);
  const height = num(room.height);

  const area = length * width;
  const volume = area * height;

  const ach = num(room.ach, defaults.ach);
  const pressure = num(room.pressure, defaults.pressure);

  const supplyCMH = volume * ach;
  const freshAirCMH = supplyCMH * (defaults.freshAirPercent / 100);
  const exhaustCMH = supplyCMH * (defaults.exhaustPercent / 100);
  const returnCMH = supplyCMH - freshAirCMH - exhaustCMH;

  const people = num(room.people, Math.max(1, Math.round(area / 12)));
  const equipmentLoadW = num(room.equipmentLoadW, area * 50);
  const lightingLoadW = num(room.lightingLoadW, area * 15);
  const peopleLoadW = people * 150;

  const heatLoadW =
    peopleLoadW +
    equipmentLoadW +
    lightingLoadW;

  const heatLoadTR =
    heatLoadW / 3517;

  const diffuserQty =
    Math.max(1, Math.ceil(supplyCMH / 600));

  const diffuserAirflowCMH =
    supplyCMH / diffuserQty;

  const ductVelocity =
    num(room.ductVelocity, 8);

  const ductArea =
    supplyCMH / (3600 * ductVelocity);

  const ductDiaMM =
    Math.sqrt((4 * ductArea) / Math.PI) * 1000;

  return {
    id: room.id || Date.now(),
    name: room.name || room.type || "Room",
    type: room.type || "Cleanroom",
    length,
    width,
    height,
    area,
    volume,
    ach,
    pressure,
    filter: defaults.filter,
    supplyCMH,
    freshAirCMH,
    exhaustCMH,
    returnCMH,
    people,
    peopleLoadW,
    equipmentLoadW,
    lightingLoadW,
    heatLoadW,
    heatLoadTR,
    diffuserQty,
    diffuserAirflowCMH,
    ductVelocity,
    ductDiaMM,
  };
}

export function runMultiRoomZoningEngine(rooms = []) {
  const calculatedRooms = rooms.map(calculateRoom);

  const totalSupplyCMH = calculatedRooms.reduce(
    (sum, room) => sum + room.supplyCMH,
    0
  );

  const totalFreshAirCMH = calculatedRooms.reduce(
    (sum, room) => sum + room.freshAirCMH,
    0
  );

  const totalExhaustCMH = calculatedRooms.reduce(
    (sum, room) => sum + room.exhaustCMH,
    0
  );

  const totalReturnCMH = calculatedRooms.reduce(
    (sum, room) => sum + room.returnCMH,
    0
  );

  const totalHeatLoadW = calculatedRooms.reduce(
    (sum, room) => sum + room.heatLoadW,
    0
  );

  const totalTR = totalHeatLoadW / 3517;

  const assumedStaticPressurePa = 900;

  const fanKW =
    ((totalSupplyCMH / 3600) * assumedStaticPressurePa) /
    (1000 * 0.65);

  const calculatedHP = fanKW / 0.746;
  const motorHP = selectMotorHP(calculatedHP);

  const ductVelocity = 8;

  const mainDuctArea =
    totalSupplyCMH / (3600 * ductVelocity);

  const mainDuctDiaMM =
    Math.sqrt((4 * mainDuctArea) / Math.PI) * 1000;

  const warnings = [];

  if (rooms.length === 0) {
    warnings.push("No rooms added. Add at least one room.");
  }

  calculatedRooms.forEach((room) => {
    if (!room.length || !room.width || !room.height) {
      warnings.push(`${room.name}: Room size incomplete.`);
    }

    if (room.returnCMH < 0) {
      warnings.push(`${room.name}: Return air is negative. Check exhaust/fresh air.`);
    }

    if (room.pressure < 0 && !room.type.toLowerCase().includes("toilet")) {
      warnings.push(`${room.name}: Negative pressure selected. Confirm process requirement.`);
    }
  });

  return {
    rooms: calculatedRooms,
    totals: {
      totalSupplyCMH,
      totalFreshAirCMH,
      totalExhaustCMH,
      totalReturnCMH,
      totalHeatLoadW,
      totalTR,
      assumedStaticPressurePa,
      fanKW,
      calculatedHP,
      motorHP,
      mainDuctDiaMM,
    },
    warnings,
  };
}