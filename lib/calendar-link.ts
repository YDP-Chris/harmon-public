/**
 * Generate a Google Calendar event URL.
 */
export function googleCalendarUrl(
  title: string,
  date: string,
  startTime: string | null,
  location: string | null
): string {
  // Format: YYYYMMDDTHHmmSSZ
  const start = startTime
    ? new Date(startTime).toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "")
    : `${date.replace(/-/g, "")}T000000Z`;

  // End time: 2 hours after start
  const startDate = startTime ? new Date(startTime) : new Date(date + "T00:00:00Z");
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
  const end = endDate.toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    location: location || "3229 Ray T. Moore Road, Yadkinville, NC 27055",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
