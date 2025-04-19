"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/trpc/client"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function ProfessionalsList() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const utils = api.useUtils()

  const { data: professionals, isLoading } = api.getProfessionals.useQuery()

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

  const filteredProfessionals = professionals?.filter((professional) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      professional.name.toLowerCase().includes(searchLower) ||
      professional.profile?.role?.toLowerCase().includes(searchLower) ||
      professional.profile?.location?.toLowerCase().includes(searchLower) ||
      professional.profile?.skills?.some((skill) => skill.toLowerCase().includes(searchLower)) ||
      professional.profile?.interests?.some((interest) => interest.toLowerCase().includes(searchLower))
    )
  })

  const handleConnect = (userId: string) => {
    sendRequest.mutate({ toUserId: userId })
  }

  return (
    <div className="space-y-4">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          placeholder="Search by name, role, location, skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredProfessionals?.length === 0 ? (
        <p className="text-center text-muted-foreground">No professionals found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProfessionals?.map((professional) => (
            <ProfessionalCard key={professional.id} professional={professional} onConnect={handleConnect} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProfessionalCard({
  professional,
  onConnect,
}: {
  professional: any
  onConnect: (userId: string) => void
}) {
  const { data: connectionStatus, isLoading } = api.getConnectionStatus.useQuery({
    userId: professional.id,
  })

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={professional.profileImage || ""} alt={professional.name} />
            <AvatarFallback>
              {professional.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{professional.name}</p>
            <p className="text-sm text-muted-foreground">{professional.profile?.role || "No role specified"}</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
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
            <p className="text-sm text-muted-foreground">{professional.profile?.location || "No location specified"}</p>
          </div>
          {professional.profile?.skills && professional.profile.skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {professional.profile.skills.slice(0, 3).map((skill: string) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {professional.profile.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{professional.profile.skills.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/profile/${professional.id}`}>View Profile</Link>
          </Button>
          {isLoading ? (
            <Button disabled size="sm">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading
            </Button>
          ) : connectionStatus?.status === "none" ? (
            <Button onClick={() => onConnect(professional.id)} size="sm" className="bg-blue-600 hover:bg-blue-700">
              Connect
            </Button>
          ) : connectionStatus?.status === "sent" ? (
            <Button disabled size="sm" variant="outline">
              Request Sent
            </Button>
          ) : connectionStatus?.status === "received" ? (
            <Button size="sm" variant="outline" asChild>
              <Link href="/dashboard">Respond</Link>
            </Button>
          ) : (
            <Button disabled size="sm" variant="outline">
              Connected
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
