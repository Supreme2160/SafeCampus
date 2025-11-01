import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers";
import Footer from "@/components/custom/footer/footer";

export const metadata: Metadata = {
  title: "Safe Campus",
  description: "A gamified disaster preparedness platform for schools using interactive drills and real-time analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`}
      >
        <Providers>
          <div className="min-h-dvh flex flex-col">
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
