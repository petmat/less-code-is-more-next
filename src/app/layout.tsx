import type { Metadata } from "next";
import { headers } from "next/headers";
import { Roboto, Kaushan_Script } from "next/font/google";
import cn from "classnames";

import "./globals.css";
import { addVisit } from "../lib/supabase";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-roboto",
});

const kaushanScript = Kaushan_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-kaushan-script",
});

export const metadata: Metadata = {
  title: "Less Code Is More",
  description:
    "A blog about serverless, functional programming, web development, machine learning and all the fun stuff.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const reqHeaders = await headers();
  const visit = {
    remoteAddress: reqHeaders.get("client-ip"),
    userAgent: reqHeaders.get("user-agent"),
    time: new Date().toISOString(),
  };
  await addVisit(visit);

  return (
    <html
      lang="en"
      className={cn(
        roboto.variable,
        kaushanScript.variable,
        "text-lg text-neutral-100"
      )}
    >
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#000000"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#000" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </head>
      <body className="bg-pattern">
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
