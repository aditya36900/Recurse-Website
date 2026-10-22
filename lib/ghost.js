// Shared by the Ghost Process page and its API routes.

// KMIT roll numbers, e.g. 24BD1A0501 (regular) or 25BD5A0512 (lateral entry).
export const rollPattern = /^\d{2}BD[15]A\d{2}[0-9A-Z]\d$/;

export function normalizeRoll(value) {
  return String(value ?? "").replace(/\s+/g, "").toUpperCase();
}

export function isValidRoll(value) {
  return rollPattern.test(normalizeRoll(value));
}
