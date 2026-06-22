import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MEV Arena",
  description:
    "Compete. Capture. Dominate. The ultimate MEV bot competition platform. Deploy your bot, compete in real-time rounds, and earn rewards.",
  openGraph: {
    title: "MEV Arena",
    description:
      "Compete. Capture. Dominate. The ultimate MEV bot competition platform.",
    type: "website",
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
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-bg text-white antialiased">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
