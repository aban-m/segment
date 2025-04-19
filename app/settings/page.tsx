import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { SettingsForm } from "@/components/settings-form"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  if (!session.user.isOnboarded) {
    redirect("/onboarding")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Manage your account settings." />
      <SettingsForm />
    </DashboardShell>
  )
}
