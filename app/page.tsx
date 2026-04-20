import Section from "@/components/Section";
import Link from "next/link";
import Image from "next/image";
import { publicDb } from "@/lib/supabase";
import { formatEventDate, formatTime } from "@/lib/dates";

export const revalidate = 3600;

const TYPE_LABELS: Record<string, string> = {
  stated_meeting: "Stated Communication",
  practice: "Practice Night",
  degree_work: "Degree Work",
  special: "Special Event",
  community: "Community Event",
};

export default async function Home() {
  const currentYear = new Date().getFullYear();
  const today = new Date().toISOString().slice(0, 10);
  const db = publicDb();

  const [officersRes, eventsRes] = await Promise.all([
    db.from("officers")
      .select("title, name_override, sort_order")
      .eq("masonic_year", currentYear)
      .order("sort_order"),
    db.from("events")
      .select("event_id, title, event_type, event_date, start_time, dinner_time, location")
      .gte("event_date", today)
      .order("event_date", { ascending: true })
      .limit(3),
  ]);

  const officers = officersRes.data;
  const events = eventsRes.data;

  return (
    <>
      {/* Hero */}
      <div className="py-24 md:py-32 px-4 text-center border-b border-navy-700">
        <div className="max-w-2xl mx-auto">
          <Image
            src="/lodge-logo.png"
            alt="Harmon Lodge No. 420 — Square and Compasses"
            width={160}
            height={160}
            className="mx-auto mb-6"
            priority
          />
          <h1 className="text-3xl md:text-5xl text-cream-100 mb-4">
            Harmon Lodge No. 420
          </h1>
          <p className="text-xl md:text-2xl text-gold-300 font-serif">
            Ancient Free and Accepted Masons
          </p>
          <p className="text-cream-300 mt-3">Yadkinville, North Carolina</p>
          <div className="mt-8">
            <a
              href="#meetings"
              className="inline-block border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-navy-900 px-6 py-2 rounded text-sm transition-colors"
            >
              See Upcoming Meetings
            </a>
          </div>
        </div>
      </div>

      {/* About */}
      <Section id="about" title="About the Lodge">
        <div className="space-y-4 text-cream-200 leading-relaxed">
          <p>
            Harmon Lodge No. 420 is a regular lodge of Free and Accepted Masons
            under the Grand Lodge of Ancient, Free and Accepted Masons of North
            Carolina. The lodge meets in Yadkinville and has served the brethren
            of Yadkin County and the surrounding area for generations.
          </p>
          <p>
            Freemasonry is a fraternity of men who share a commitment to
            self-improvement, brotherly love, and service to others. It is not a
            secret society, but a society with traditions it holds private. Its
            members come from every walk of life and are united by a common
            desire to become better men.
          </p>
        </div>
      </Section>

      {/* Meeting Info */}
      <Section
        id="meetings"
        title="Stated Communication"
        className="bg-navy-800"
      >
        <div className="space-y-6 text-cream-200">
          <div className="text-center space-y-2">
            <p className="text-xl text-cream-100">
              Third Thursday of each month
            </p>
            <p>Dinner served at 6:30 PM</p>
            <p>Lodge opens at 7:30 PM</p>
          </div>
          <div className="text-center pt-4 border-t border-navy-700">
            <p className="text-cream-100">3229 Ray T. Moore Road</p>
            <p>Yadkinville, NC 27055</p>
          </div>
          {/* Google Maps embed */}
          <div className="rounded-lg overflow-hidden border border-navy-700">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3224.5!2d-80.6586!3d36.1331!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s3229+Ray+T.+Moore+Road%2C+Yadkinville%2C+NC+27055!5e0!3m2!1sen!2sus!4v1"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Harmon Lodge No. 420 location"
            />
          </div>
          <p className="text-cream-300 text-sm text-center">
            Brethren are encouraged to come early for the meal and the
            fellowship that precedes our work on the floor.
          </p>
        </div>
      </Section>

      {/* Upcoming Events (live from Supabase) */}
      <Section id="calendar-preview" title="Upcoming Events">
        {events && events.length > 0 ? (
          <div className="space-y-4 mb-6">
            {events.map((event) => (
              <Link
                key={event.event_id}
                href={`/calendar/${event.event_id}`}
                className="block border border-navy-700 rounded-lg p-4 bg-navy-800 hover:border-navy-600 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <h3 className="text-cream-100 font-serif">
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
                {(event.dinner_time || event.start_time) && (
                  <div className="mt-2 text-cream-300 text-sm">
                    {event.dinner_time && <span>Dinner: {formatTime(event.dinner_time)}</span>}
                    {event.dinner_time && event.start_time && <span> &middot; </span>}
                    {event.start_time && <span>Lodge: {formatTime(event.start_time)}</span>}
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-cream-300 mb-6">
            No upcoming events at this time.
          </p>
        )}
        <Link
          href="/calendar"
          className="text-gold-400 hover:text-gold-300 transition-colors"
        >
          View the full calendar &rarr;
        </Link>
      </Section>

      {/* Education preview */}
      <Section
        id="education-preview"
        title="Masonic Education"
        className="bg-navy-800"
      >
        <p className="text-cream-300 mb-6">
          Each week the lodge shares a piece of Masonic education drawn from
          history, symbolism, and the traditions of the Craft.
        </p>
        <Link
          href="/education"
          className="text-gold-400 hover:text-gold-300 transition-colors"
        >
          Read recent posts &rarr;
        </Link>
      </Section>

      {/* Officers */}
      <Section id="officers" title="Officers">
        <p className="text-cream-300 text-sm mb-6">{currentYear} Masonic Year</p>
        <div className="space-y-3 text-cream-200">
          {officers && officers.length > 0 ? (
            officers.map((o) => (
              <div key={o.title} className="flex justify-between border-b border-navy-700 pb-2">
                <span className="text-cream-300">{o.title}</span>
                <span>{o.name_override || "\u2014"}</span>
              </div>
            ))
          ) : (
            <p className="text-cream-300">Officer information will be posted shortly.</p>
          )}
        </div>
      </Section>

      {/* How to Petition */}
      <Section id="petition" title="How to Petition" className="bg-navy-800">
        <div className="space-y-4 text-cream-200 leading-relaxed">
          <p>
            Freemasonry does not recruit. Membership is available to men of good
            character who believe in a Supreme Being and who come of their own
            free will and accord.
          </p>
          <p>
            If you are interested in learning more about the Craft, the
            traditional path is to speak with a Mason you know and trust. You
            may also contact the Secretary of Harmon Lodge No. 420 at the number
            below. A brother will be glad to answer your questions and, if
            appropriate, provide you with a petition.
          </p>
          <p className="text-cream-300">
            There is no obligation in asking, and no pressure to proceed.
          </p>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" title="Contact">
        <div className="space-y-4 text-cream-200">
          <div>
            <p className="text-cream-100 font-serif">
              Harmon Lodge No. 420, A.F. &amp; A.M.
            </p>
            <p>3229 Ray T. Moore Road</p>
            <p>Yadkinville, NC 27055</p>
          </div>
          <div>
            <p className="text-cream-300 text-sm">Secretary</p>
            <p>
              <a
                href="tel:+13365595989"
                className="text-gold-400 hover:text-gold-300 transition-colors"
              >
                336-559-5989
              </a>
            </p>
            <p>
              <a
                href="mailto:lodge@harmon420.org"
                className="text-gold-400 hover:text-gold-300 transition-colors"
              >
                lodge@harmon420.org
              </a>
            </p>
          </div>
          <p className="text-cream-300 text-sm">
            For general inquiries, contact the Secretary by phone or email.
          </p>
        </div>
      </Section>
    </>
  );
}
