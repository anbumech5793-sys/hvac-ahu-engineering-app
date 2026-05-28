const SETTINGS_KEY = "hvac_ahu_app_settings";

export const defaultSettings = {
  companyName: "Engineering OS",
  preparedBy: "",
  defaultCurrency: "₹",
  defaultAirflowUnit: "CFM",
  defaultPressureUnit: "Pa",
  defaultTemperatureUnit: "°C",
  defaultGstPercent: "18",
  defaultProfitPercent: "20",
  defaultOverheadPercent: "10",
};

export function getSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings) {
  localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify({ ...defaultSettings, ...settings })
  );

  return {
    success: true,
    message: "Settings saved successfully.",
  };
}

export function resetSettings() {
  localStorage.removeItem(SETTINGS_KEY);

  return {
    success: true,
    message: "Settings reset successfully.",
    settings: defaultSettings,
  };
}