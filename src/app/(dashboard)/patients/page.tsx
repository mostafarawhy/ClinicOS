"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, Phone, Calendar, X } from "lucide-react";
import { format, isToday, isYesterday, isTomorrow, parseISO } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

const patients = [
  { id: "1", name: "Ahmed Hassan", phone: "0101234567" },
  { id: "2", name: "Sara Mahmoud", phone: "0109876543" },
  { id: "3", name: "Omar Khalil", phone: "0121122334" },
  { id: "4", name: "Nour El-Din", phone: "0155443322" },
  { id: "5", name: "Layla Mostafa", phone: "0113344556" },
  { id: "6", name: "Karim Adel", phone: "0106677889" },
  { id: "7", name: "Hana Samir", phone: "0128899001" },
  { id: "8", name: "Youssef Fawzy", phone: "0141122334" },
];

const appointments = [
  { patientId: "1", date: "2026-03-21", status: "completed" }, // today
  { patientId: "1", date: "2026-01-20", status: "completed" },
  { patientId: "2", date: "2026-03-22", status: "scheduled" }, // tomorrow
  { patientId: "2", date: "2026-03-15", status: "completed" },
  { patientId: "3", date: "2026-03-21", status: "scheduled" }, // today
  { patientId: "3", date: "2026-02-28", status: "completed" },
  { patientId: "4", date: "2026-03-22", status: "scheduled" }, // tomorrow
  { patientId: "4", date: "2026-03-05", status: "completed" },
  { patientId: "5", date: "2026-03-20", status: "completed" }, // yesterday
  { patientId: "5", date: "2026-02-14", status: "completed" },
  { patientId: "6", date: "2026-03-20", status: "completed" }, // yesterday
  { patientId: "7", date: "2026-03-01", status: "completed" },
  { patientId: "8", date: "2026-01-30", status: "completed" },
];

type Tab = "all" | "today" | "yesterday" | "tomorrow";

const TABS: { label: string; value: Tab }[] = [
  { label: "All", value: "all" },
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Tomorrow", value: "tomorrow" },
];

export default function PatientsPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // derive each patient's most recent appointment date
  const withLastVisit = patients.map((p) => {
    const last = appointments
      .filter((a) => a.patientId === p.id)
      .sort((a, b) => b.date.localeCompare(a.date))[0];
    return {
      ...p,
      lastVisit: last ?? null,
      allAppts: appointments.filter((a) => a.patientId === p.id),
    };
  });

  const filtered = withLastVisit.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.phone.includes(query);

    if (!matchesSearch) return false;

    if (selectedDate) {
      return p.lastVisit?.date === format(selectedDate, "yyyy-MM-dd");
    }

    if (tab === "all") return true;

    if (!p.lastVisit) return false;
    const date = parseISO(p.lastVisit.date);
    if (tab === "today") return isToday(date);
    if (tab === "yesterday") return isYesterday(date);
    if (tab === "tomorrow") return isTomorrow(date);
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
      {/* Search */}
      <div className="relative mb-3 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search by name or phone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border border-border bg-card pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition"
        />
      </div>

      {/* Filters row */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {/* Date tabs */}
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

        {/* Calendar picker */}
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

      {/* Table */}
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
                className="flex sm:grid sm:grid-cols-[1fr_140px_120px_80px_40px] items-center gap-4 px-5 py-4 hover:bg-secondary/40 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {patient.name}
                  </p>
                  <p className="text-xs text-muted-foreground sm:hidden mt-0.5">
                    {patient.phone}
                  </p>
                </div>
                <span className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground ">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  {patient.phone}
                </span>
                <span className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground w-[105%]">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  {patient.lastVisit ? patient.lastVisit.date : "—"}
                </span>
                <span className="hidden sm:block text-right text-sm text-muted-foreground">
                  {patient.allAppts.length}
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
