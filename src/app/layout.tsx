import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Body / UI text — technical, mature, highly legible (not Inter/Roboto).
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Display / editorial headlines — characterful serif with optical sizing.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

// System labels / terminal metadata.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sentinel-portfolioos.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mohamed Elhalabi — Cybersecurity & Full-Stack Engineer",
    template: "%s · Mohamed Elhalabi",
  },
  description:
    "Network, Infrastructure & Cybersecurity graduate from Jönköping, Sweden. I learn by building — secure web apps, IT-support tooling, and networking labs, each documented as an honest case study.",
  keywords: [
    "Mohamed Elhalabi",
    "cybersecurity",
    "full-stack developer",
    "network infrastructure",
    "Jönköping",
    "Next.js",
    "case studies",
  ],
  authors: [{ name: "Mohamed Elhalabi" }],
  openGraph: {
    title: "Mohamed Elhalabi — Cybersecurity & Full-Stack Engineer",
    description:
      "Security-minded engineer who learns by building. Honest, end-to-end project case studies.",
    url: siteUrl,
    siteName: "Mohamed Elhalabi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohamed Elhalabi — Cybersecurity & Full-Stack",
    description: "Security-minded engineer who learns by building.",
  },
};

// Set the theme class before paint to avoid a flash of the wrong theme.
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('sentinel-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = stored ? stored === 'dark' : prefersDark;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plexSans.variable} ${fraunces.variable} ${plexMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
