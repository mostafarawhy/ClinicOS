"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const STATUSES = [
  { value: "available",  label: "Available",     dot: "bg-emerald-400" },
  { value: "busy",       label: "Busy",           dot: "bg-yellow-400" },
  { value: "sick",       label: "Sick Leave",     dot: "bg-red-400" },
  { value: "vacation",   label: "Vacation",       dot: "bg-blue-400" },
  { value: "remote",     label: "Remote",         dot: "bg-indigo-400" },
  { value: "off",        label: "Day Off",        dot: "bg-muted-foreground" },
];

export function StatusForm() {
  const [selected, setSelected] = useState("available");

  return (
    <div className="px-6 py-5 space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {STATUSES.map((s) => {
          const active = selected === s.value;
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => setSelected(s.value)}
              className={cn(
                "flex items-center gap-2.5 rounded-lg border px-4 py-3 text-sm font-medium transition-colors text-left",
                active
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", s.dot)} />
              {s.label}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Set Status
      </button>
    </div>
  );
}
