import { getDentistsForForm } from "@/lib/queries/appointments";
import { AppointmentForm } from "@/components/appointments/appointment-form";

export default async function AppointmentsPage() {
  const dentists = await getDentistsForForm();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">
            Book New Appointment
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Fill in the details to schedule a patient visit
          </p>
        </div>
        <AppointmentForm dentists={dentists} />
      </div>
    </div>
  );
}
