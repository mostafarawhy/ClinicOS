import { auth } from "@/lib/auth";
import { ProfileForm } from "./profile-form";
import { PasswordForm } from "./password-form";
import { StatusForm } from "./status-form";
import { NotificationsForm } from "./notifications-form";
import { AddUserForm } from "./add-user-form";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-6 py-5 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export default async function SettingsPage() {
  const session = await auth();
  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2) ?? "?";

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-base font-semibold text-foreground">Settings</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile */}
      <Section
        title="My Profile"
        description="Update your personal information"
      >
        <ProfileForm
          name={user?.name ?? ""}
          email={user?.email ?? ""}
          initials={initials}
        />
      </Section>

      {/* Password */}
      <Section title="Password" description="Change your login password">
        <PasswordForm />
      </Section>

      {/* Status */}
      <Section
        title="Availability Status"
        description="Let your team know your current status"
      >
        <StatusForm />
      </Section>

      {/* Notifications */}
      <Section
        title="Notifications"
        description="Choose what you want to be notified about"
      >
        <NotificationsForm />
      </Section>

      {/* Admin only */}
      {isAdmin && (
        <Section
          title="Add New User"
          description="Create a login account for a staff member"
        >
          <AddUserForm />
        </Section>
      )}
    </div>
  );
}
