import type { Metadata } from "next";
import { Libre_Baskerville, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Harmon Lodge No. 420, A.F. & A.M.",
  description:
    "Harmon Lodge No. 420, Ancient Free and Accepted Masons. A regular lodge under the Grand Lodge of North Carolina, meeting in Yadkinville.",
  openGraph: {
    title: "Harmon Lodge No. 420, A.F. & A.M.",
    description:
      "A regular lodge of Free and Accepted Masons in Yadkinville, North Carolina.",
    type: "website",
    url: "https://harmon420.org",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${libreBaskerville.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
