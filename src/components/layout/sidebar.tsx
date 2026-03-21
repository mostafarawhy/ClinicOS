"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  CalendarRange,
  LayoutDashboard,
  PlusCircle,
  Users,
  Stethoscope,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const navItems = [
  { label: "Schedule",     href: "/schedule",     icon: CalendarDays },
  { label: "Appointments", href: "/appointments",  icon: PlusCircle },
  { label: "Patients",     href: "/patients",      icon: Users },
  { label: "Calendar",     href: "/calendar",      icon: CalendarRange },
  { label: "Analytics",    href: "/analytics",     icon: LayoutDashboard },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Stethoscope className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold text-sidebar-foreground leading-none">DentaFlow</p>
          <p className="text-xs text-muted-foreground mt-0.5">Clinic Management</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        <ul className="space-y-0.5 px-2">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", active ? "text-sidebar-primary" : "")} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-sidebar-border space-y-0.5">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/settings"
              ? "bg-sidebar-accent text-sidebar-primary"
              : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          )}
        >
          <Settings className={cn("h-4 w-4 shrink-0", pathname === "/settings" ? "text-sidebar-primary" : "")} />
          Settings
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}
