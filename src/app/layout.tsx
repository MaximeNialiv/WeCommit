import type { Metadata, Viewport } from "next";
import "./globals.css";
import Script from "next/script";
export const metadata: Metadata = {
  title: "WeCommit",
  description: "Track your daily habits with visual progress",
  manifest: "/manifest.json",
  appleWebApp: {
    statusBarStyle: "default",
    title: "Habit Tracker",
    startupImage: [
    {
      url: "/icon-512.png",
      media: "(orientation: portrait)"
    }]

  },
  formatDetection: {},
  openGraph: {
    title: "WeCommit",
    description: "Track your daily habits with visual progress",
    url: "",
    siteName: "WeCommit",
    type: "website"
  }
};
export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover"
};
export default function RootLayout({
  children


}: {children: React.ReactNode;}) {
  return (
    <html lang="fr" data-oid="5e59e61">
      <head data-oid="9o.iicy">
        <link rel="apple-touch-icon" href="/icon-192.png" data-oid="6w8ahsp" />
        <meta
          name="apple-mobile-web-app-capable"
          content="yes"
          data-oid="95sray7" />


        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="default"
          data-oid="q6l71w2" />

      </head>
      <body className="overscroll-none" data-oid="c24kvza">
        {children}
        <Script
          src="https://cdn.jsdelivr.net/gh/onlook-dev/onlook@main/apps/web/client/public/onlook-preload-script.js"
          strategy="afterInteractive"
          type="module"
          id="https://cdn.jsdelivr.net/gh/onlook-dev/onlook@main/apps/web/client/public/onlook-preload-script.js"
          data-oid="46zww-v">
        </Script>
      </body>
    </html>);

}