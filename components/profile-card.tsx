import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  user: any
}

export function ProfileCard({ user, className, ...props }: ProfileCardProps) {
  return (
    <Card className={cn("", className)} {...props}>
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
        <Button asChild size="sm">
          <Link href="/profile">Edit Profile</Link>
        </Button>
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
  )
}
