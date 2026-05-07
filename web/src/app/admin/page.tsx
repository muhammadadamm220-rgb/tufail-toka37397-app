"use client";

import Link from "next/link";

export default function AdminFakeNotFound() {
  return (
    <div style={{ textAlign: "center", marginTop: "150px" }}>
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <p className="text-xl text-gray-500 mt-4">Page not found</p>
      <Link href="/" className="text-primary font-bold mt-6 inline-block hover:underline">
        Go Home
      </Link>
    </div>
  );
}
