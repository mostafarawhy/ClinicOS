"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, Phone, Calendar, X } from "lucide-react";
import { format, isToday, isYesterday, isTomorrow } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import type { PatientWithAppointments } from "@/types";

type Tab = "all" | "today" | "yesterday" | "tomorrow";

const TABS: { label: string; value: Tab }[] = [
  { label: "All", value: "all" },
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Tomorrow", value: "tomorrow" },
];

interface Props {
  patients: PatientWithAppointments[];
}

export function PatientsClient({ patients }: Props) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const withLastVisit = patients.map((p) => {
    const sorted = [...p.appointments].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    const last = sorted[0] ?? null;
    return {
      ...p,
      lastVisit: last ? new Date(last.date) : null,
      appointmentCount: p.appointments.length,
    };
  });

  const filtered = withLastVisit.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(query.toLowerCase()) ||
      p.phone.includes(query);

    if (!matchesSearch) return false;

    if (selectedDate) {
      if (!p.lastVisit) return false;
      return (
        format(p.lastVisit, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      );
    }

    if (tab === "all") return true;
    if (!p.lastVisit) return false;
    if (tab === "today") return isToday(p.lastVisit);
    if (tab === "yesterday") return isYesterday(p.lastVisit);
    if (tab === "tomorrow") return isTomorrow(p.lastVisit);
    return true;
  });

  function handleTabClick(value: Tab) {
    setTab(value);
    setSelectedDate(undefined);
    setPickerOpen(false);
  }

  function handleDaySelect(day: Date | undefined) {
    setSelectedDate(day);
    setTab("all");
    setPickerOpen(false);
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search by name or phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-border bg-card pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition"
          />
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => handleTabClick(t.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === t.value && !selectedDate
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <span className="h-4 w-px bg-border" />

        <div className="relative">
          <button
            onClick={() => setPickerOpen((o) => !o)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
              selectedDate
                ? "border-primary text-foreground"
                : "border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>
              {selectedDate
                ? format(selectedDate, "MMM d, yyyy")
                : "Pick a date"}
            </span>
            {selectedDate && (
              <X
                className="h-3 w-3 ml-0.5 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDate(undefined);
                }}
              />
            )}
          </button>

          {pickerOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setPickerOpen(false)}
              />
              <div className="w-[300px] absolute z-20 mt-1 rounded-xl border border-border bg-card shadow-lg overflow-hidden">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDaySelect}
                  classNames={{
                    root: "p-3",
                    month_caption:
                      "flex justify-center mb-2 text-sm font-medium text-foreground",
                    nav: "flex items-center justify-between mb-2",
                    button_previous:
                      "text-muted-foreground hover:text-foreground p-1 rounded",
                    button_next:
                      "text-muted-foreground hover:text-foreground p-1 rounded",
                    weekdays: "grid grid-cols-7 mb-1",
                    weekday: "text-center text-xs text-muted-foreground py-1",
                    weeks: "space-y-1",
                    week: "grid grid-cols-7",
                    day: "text-center",
                    day_button:
                      "h-8 w-8 rounded-full text-sm hover:bg-secondary transition-colors mx-auto flex items-center justify-center text-foreground",
                    selected:
                      "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary",
                    today: "[&>button]:font-bold [&>button]:text-primary",
                    outside: "[&>button]:text-muted-foreground/40",
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            All Patients
          </h2>
          <span className="text-xs text-muted-foreground">
            {filtered.length} results
          </span>
        </div>

        <div className="hidden sm:grid grid-cols-[1fr_140px_120px_80px_40px] gap-4 px-5 py-2.5 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <span>Patient</span>
          <span>Phone</span>
          <span>Last Visit</span>
          <span className="text-right">Appts</span>
          <span />
        </div>

        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">
              No patients found
            </div>
          ) : (
            filtered.map((patient) => (
              <Link
                key={patient.id}
                href={`/patients/${patient.id}`}
                className="flex sm:grid sm:grid-cols-[1fr_200px_120px_80px_40px] items-center gap-4 px-5 py-4 hover:bg-secondary/40 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {patient.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground sm:hidden mt-0.5">
                    {patient.phone}
                  </p>
                </div>
                <span className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  {patient.phone}
                </span>
                <span className="hidden w-[110%] sm:flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  {patient.lastVisit
                    ? format(patient.lastVisit, "MMM d, yyyy")
                    : "—"}
                </span>
                <span className="hidden sm:block text-right text-sm text-muted-foreground">
                  {patient.appointmentCount}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 sm:ml-auto" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
