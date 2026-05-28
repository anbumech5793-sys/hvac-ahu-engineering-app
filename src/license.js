export async function checkUserLicense(email) {
  return {
    allowed: true,
    role: "admin",
    expiry_date: "2030-01-01",
  };
}