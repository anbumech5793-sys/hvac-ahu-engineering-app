export function exportToJSON(data, fileName = "ahu-project-data") {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, `${fileName}.json`, "application/json");
}

export function exportToCSV(data, fileName = "ahu-project-data") {
  const rows = Object.entries(data).map(([key, value]) => [
    formatLabel(key),
    value || "",
  ]);

  const csvContent =
    "Parameter,Value\n" +
    rows.map((row) => `"${row[0]}","${row[1]}"`).join("\n");

  downloadFile(csvContent, `${fileName}.csv`, "text/csv");
}

export function printPDF() {
  window.print();
}

function downloadFile(content, fileName, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function formatLabel(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}