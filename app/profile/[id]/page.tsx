import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { UserProfile } from "@/components/user-profile"

export default async function ProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  if (!session.user.isOnboarded) {
    redirect("/onboarding")
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, params.id),
    with: {
      profile: true,
    },
  })

  if (!user) {
    notFound()
  }

  return (
    <DashboardShell>
      <UserProfile userId={params.id} />
    </DashboardShell>
  )
}
