import { publicDb } from "@/lib/supabase";
import { formatEventDate, formatTime } from "@/lib/dates";
import { googleCalendarUrl } from "@/lib/calendar-link";
import Section from "@/components/Section";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Calendar — Harmon Lodge No. 420",
  description: "Upcoming events and stated communications at Harmon Lodge No. 420.",
};

const TYPE_LABELS: Record<string, string> = {
  stated_meeting: "Stated Communication",
  practice: "Practice Night",
  degree_work: "Degree Work",
  special: "Special Event",
  community: "Community Event",
};

export default async function CalendarPage() {
  const db = publicDb();
  const today = new Date().toISOString().slice(0, 10);

  const { data: events } = await db
    .from("events")
    .select("event_id, title, event_type, event_date, start_time, dinner_time, location")
    .gte("event_date", today)
    .order("event_date", { ascending: true })
    .limit(20);

  return (
    <Section title="Calendar">
      {events && events.length > 0 ? (
        <div className="space-y-6">
          {events.map((event) => (
            <div
              key={event.event_id}
              className="border border-navy-700 rounded-lg p-5 bg-navy-800"
            >
              <Link
                href={`/calendar/${event.event_id}`}
                className="block hover:opacity-90 transition-opacity"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <h3 className="text-cream-100 text-lg font-serif">
                      {event.title}
                    </h3>
                    <p className="text-cream-300 text-sm mt-1">
                      {formatEventDate(event.event_date)}
                    </p>
                  </div>
                  <span className="text-gold-400 text-xs uppercase tracking-wider whitespace-nowrap">
                    {TYPE_LABELS[event.event_type] || event.event_type}
                  </span>
                </div>
                <div className="mt-3 text-cream-300 text-sm space-y-1">
                  {event.dinner_time && (
                    <p>Dinner: {formatTime(event.dinner_time)}</p>
                  )}
                  {event.start_time && (
                    <p>Lodge opens: {formatTime(event.start_time)}</p>
                  )}
                  {event.location && <p>{event.location}</p>}
                </div>
              </Link>
              <div className="mt-3 pt-3 border-t border-navy-700">
                <a
                  href={googleCalendarUrl(
                    event.title,
                    event.event_date,
                    event.dinner_time || event.start_time,
                    event.location
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-400 hover:text-gold-300 text-xs transition-colors"
                >
                  Add to Google Calendar &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-cream-300">
          No upcoming events at this time. The lodge meets on the third Thursday
          of each month.
        </p>
      )}
    </Section>
  );
}
