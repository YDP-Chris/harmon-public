export function formatEventDate(isoDate: string): string {
  return new Date(isoDate + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  });
}

export function formatShortDate(isoDate: string): string {
  return new Date(isoDate + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });
}

export function formatTime(time: string | null): string | null {
  if (!time) return null;
  // Times from the DB are like "7:30 PM" or "18:30" — normalize to 12hr with EST
  // If already in 12hr format, just append EST
  if (time.includes("AM") || time.includes("PM")) {
    return `${time} EST`;
  }
  // Try to parse 24hr format
  const parts = time.split(":");
  if (parts.length >= 2) {
    let h = parseInt(parts[0], 10);
    const m = parts[1].padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return `${h}:${m} ${ampm} EST`;
  }
  return `${time} EST`;
}
