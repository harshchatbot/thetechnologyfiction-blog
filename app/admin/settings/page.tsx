import { AdminShell } from "@/components/admin/admin-shell";
import { SettingsForm } from "@/components/admin/settings-form";
import { requireAdminUser } from "@/lib/firebase/auth";
import { saveSettingsAction } from "@/features/settings/actions";

export default async function AdminSettingsPage() {
  const user = await requireAdminUser();

  return (
    <AdminShell
      user={user}
      currentPath="/admin/settings"
      title="Site settings"
      description="Control default metadata, organization fields, and AdSense configuration in one place."
    >
      <SettingsForm action={saveSettingsAction} />
    </AdminShell>
  );
}
