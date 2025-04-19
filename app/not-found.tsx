import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex max-w-md flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Page not found</h1>
          <p className="text-muted-foreground">We couldn't find the page you were looking for.</p>
        </div>
        <div className="space-x-4">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
