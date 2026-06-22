import type { Metadata } from "next";
import { Poppins, Roboto, Inconsolata } from "next/font/google";
import "./globals.css";

// Body / UI text
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

// Display / headings
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

// Label-caps / mono
const inconsolata = Inconsolata({
  variable: "--font-inconsolata",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sentinel-portfolioos.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sentinel PortfolioOS — Turn projects into proof",
    template: "%s · Sentinel PortfolioOS",
  },
  description:
    "A portfolio operating system for cybersecurity and full-stack engineers. Polished case studies, verifiable skills, and a private admin dashboard.",
  keywords: [
    "portfolio",
    "cybersecurity",
    "full-stack",
    "case studies",
    "Next.js",
    "developer portfolio",
  ],
  authors: [{ name: "Sentinel PortfolioOS" }],
  openGraph: {
    title: "Sentinel PortfolioOS — Turn projects into proof",
    description:
      "A portfolio operating system for cybersecurity and full-stack engineers.",
    url: siteUrl,
    siteName: "Sentinel PortfolioOS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sentinel PortfolioOS",
    description: "Turn projects into proof.",
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
      className={`${roboto.variable} ${poppins.variable} ${inconsolata.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
