"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">DecentraTweet 🐦</h1>
        <ConnectButton />
      </div>
      {/* Posts list will go here */}
    </main>
  );
}
