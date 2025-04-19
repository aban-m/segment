import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ConnectionsList } from "@/components/connections-list"

export default async function ConnectionsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  if (!session.user.isOnboarded) {
    redirect("/onboarding")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="My Connections" text="View all your professional connections." />
      <ConnectionsList />
    </DashboardShell>
  )
}
