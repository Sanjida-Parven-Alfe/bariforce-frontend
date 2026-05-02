"use client";

import Link from 'next/link';

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link> |{' '}
      <Link href="/about">About</Link> |{' '} 
      <Link href="/register">Register</Link> |{' '}
      <Link href="/login">Login</Link>
    </nav>
  );
}