import type { Metadata } from "next";
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "Bariforce - Home Service Platform",
  description: "Your trusted platform for home services. Connect with verified professionals.",
  keywords: ["home services", "electrician", "plumber", "cook", "maid", "service provider"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}