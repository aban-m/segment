import { createTRPCReact } from "@trpc/react-query"
import type { AppRouter } from "@/lib/trpc/router"

export const api = createTRPCReact<AppRouter>()
