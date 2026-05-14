"use client";
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="nav">
      <div className="container">
        <Link href="/">Home</Link>
        <Link href="/Register/member2">Worker Register</Link>
        <Link href="/Register/member3">Customer Register</Link>
        <Link href="/Register/member1">Admin Register</Link>
      </div>
    </nav>
  );
}