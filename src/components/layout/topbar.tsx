"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useSidebar } from "./sidebar-context";

const pageTitles: Record<string, string> = {
  "/schedule":     "Today's Schedule",
  "/appointments": "Appointment Booking",
  "/patients":     "Patients",
  "/calendar":     "Weekly Calendar",
  "/analytics":    "Analytics Dashboard",
};

interface TopBarProps {
  userName: string;
  role: string;
}

export function TopBar({ userName, role }: TopBarProps) {
  const pathname = usePathname();
  const { toggle } = useSidebar();

  const title =
    Object.entries(pageTitles).find(
      ([key]) => pathname === key || pathname.startsWith(key + "/"),
    )?.[1] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-4 lg:px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={toggle}
          className="lg:hidden -ml-1 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-foreground leading-none">{userName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{role}</p>
        </div>
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
          {userName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>
      </div>
    </header>
  );
}
