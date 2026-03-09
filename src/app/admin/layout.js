"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-zinc-50">
      {/* Sidebar */}
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Right side (header + content) */}
      <div className="flex-1 flex flex-col">
        {/* Mobile / Tablet Header (hidden on /admin/login) */}
        {usePathname() !== "/admin/login" && (
          <AdminHeader onOpenSidebar={() => setSidebarOpen(true)} />
        )}

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
