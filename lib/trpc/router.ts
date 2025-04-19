import { z } from "zod"
import { protectedProcedure, router } from "./server"
import { TRPCError } from "@trpc/server"
import { and, eq, ne, or } from "drizzle-orm"
import { connectionRequests, contactInfo, profiles, users } from "@/lib/db/schema"

export const appRouter = router({
  // User procedures
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.email, ctx.session.user.email),
      with: {
        profile: true,
        contactInfo: true,
      },
    })

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      })
    }

    return user
  }),

  // Profile procedures
  updateProfile: protectedProcedure
    .input(
      z.object({
        bio: z.string().optional(),
        skills: z.array(z.string()).optional(),
        interests: z.array(z.string()).optional(),
        location: z.string().optional(),
        role: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.email, ctx.session.user.email),
      })

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        })
      }

      // Update or create profile
      await ctx.db
        .insert(profiles)
        .values({
          userId: user.id,
          ...input,
        })
        .onConflictDoUpdate({
          target: profiles.userId,
          set: {
            ...input,
            updatedAt: new Date(),
          },
        })

      // Mark user as onboarded if not already
      if (!user.isOnboarded) {
        await ctx.db.update(users).set({ isOnboarded: true }).where(eq(users.id, user.id))
      }

      return { success: true }
    }),

  // Contact info procedures
  updateContactInfo: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        phone: z.string().optional(),
        linkedin: z.string().optional(),
        address: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.email, ctx.session.user.email),
      })

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        })
      }

      await ctx.db
        .insert(contactInfo)
        .values({
          userId: user.id,
          ...input,
        })
        .onConflictDoUpdate({
          target: contactInfo.userId,
          set: {
            ...input,
            updatedAt: new Date(),
          },
        })

      return { success: true }
    }),

  // Connection procedures
  getProfessionals: protectedProcedure.query(async ({ ctx }) => {
    const currentUser = await ctx.db.query.users.findFirst({
      where: eq(users.email, ctx.session.user.email),
    })

    if (!currentUser) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      })
    }

    const professionals = await ctx.db.query.users.findMany({
      where: ne(users.id, currentUser.id),
      with: {
        profile: true,
      },
    })

    return professionals
  }),

  getConnectionRequests: protectedProcedure.query(async ({ ctx }) => {
    const currentUser = await ctx.db.query.users.findFirst({
      where: eq(users.email, ctx.session.user.email),
    })

    if (!currentUser) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      })
    }

    const sent = await ctx.db.query.connectionRequests.findMany({
      where: eq(connectionRequests.fromUserId, currentUser.id),
      with: {
        toUser: {
          with: {
            profile: true,
          },
        },
      },
    })

    const received = await ctx.db.query.connectionRequests.findMany({
      where: eq(connectionRequests.toUserId, currentUser.id),
      with: {
        fromUser: {
          with: {
            profile: true,
          },
        },
      },
    })

    return { sent, received }
  }),

  sendConnectionRequest: protectedProcedure
    .input(z.object({ toUserId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const currentUser = await ctx.db.query.users.findFirst({
        where: eq(users.email, ctx.session.user.email),
      })

      if (!currentUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        })
      }

      // Check if request already exists
      const existingRequest = await ctx.db.query.connectionRequests.findFirst({
        where: and(eq(connectionRequests.fromUserId, currentUser.id), eq(connectionRequests.toUserId, input.toUserId)),
      })

      if (existingRequest) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Connection request already exists",
        })
      }

      // Create new request
      await ctx.db.insert(connectionRequests).values({
        fromUserId: currentUser.id,
        toUserId: input.toUserId,
        status: "pending",
      })

      return { success: true }
    }),

  respondToConnectionRequest: protectedProcedure
    .input(
      z.object({
        requestId: z.string().uuid(),
        accept: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const currentUser = await ctx.db.query.users.findFirst({
        where: eq(users.email, ctx.session.user.email),
      })

      if (!currentUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        })
      }

      const request = await ctx.db.query.connectionRequests.findFirst({
        where: and(eq(connectionRequests.id, input.requestId), eq(connectionRequests.toUserId, currentUser.id)),
      })

      if (!request) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Connection request not found",
        })
      }

      await ctx.db
        .update(connectionRequests)
        .set({
          status: input.accept ? "accepted" : "rejected",
          updatedAt: new Date(),
        })
        .where(eq(connectionRequests.id, input.requestId))

      return { success: true }
    }),

  getConnections: protectedProcedure.query(async ({ ctx }) => {
    const currentUser = await ctx.db.query.users.findFirst({
      where: eq(users.email, ctx.session.user.email),
    })

    if (!currentUser) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      })
    }

    const acceptedSent = await ctx.db.query.connectionRequests.findMany({
      where: and(eq(connectionRequests.fromUserId, currentUser.id), eq(connectionRequests.status, "accepted")),
      with: {
        toUser: {
          with: {
            profile: true,
            contactInfo: true,
          },
        },
      },
    })

    const acceptedReceived = await ctx.db.query.connectionRequests.findMany({
      where: and(eq(connectionRequests.toUserId, currentUser.id), eq(connectionRequests.status, "accepted")),
      with: {
        fromUser: {
          with: {
            profile: true,
            contactInfo: true,
          },
        },
      },
    })

    const connections = [
      ...acceptedSent.map((req) => ({
        id: req.toUser.id,
        name: req.toUser.name,
        email: req.toUser.email,
        profileImage: req.toUser.profileImage,
        profile: req.toUser.profile,
        contactInfo: req.toUser.contactInfo,
      })),
      ...acceptedReceived.map((req) => ({
        id: req.fromUser.id,
        name: req.fromUser.name,
        email: req.fromUser.email,
        profileImage: req.fromUser.profileImage,
        profile: req.fromUser.profile,
        contactInfo: req.fromUser.contactInfo,
      })),
    ]

    return connections
  }),

  getConnectionStatus: protectedProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const currentUser = await ctx.db.query.users.findFirst({
        where: eq(users.email, ctx.session.user.email),
      })

      if (!currentUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        })
      }

      const request = await ctx.db.query.connectionRequests.findFirst({
        where: or(
          and(eq(connectionRequests.fromUserId, currentUser.id), eq(connectionRequests.toUserId, input.userId)),
          and(eq(connectionRequests.fromUserId, input.userId), eq(connectionRequests.toUserId, currentUser.id)),
        ),
      })

      if (!request) {
        return { status: "none" }
      }

      if (request.status === "accepted") {
        return { status: "connected" }
      }

      if (request.fromUserId === currentUser.id) {
        return { status: "sent", requestId: request.id }
      }

      return { status: "received", requestId: request.id }
    }),

  getUserProfile: protectedProcedure.input(z.object({ userId: z.string().uuid() })).query(async ({ ctx, input }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, input.userId),
      with: {
        profile: true,
      },
    })

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      })
    }

    return user
  }),

  getContactInfo: protectedProcedure.input(z.object({ userId: z.string().uuid() })).query(async ({ ctx, input }) => {
    const currentUser = await ctx.db.query.users.findFirst({
      where: eq(users.email, ctx.session.user.email),
    })

    if (!currentUser) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      })
    }

    // Check if users are connected
    const connection = await ctx.db.query.connectionRequests.findFirst({
      where: and(
        or(
          and(eq(connectionRequests.fromUserId, currentUser.id), eq(connectionRequests.toUserId, input.userId)),
          and(eq(connectionRequests.fromUserId, input.userId), eq(connectionRequests.toUserId, currentUser.id)),
        ),
        eq(connectionRequests.status, "accepted"),
      ),
    })

    if (!connection) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not connected with this user",
      })
    }

    const userContactInfo = await ctx.db.query.contactInfo.findFirst({
      where: eq(contactInfo.userId, input.userId),
    })

    if (!userContactInfo) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Contact information not found",
      })
    }

    return userContactInfo
  }),
})

export type AppRouter = typeof appRouter
