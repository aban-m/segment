import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { OnboardingForm } from "./onboarding-form"

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  if (session.user.isOnboarded) {
    redirect("/dashboard")
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-3xl font-bold">Complete Your Profile</h1>
        <p className="text-gray-500">Tell us a bit about yourself to get started.</p>
      </div>
      <OnboardingForm />
    </div>
  )
}
