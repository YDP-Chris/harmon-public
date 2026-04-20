import { publicDb } from "@/lib/supabase";
import { formatEventDate, formatTime } from "@/lib/dates";
import Section from "@/components/Section";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 3600;

const TYPE_LABELS: Record<string, string> = {
  stated_meeting: "Stated Communication",
  practice: "Practice Night",
  degree_work: "Degree Work",
  special: "Special Event",
  community: "Community Event",
};

const DEFAULT_DESCRIPTIONS: Record<string, string> = {
  stated_meeting:
    "The lodge will hold its regular Stated Communication. Brethren are encouraged to come early for the meal and the fellowship that precedes our work on the floor.",
  practice:
    "Whether you are working on degree proficiency, learning a new part, or just want to sharpen your floor work, we encourage you to come out. Practice is where the real learning happens.",
  degree_work:
    "Degree work will be conferred. All Master Masons in good standing are welcome to attend.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const db = publicDb();

  const { data } = await db
    .from("events")
    .select("title, event_date")
    .eq("event_id", id)
    .limit(1);

  const event = data?.[0];
  if (!event) return { title: "Event Not Found" };

  return {
    title: `${event.title} — Harmon Lodge No. 420`,
    description: `${event.title} on ${formatEventDate(event.event_date)} at Harmon Lodge No. 420.`,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = publicDb();

  const { data: events } = await db
    .from("events")
    .select("event_id, title, event_type, event_date, start_time, dinner_time, end_time, location")
    .eq("event_id", id)
    .limit(1);

  const event = events?.[0];
  if (!event) notFound();

  // Try to get a content package for this event
  let description: string | null = null;

  const { data: packages } = await db
    .from("event_content_packages")
    .select("internal_description, status")
    .eq("event_id", id)
    .limit(1);

  const pkg = packages?.[0];
  if (pkg?.internal_description) {
    description = pkg.internal_description;
  }

  // Fall back to default description by event type
  if (!description) {
    description = DEFAULT_DESCRIPTIONS[event.event_type] || null;
  }

  return (
    <Section title={event.title}>
      <div className="space-y-6">
        {/* Type badge */}
        <span className="text-gold-400 text-xs uppercase tracking-wider">
          {TYPE_LABELS[event.event_type] || event.event_type}
        </span>

        {/* Date and time */}
        <div className="border border-navy-700 rounded-lg p-5 bg-navy-800 space-y-3">
          <div>
            <p className="text-cream-300 text-xs uppercase tracking-wider mb-1">Date</p>
            <p className="text-cream-100 text-lg">{formatEventDate(event.event_date)}</p>
          </div>

          {(event.dinner_time || event.start_time) && (
            <div className="flex gap-8">
              {event.dinner_time && (
                <div>
                  <p className="text-cream-300 text-xs uppercase tracking-wider mb-1">Dinner</p>
                  <p className="text-cream-100">{formatTime(event.dinner_time)}</p>
                </div>
              )}
              {event.start_time && (
                <div>
                  <p className="text-cream-300 text-xs uppercase tracking-wider mb-1">Lodge Opens</p>
                  <p className="text-cream-100">{formatTime(event.start_time)}</p>
                </div>
              )}
            </div>
          )}

          {event.location && (
            <div>
              <p className="text-cream-300 text-xs uppercase tracking-wider mb-1">Location</p>
              <p className="text-cream-100">{event.location}</p>
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <div className="text-cream-200 leading-relaxed whitespace-pre-line">
            {description}
          </div>
        )}

        {/* Back link */}
        <div className="pt-4">
          <Link
            href="/calendar"
            className="text-gold-400 hover:text-gold-300 transition-colors text-sm"
          >
            &larr; Back to calendar
          </Link>
        </div>
      </div>
    </Section>
  );
}
