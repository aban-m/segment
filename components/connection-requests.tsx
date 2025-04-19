"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/lib/trpc/client"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ConnectionRequests() {
  const { toast } = useToast()
  const utils = api.useUtils()

  const { data: connectionRequests, isLoading } = api.getConnectionRequests.useQuery()

  const respondToRequest = api.respondToConnectionRequest.useMutation({
    onSuccess: () => {
      utils.getConnectionRequests.invalidate()
      utils.getConnections.invalidate()
      toast({
        title: "Success",
        description: "Connection request updated successfully.",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleRespond = (requestId: string, accept: boolean) => {
    respondToRequest.mutate({ requestId, accept })
  }

  const pendingReceived = connectionRequests?.received.filter((r) => r.status === "pending") || []
  const pendingSent = connectionRequests?.sent.filter((r) => r.status === "pending") || []

  return (
    <Tabs defaultValue="received" className="w-full">
      <div className="flex items-center justify-between">
        <CardTitle>Connection Requests</CardTitle>
        <TabsList>
          <TabsTrigger value="received">Received</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="received">
        <Card>
          <CardHeader>
            <CardDescription>Requests from other professionals to connect with you.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-[200px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : pendingReceived.length === 0 ? (
              <p className="text-center text-muted-foreground">No pending requests.</p>
            ) : (
              <div className="space-y-4">
                {pendingReceived.map((request) => (
                  <div key={request.id} className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={request.fromUser.profileImage || ""} alt={request.fromUser.name} />
                        <AvatarFallback>
                          {request.fromUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{request.fromUser.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.fromUser.profile?.role || "No role specified"}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRespond(request.id, false)}
                        disabled={respondToRequest.isLoading}
                      >
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleRespond(request.id, true)}
                        disabled={respondToRequest.isLoading}
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="sent">
        <Card>
          <CardHeader>
            <CardDescription>Requests you've sent to other professionals.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-[200px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : pendingSent.length === 0 ? (
              <p className="text-center text-muted-foreground">No pending requests.</p>
            ) : (
              <div className="space-y-4">
                {pendingSent.map((request) => (
                  <div key={request.id} className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={request.toUser.profileImage || ""} alt={request.toUser.name} />
                        <AvatarFallback>
                          {request.toUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{request.toUser.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.toUser.profile?.role || "No role specified"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
