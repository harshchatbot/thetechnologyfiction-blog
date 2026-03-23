import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Admin login</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Access the editorial dashboard</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Sign in with your Firebase email/password account. Admin access is restricted to allowlisted emails.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </Card>
    </div>
  );
}
