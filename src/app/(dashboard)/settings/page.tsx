import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PasswordForm } from "./password-form";
import { StatusForm } from "./status-form";
import { AddUserForm } from "./add-user-form";
import { ManageUsers } from "./manage-users";

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
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-5">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
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

  const dbUser = user?.id
    ? await db.user.findUnique({
        where: { id: user.id },
        select: {
          availabilityStatus: true,
          isActive: true,
        },
      })
    : null;

  const allUsers = isAdmin
    ? await db.user.findMany({
        orderBy: [{ isActive: "desc" }, { createdAt: "asc" }],
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
        },
      })
    : [];

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-base font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <Section title="Password" description="Change your login password">
        <PasswordForm />
      </Section>

      <Section
        title="Availability Status"
        description="Let your team know your current status"
      >
        <StatusForm initialStatus={dbUser?.availabilityStatus} />
      </Section>

      {isAdmin && (
        <>
          <Section
            title="Add New User"
            description="Create a login account for a staff member"
          >
            <AddUserForm />
          </Section>

          <Section
            title="Manage User Access"
            description="Deactivate staff accounts to block access without deleting history"
          >
            <ManageUsers users={allUsers} currentUserId={user?.id ?? ""} />
          </Section>
        </>
      )}
    </div>
  );
}
