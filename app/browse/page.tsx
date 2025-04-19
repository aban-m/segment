import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ProfessionalsList } from "@/components/professionals-list"

export default async function BrowsePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  if (!session.user.isOnboarded) {
    redirect("/onboarding")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Browse Professionals" text="Discover and connect with professionals." />
      <ProfessionalsList />
    </DashboardShell>
  )
}
