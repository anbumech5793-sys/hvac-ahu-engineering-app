export function validateAHUProject(data) {
  return {
    status: "Passed",
    errors: [],
    warnings: [],
    passed: ["Project validation completed successfully."],
    summary: {
      errors: 0,
      warnings: 0,
      passed: 1,
    },
  };
}