export function generateProjectReport(data) {
  return {
    success: true,
    report: `
PROJECT REPORT

Project Name: ${data.projectName || "Demo Project"}

Client Name: ${data.clientName || "Demo Client"}

Air Flow: ${data.airFlowCFM || 0} CFM

Cooling Load: ${data.coolingLoadTR || 0} TR

Generated Successfully
    `,
  };
}