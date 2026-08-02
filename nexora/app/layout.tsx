import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/data";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const companyInfo = await getSiteSettings();

  return {
    metadataBase: new URL(`https://${companyInfo.domain}`),
    title: {
      default: `${companyInfo.companyName} — ${companyInfo.tagline}`,
      template: `%s | ${companyInfo.companyName}`,
    },
    description:
      "Nexora builds AI chatbots, automations, and websites that save small and mid-sized businesses time, capture every customer, and help them grow — without needing to be technical.",
    keywords: [
      "AI automation for small business",
      "AI chatbot",
      "business automation",
      "AI website",
      "AI for local business",
    ],
    openGraph: {
      title: `${companyInfo.companyName} — ${companyInfo.tagline}`,
      description:
        "AI chatbots, automations, and websites that save time and never miss a customer.",
      url: `https://${companyInfo.domain}`,
      siteName: companyInfo.companyName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${companyInfo.companyName} — ${companyInfo.tagline}`,
      description:
        "AI chatbots, automations, and websites that save time and never miss a customer.",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const companyInfo = await getSiteSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: companyInfo.companyName,
    url: `https://${companyInfo.domain}`,
    email: companyInfo.email,
    telephone: companyInfo.phone,
    founder: {
      "@type": "Person",
      name: companyInfo.founder,
    },
  };

  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-card"
        >
          Skip to content
        </a>
        <Navbar settings={companyInfo} />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
