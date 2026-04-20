import { publicDb } from "@/lib/supabase";
import { formatShortDate } from "@/lib/dates";
import Section from "@/components/Section";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Masonic Education — Harmon Lodge No. 420",
  description: "Weekly Masonic education from Harmon Lodge No. 420 covering history, symbolism, and the traditions of the Craft.",
};

const CATEGORY_LABELS: Record<string, string> = {
  history: "History",
  symbolism: "Symbolism",
  famous_mason: "Famous Mason",
  degrees: "The Degrees",
  nc_masonry: "North Carolina Masonry",
  why_masonry: "Why Masonry",
  etiquette: "Etiquette",
};

export default async function EducationPage() {
  const db = publicDb();

  const { data: posts } = await db
    .from("education_content")
    .select("id, week_of, category, topic_title, fb_public_version")
    .eq("status", "sent")
    .order("week_of", { ascending: false })
    .limit(20);

  return (
    <Section title="Masonic Education">
      <p className="text-cream-300 mb-8 leading-relaxed">
        Each week the lodge shares a piece of Masonic education drawn from
        history, symbolism, and the traditions of the Craft. These writings
        reflect only publicly available Masonic knowledge.
      </p>

      {posts && posts.length > 0 ? (
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="border border-navy-700 rounded-lg p-6 bg-navy-800"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                <h3 className="text-cream-100 text-lg font-serif">
                  {post.topic_title}
                </h3>
                <span className="text-gold-400 text-xs uppercase tracking-wider whitespace-nowrap">
                  {CATEGORY_LABELS[post.category] || post.category}
                </span>
              </div>
              <div className="text-cream-200 leading-relaxed whitespace-pre-line">
                {post.fb_public_version}
              </div>
              <p className="text-cream-300 text-xs mt-4">
                {formatShortDate(post.week_of)}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-cream-300">
          Education content will appear here as it is published.
        </p>
      )}
    </Section>
  );
}
