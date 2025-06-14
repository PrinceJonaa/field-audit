
// Example utility function (can be expanded)
export function detectContradiction(promptText: string, identityMarkers: string[]): boolean {
  // A simple example: checks if any identity marker is *not* present in the prompt
  // This might indicate a drift or contradiction if markers are expected to be foundational
  return identityMarkers.some(marker => !promptText.includes(marker));
}

export function sanitizePrompt(promptText: string): string {
  // Example: Basic sanitization or formatting enforcement
  return promptText.replace(/\n\s*\n/g, '\n').trim(); // Remove multiple blank lines
}
