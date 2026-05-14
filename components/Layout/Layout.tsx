import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  activePage?: string;
}

export default function Layout({ children, activePage }: LayoutProps) {
  return (
    <>
      <Header activePage={activePage} />
      <main>{children}</main>
      <Footer />
    </>
  );
}