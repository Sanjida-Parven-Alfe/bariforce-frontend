import type { Metadata } from "next";
import Header from "@/app/components/Layout/Header";
import Footer from "@/app/components/Layout/Footer";
import Navigation from "@/app/components/Navigation";

export const metadata: Metadata = {
  title: 'Bariforce - Home Service Platform',
  description: 'Your trusted platform for home services',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <Navigation />
        <hr />
        <main>{children}</main>
        <hr />
        <Footer />
      </body>
    </html>
  );
}