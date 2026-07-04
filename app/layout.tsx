import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "LoadMaster AI — AI for Logistics Marketing in Seconds",
  description:
    "Generate viral captions, hashtags, slogans, video scripts, and AI video prompts for your trucking or logistics business instantly.",
  keywords: [
    "trucking marketing",
    "logistics AI",
    "freight social media",
    "AI content generator",
    "trucking company marketing",
  ],
  openGraph: {
    title: "LoadMaster AI — AI for Logistics Marketing in Seconds",
    description:
      "Generate captions, ads, scripts, and viral content for your trucking business instantly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
