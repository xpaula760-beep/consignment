"use client";

import React from "react";

export default function AdminHeader({ onOpenSidebar }) {
  return (
    <header className="lg:hidden sticky top-0 z-30 border-b bg-white">
      <div className="flex items-center gap-3 px-4 h-14">
        <button
          onClick={onOpenSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border bg-white"
          aria-label="Open sidebar"
        >
          ☰
        </button>
        <div className="text-lg font-semibold">Admin</div>
      </div>
    </header>
  );
}
