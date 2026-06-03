const LICENSE_PLANS = {
  trial: {
    name: "Trial",
    days: 7,
    maxProjects: 3,
    pdfExport: true,
    adminAccess: false,
  },

  monthly: {
    name: "Monthly Professional",
    days: 30,
    maxProjects: 100,
    pdfExport: true,
    adminAccess: false,
  },

  yearly: {
    name: "Yearly Professional",
    days: 365,
    maxProjects: 1000,
    pdfExport: true,
    adminAccess: false,
  },

  admin: {
    name: "Admin",
    days: 3650,
    maxProjects: 99999,
    pdfExport: true,
    adminAccess: true,
  },
};

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function createLicense({
  userName = "User",
  email = "",
  plan = "trial",
}) {
  const selectedPlan = LICENSE_PLANS[plan] || LICENSE_PLANS.trial;

  const license = {
    licenseId: `AG-${Date.now()}`,
    userName,
    email,
    plan,
    planName: selectedPlan.name,
    createdAt: new Date().toISOString(),
    expiresAt: addDays(new Date(), selectedPlan.days),
    maxProjects: selectedPlan.maxProjects,
    pdfExport: selectedPlan.pdfExport,
    adminAccess: selectedPlan.adminAccess,
    status: "active",
    usedProjects: 0,
  };

  localStorage.setItem("ag_license", JSON.stringify(license));

  return license;
}

export function getLicense() {
  const saved = localStorage.getItem("ag_license");
  return saved ? JSON.parse(saved) : null;
}

export function validateLicense() {
  const license = getLicense();

  if (!license) {
    return {
      valid: false,
      reason: "No license found.",
    };
  }

  if (license.status !== "active") {
    return {
      valid: false,
      reason: "License is not active.",
      license,
    };
  }

  const now = new Date();
  const expiry = new Date(license.expiresAt);

  if (now > expiry) {
    return {
      valid: false,
      reason: "License expired.",
      license,
    };
  }

  if (license.usedProjects >= license.maxProjects) {
    return {
      valid: false,
      reason: "Project limit reached.",
      license,
    };
  }

  return {
    valid: true,
    reason: "License valid.",
    license,
  };
}

export function increaseProjectUsage() {
  const license = getLicense();

  if (!license) return null;

  license.usedProjects += 1;

  localStorage.setItem("ag_license", JSON.stringify(license));

  return license;
}

export function blockLicense() {
  const license = getLicense();

  if (!license) return null;

  license.status = "blocked";

  localStorage.setItem("ag_license", JSON.stringify(license));

  return license;
}

export function activateLicense() {
  const license = getLicense();

  if (!license) return null;

  license.status = "active";

  localStorage.setItem("ag_license", JSON.stringify(license));

  return license;
}

export function clearLicense() {
  localStorage.removeItem("ag_license");
}

export function getLicensePlans() {
  return LICENSE_PLANS;
}