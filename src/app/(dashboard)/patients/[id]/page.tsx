import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, FileText, Stethoscope } from "lucide-react";

const patients = [
  { id: "1", name: "Ahmed Hassan",  phone: "0101234567", email: "ahmed@example.com",  createdAt: "2024-01", notes: "Allergic to penicillin." },
  { id: "2", name: "Sara Mahmoud",  phone: "0109876543", email: "sara@example.com",   createdAt: "2024-03", notes: "" },
  { id: "3", name: "Omar Khalil",   phone: "0121122334", email: "omar@example.com",   createdAt: "2024-05", notes: "Prefers morning appointments." },
  { id: "4", name: "Nour El-Din",   phone: "0155443322", email: "nour@example.com",   createdAt: "2024-07", notes: "" },
  { id: "5", name: "Layla Mostafa", phone: "0113344556", email: "layla@example.com",  createdAt: "2024-08", notes: "" },
  { id: "6", name: "Karim Adel",    phone: "0106677889", email: "karim@example.com",  createdAt: "2024-10", notes: "Anxiety around dental procedures." },
  { id: "7", name: "Hana Samir",    phone: "0128899001", email: "hana@example.com",   createdAt: "2025-01", notes: "" },
  { id: "8", name: "Youssef Fawzy", phone: "0141122334", email: "youssef@example.com",createdAt: "2025-02", notes: "" },
];

const visits = [
  { id: "v1",  patientId: "1", date: "2026-03-10", dentist: "Dr. Ahmed Hassan",  treatment: "Cleaning",     status: "completed" },
  { id: "v2",  patientId: "1", date: "2026-01-20", dentist: "Dr. Sara Mahmoud",  treatment: "Filling",      status: "completed" },
  { id: "v3",  patientId: "1", date: "2025-11-05", dentist: "Dr. Ahmed Hassan",  treatment: "Consultation", status: "completed" },
  { id: "v4",  patientId: "2", date: "2026-03-15", dentist: "Dr. Omar Khalil",   treatment: "Whitening",    status: "completed" },
  { id: "v5",  patientId: "3", date: "2026-03-18", dentist: "Dr. Ahmed Hassan",  treatment: "Root Canal",   status: "scheduled" },
  { id: "v6",  patientId: "3", date: "2026-02-28", dentist: "Dr. Sara Mahmoud",  treatment: "Extraction",   status: "completed" },
  { id: "v7",  patientId: "4", date: "2026-03-05", dentist: "Dr. Omar Khalil",   treatment: "Filling",      status: "completed" },
  { id: "v8",  patientId: "5", date: "2026-02-14", dentist: "Dr. Ahmed Hassan",  treatment: "Cleaning",     status: "completed" },
  { id: "v9",  patientId: "6", date: "2026-03-20", dentist: "Dr. Sara Mahmoud",  treatment: "Crown",        status: "scheduled" },
  { id: "v10", patientId: "7", date: "2026-03-01", dentist: "Dr. Omar Khalil",   treatment: "Consultation", status: "completed" },
  { id: "v11", patientId: "8", date: "2026-01-30", dentist: "Dr. Ahmed Hassan",  treatment: "Filling",      status: "completed" },
];

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-400",
  scheduled:  "bg-primary/10 text-primary",
  cancelled:  "bg-red-500/10 text-red-400",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PatientProfilePage({ params }: Props) {
  const { id } = await params;
  const patient = patients.find((p) => p.id === id);
  if (!patient) notFound();

  const patientVisits = visits
    .filter((v) => v.patientId === id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const totalCompleted = patientVisits.filter((v) => v.status === "completed").length;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <Link
        href="/patients"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to patients
      </Link>

      {/* Info Card */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg shrink-0">
              {patient.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">{patient.name}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Patient since {patient.createdAt}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{patientVisits.length}</p>
            <p className="text-xs text-muted-foreground">Total visits</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
          <div className="flex items-center gap-3 px-6 py-4">
            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm text-foreground">{patient.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm text-foreground">{patient.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <Stethoscope className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Completed visits</p>
              <p className="text-sm text-foreground">{totalCompleted}</p>
            </div>
          </div>
        </div>

        {patient.notes && (
          <div className="px-6 py-4 border-t border-border flex items-start gap-3 bg-secondary/30">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">{patient.notes}</p>
          </div>
        )}
      </div>

      {/* Visit History */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Visit History</h3>
        </div>

        <div className="hidden sm:grid grid-cols-[120px_1fr_1fr_110px] gap-4 px-5 py-2.5 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <span>Date</span>
          <span>Dentist</span>
          <span>Treatment</span>
          <span>Status</span>
        </div>

        <div className="divide-y divide-border">
          {patientVisits.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">No visits recorded</div>
          ) : (
            patientVisits.map((visit) => (
              <div key={visit.id} className="grid grid-cols-1 sm:grid-cols-[120px_1fr_1fr_110px] gap-2 sm:gap-4 px-5 py-3.5 hover:bg-secondary/40 transition-colors">
                <span className="text-sm text-muted-foreground">{visit.date}</span>
                <span className="text-sm text-foreground">{visit.dentist}</span>
                <span className="text-sm text-foreground">{visit.treatment}</span>
                <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[visit.status] ?? "bg-secondary text-muted-foreground"}`}>
                  {visit.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
