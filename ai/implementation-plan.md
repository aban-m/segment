# implementation-plan.md

## Step-by-Step Action Plan

### Phase 1: MVP Launch
1. **Set up project environment**
   - Initialize Next.js 15 project with App Router
   - Set up tRPC, Zod, and Drizzle ORM
   - Connect Neon Postgres database

2. **Authentication**
   - Integrate NextAuth v4 with Google provider only
   - Configure session and JWT handling

3. **Onboarding Flow**
   - Redirect first-time users to onboarding form
   - Capture: name (prefilled), phone, location, role, bio, skills, interests
   - Save to Profile table linked to User

4. **Profile Dashboard**
   - Display current profile info with edit capability
   - Track and show number of connections made

5. **Connection Request System**
   - Send/accept/reject requests
   - Reveal contact info only upon mutual acceptance
   - Dashboard section for incoming/outgoing/past connections

6. **Basic Search or Browse Professionals**
   - View paginated or filtered list of other users
   - Option to initiate a connection

### Phase 2: UI and UX Improvements
- Refine design system (fonts, colors, spacing)
- Add connection status badges or tags
- Improve responsive layout

### Phase 3: Optional Enhancements
- Filtering by skill, role, and location
- Admin tools (optional moderation)
- Integration with analytics or emailing tools (e.g., PostHog, Resend)

## Recommended Team Setup

- **Solo dev or small team** can easily build MVP
- Optionally bring in:
  - UI/UX designer (for phase 2 polish)
  - Backend dev (if scaling connections/search gets complex)

## Optional Tasks & Integrations

- Add basic rate limiting or anti-spam protections
- Invite flow via email (e.g., “Invite a colleague”)
- Unit + integration tests with Vitest or Testing Library

