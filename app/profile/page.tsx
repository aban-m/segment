import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ProfileForm } from "@/components/profile-form"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export default async function ProfileEditPage() {
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
      <DashboardHeader heading="Edit Profile" text="Update your professional information." />
      <ProfileForm user={user} />
    </DashboardShell>
  )
}
