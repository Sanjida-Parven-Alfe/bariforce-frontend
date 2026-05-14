"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isAuthenticated, removeToken } from "@/lib/auth";

interface HeaderProps {
  activePage?: string;
}

export default function Header({ activePage = "home" }: HeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [workerName, setWorkerName] = useState("Worker");
  const authenticated = isAuthenticated();

  useEffect(() => {
    setIsMounted(true);
    if (authenticated) {
      const name = localStorage.getItem("worker_name");
      if (name) setWorkerName(name);
    }
  }, [authenticated]);

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("worker_id");
    localStorage.removeItem("worker_name");
    router.push("/login");
  };

  // Static placeholder for SSR / initial client render (same for both states)
  if (!isMounted) {
    return (
      <header className="header">
        <div className="container">
          <Link href="/" className="logo flex items-center gap-2">
            <Image src="/logo.jpg" alt="Logo" width={50} height={100} className="rounded-full" />
            <span>Bariforce<span>.</span></span>
          </Link>
          <button className="menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="menu-icon"></span>
          </button>
          <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/Register/member2" className="btn-outline">Register</Link>
            <Link href="/login" className="btn-primary">Login</Link>
          </div>
        </div>
      </header>
    );
  }

  // After hydration – full header (different for authenticated)
  return (
    <header className="header">
      <div className="container">
        <Link href="/" className="logo flex items-center gap-2">
          <Image src="/logo.jpg" alt="Logo" width={50} height={100} className="rounded-full" />
          <span>Bariforce<span>.</span></span>
        </Link>

        <button className="menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="menu-icon"></span>
        </button>

        <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          {/* Public links – always visible */}
          <Link href="/" className={activePage === "home" ? "active" : ""}>Home</Link>
          <Link href="/about" className={activePage === "about" ? "active" : ""}>About</Link>
          <Link href="/contact" className={activePage === "contact" ? "active" : ""}>Contact</Link>

          {authenticated ? (
            <>
              <Link href="/dashboard/dashboard" className={activePage === "dashboard" ? "active" : ""}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="text-red-600 hover:text-red-700">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/Register/member2" className="btn-outline">Register</Link>
              <Link href="/login" className="btn-primary">Login</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}