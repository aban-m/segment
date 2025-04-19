"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/trpc/client"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface ConnectionStatsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ConnectionStats({ className, ...props }: ConnectionStatsProps) {
  const { data: connectionRequests, isLoading: isLoadingRequests } = api.getConnectionRequests.useQuery()
  const { data: connections, isLoading: isLoadingConnections } = api.getConnections.useQuery()

  const isLoading = isLoadingRequests || isLoadingConnections

  const stats = [
    {
      name: "Total Connections",
      value: connections?.length || 0,
    },
    {
      name: "Pending Sent",
      value: connectionRequests?.sent.filter((r) => r.status === "pending").length || 0,
    },
    {
      name: "Pending Received",
      value: connectionRequests?.received.filter((r) => r.status === "pending").length || 0,
    },
  ]

  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>Connection Stats</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[200px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-8">
            {stats.map((stat) => (
              <div key={stat.name} className="flex items-center">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{stat.name}</p>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
