"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, Phone, Calendar } from "lucide-react";

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
  { patientId: "1", date: "2026-03-10", status: "completed" },
  { patientId: "1", date: "2026-01-20", status: "completed" },
  { patientId: "2", date: "2026-03-15", status: "completed" },
  { patientId: "3", date: "2026-02-28", status: "completed" },
  { patientId: "3", date: "2026-03-18", status: "scheduled" },
  { patientId: "4", date: "2026-03-05", status: "completed" },
  { patientId: "5", date: "2026-02-14", status: "completed" },
  { patientId: "6", date: "2026-03-20", status: "scheduled" },
  { patientId: "7", date: "2026-03-01", status: "completed" },
  { patientId: "8", date: "2026-01-30", status: "completed" },
];

export default function PatientsPage() {
  const [query, setQuery] = useState("");

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.phone.includes(query),
  );

  return (
    <div>
      <div className="relative mb-5 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search by name or phone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border border-border bg-card pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition"
        />
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
            filtered.map((patient) => {
              const patientAppts = appointments.filter(
                (a) => a.patientId === patient.id,
              );
              const lastVisit = patientAppts
                .filter((a) => a.status === "completed")
                .sort((a, b) => b.date.localeCompare(a.date))[0];

              return (
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
                  <span className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    {patient.phone}
                  </span>
                  <span className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground w-[105%]">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    {lastVisit ? lastVisit.date : "—"}
                  </span>
                  <span className="hidden sm:block text-right text-sm text-muted-foreground">
                    {patientAppts.length}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 sm:ml-auto" />
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
