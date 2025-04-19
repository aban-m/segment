"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/trpc/client"
import { Loader2 } from "lucide-react"

export function UserProfile({ userId }: { userId: string }) {
  const { toast } = useToast()
  const utils = api.useUtils()

  const { data: user, isLoading: isLoadingUser } = api.getUserProfile.useQuery({
    userId,
  })

  const { data: connectionStatus, isLoading: isLoadingStatus } = api.getConnectionStatus.useQuery({
    userId,
  })

  const { data: contactInfo, isLoading: isLoadingContact } = api.getContactInfo.useQuery(
    {
      userId,
    },
    {
      enabled: connectionStatus?.status === "connected",
      retry: false,
    },
  )

  const sendRequest = api.sendConnectionRequest.useMutation({
    onSuccess: () => {
      toast({
        title: "Request sent",
        description: "Your connection request has been sent.",
      })
      utils.getConnectionStatus.invalidate()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const isLoading = isLoadingUser || isLoadingStatus

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold">User not found</h2>
        <p className="text-muted-foreground">The user you're looking for doesn't exist.</p>
      </div>
    )
  }

  const handleConnect = () => {
    sendRequest.mutate({ toUserId: userId })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.profileImage || ""} alt={user.name} />
            <AvatarFallback>
              {user.name
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <CardTitle>{user.name}</CardTitle>
            <div className="text-sm text-muted-foreground">{user.profile?.role || "No role specified"}</div>
            <div className="text-sm text-muted-foreground">{user.profile?.location || "No location specified"}</div>
          </div>
          {isLoadingStatus ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading
            </Button>
          ) : connectionStatus?.status === "none" ? (
            <Button onClick={handleConnect} className="bg-blue-600 hover:bg-blue-700">
              Connect
            </Button>
          ) : connectionStatus?.status === "sent" ? (
            <Button disabled variant="outline">
              Request Sent
            </Button>
          ) : connectionStatus?.status === "received" ? (
            <Button variant="outline" disabled>
              Pending Your Response
            </Button>
          ) : (
            <Button disabled variant="outline">
              Connected
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-medium">Bio</h3>
              <p className="text-sm text-muted-foreground">{user.profile?.bio || "No bio specified"}</p>
            </div>
            <div>
              <h3 className="mb-2 font-medium">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.profile?.skills && user.profile.skills.length > 0 ? (
                  user.profile.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No skills specified</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-medium">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {user.profile?.interests && user.profile.interests.length > 0 ? (
                  user.profile.interests.map((interest: string) => (
                    <Badge key={interest} variant="outline">
                      {interest}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No interests specified</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {connectionStatus?.status === "connected" && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>You can see this information because you are connected.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingContact ? (
              <div className="flex h-[100px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : contactInfo ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <p className="text-sm">{contactInfo.email}</p>
                </div>
                {contactInfo.phone && (
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <p className="text-sm">{contactInfo.phone}</p>
                  </div>
                )}
                {contactInfo.linkedin && (
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    <a
                      href={contactInfo.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
                {contactInfo.address && (
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <p className="text-sm">{contactInfo.address}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Contact information not available.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
