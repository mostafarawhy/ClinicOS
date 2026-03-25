import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, FileText, Stethoscope } from "lucide-react";
import { format } from "date-fns";
import { getPatientById } from "@/lib/queries/patients";
import type { AppointmentStatus } from "@prisma/client";

const statusStyles: Record<AppointmentStatus, string> = {
  COMPLETED: "bg-emerald-500/10 text-emerald-400",
  UPCOMING: "bg-primary/10 text-primary",
  NO_SHOW: "bg-yellow-500/10 text-yellow-400",
  CANCELLED: "bg-red-500/10 text-red-400",
};

function formatStatus(status: AppointmentStatus): string {
  return status.toLowerCase().replace("_", " ");
}

function formatTreatment(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PatientProfilePage({ params }: Props) {
  const { id } = await params;
  const patient = await getPatientById(id);
  if (!patient) notFound();

  const totalCompleted = patient.appointments.filter(
    (a) => a.status === "COMPLETED",
  ).length;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <Link
        href="/patients"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to patients
      </Link>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg shrink-0">
              {patient.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                {patient.fullName}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Patient since {format(new Date(patient.createdAt), "MMM yyyy")}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">
              {patient.appointments.length}
            </p>
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
              <p className="text-sm text-foreground">{patient.email ?? "—"}</p>
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

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">
            Visit History
          </h3>
        </div>

        <div className="hidden sm:grid grid-cols-[120px_1fr_1fr_110px] gap-4 px-5 py-2.5 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <span>Date</span>
          <span>Dentist</span>
          <span>Treatment</span>
          <span>Status</span>
        </div>

        <div className="divide-y divide-border">
          {patient.appointments.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">
              No visits recorded
            </div>
          ) : (
            patient.appointments.map((appt) => (
              <div
                key={appt.id}
                className="grid grid-cols-1 sm:grid-cols-[120px_1fr_1fr_110px] gap-2 sm:gap-4 px-5 py-3.5 hover:bg-secondary/40 transition-colors"
              >
                <span className="text-sm text-muted-foreground">
                  {format(new Date(appt.date), "MMM d, yyyy")}
                </span>
                <span className="text-sm text-foreground">
                  {appt.dentist.name}
                </span>
                <span className="text-sm text-foreground">
                  {formatTreatment(appt.treatmentType)}
                </span>
                <span
                  className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    statusStyles[appt.status] ??
                    "bg-secondary text-muted-foreground"
                  }`}
                >
                  {formatStatus(appt.status)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
