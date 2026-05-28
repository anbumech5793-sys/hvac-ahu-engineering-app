export function validateProjectInput(data) {
  const errors = [];

  if (!data.projectName.trim()) errors.push("Project name is required.");
  if (!data.clientName.trim()) errors.push("Client name is required.");
  if (!data.location.trim()) errors.push("Location is required.");
  if (!data.roomName.trim()) errors.push("Room name is required.");

  if (Number(data.roomLength) <= 0) errors.push("Room length must be greater than 0.");
  if (Number(data.roomWidth) <= 0) errors.push("Room width must be greater than 0.");
  if (Number(data.roomHeight) <= 0) errors.push("Room height must be greater than 0.");

  const roomArea = Number(data.roomLength) * Number(data.roomWidth);
  const roomVolume = roomArea * Number(data.roomHeight);

  return {
    errors,
    roomArea: round(roomArea),
    roomVolume: round(roomVolume),
    status: errors.length === 0 ? "Valid" : "Invalid",
  };
}

function round(value) {
  return Number(value.toFixed(2));
}