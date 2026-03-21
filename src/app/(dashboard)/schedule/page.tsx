import { ScheduleColumn, type Appointment } from "./schedule-column";

const DENTISTS = [
  { name: "Dr. Ahmed Hassan", color: "#2DD4BF" },
  { name: "Dr. Sara Mahmoud", color: "#818CF8" },
  { name: "Dr. Omar Khalil",  color: "#FB923C" },
];

const todayAppointments: Appointment[] = [
  { id: "s1",  patientName: "Ahmed Hassan",  phone: "0101234567", treatment: "Cleaning",     time: "09:00", status: "completed", },
  { id: "s2",  patientName: "Nour El-Din",   phone: "0155443322", treatment: "Root Canal",   time: "11:00", status: "completed", },
  { id: "s3",  patientName: "Hana Samir",    phone: "0128899001", treatment: "Consultation", time: "13:00", status: "scheduled", },
  { id: "s4",  patientName: "Youssef Fawzy", phone: "0141122334", treatment: "Crown",        time: "15:00", status: "scheduled", },
  { id: "s5",  patientName: "Sara Mahmoud",  phone: "0109876543", treatment: "Filling",      time: "09:30", status: "completed", },
  { id: "s6",  patientName: "Layla Mostafa", phone: "0113344556", treatment: "Whitening",    time: "11:30", status: "scheduled", },
  { id: "s7",  patientName: "Karim Adel",    phone: "0106677889", treatment: "Cleaning",     time: "14:00", status: "cancelled", },
  { id: "s8",  patientName: "Omar Khalil",   phone: "0121122334", treatment: "Extraction",   time: "10:00", status: "completed", },
  { id: "s9",  patientName: "Ahmed Hassan",  phone: "0101234567", treatment: "Filling",      time: "12:00", status: "scheduled", },
  { id: "s10", patientName: "Nour El-Din",   phone: "0155443322", treatment: "Crown",        time: "14:30", status: "scheduled", },
];

const dentistAppts: Record<string, Appointment[]> = {
  "Dr. Ahmed Hassan": todayAppointments.filter((_, i) => i < 4),
  "Dr. Sara Mahmoud": todayAppointments.filter((_, i) => i >= 4 && i < 7),
  "Dr. Omar Khalil":  todayAppointments.filter((_, i) => i >= 7),
};

export default function SchedulePage() {
  const total = Object.values(dentistAppts).reduce((sum, a) => sum + a.length, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Saturday, March 21, 2026</p>
          <p className="text-xs text-muted-foreground mt-0.5">{total} total appointments today</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {DENTISTS.map((d) => {
          const appts = dentistAppts[d.name] ?? [];
          return (
            <ScheduleColumn
              key={d.name}
              dentist={d.name}
              color={d.color}
              appointments={appts}
              completedCount={appts.filter((a) => a.status === "completed").length}
            />
          );
        })}
      </div>
    </div>
  );
}
