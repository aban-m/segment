import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ProfileCard } from "@/components/profile-card"
import { ConnectionStats } from "@/components/connection-stats"
import { ConnectionRequests } from "@/components/connection-requests"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  if (!session.user.isOnboarded) {
    redirect("/onboarding")
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    with: {
      profile: true,
      contactInfo: true,
    },
  })

  if (!user) {
    redirect("/")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="View your profile and connections." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ProfileCard user={user} className="md:col-span-2 lg:col-span-2" />
        <ConnectionStats className="md:row-span-2" />
      </div>
      <div className="mt-4">
        <ConnectionRequests />
      </div>
    </DashboardShell>
  )
}
