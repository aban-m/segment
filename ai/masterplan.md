# masterplan.md

## App Overview and Objectives

This app is a professional networking web platform focused on streamlined, meaningful connections. Unlike traditional platforms like LinkedIn, it removes messaging and content feeds to keep things simple and distraction-free. When two professionals mutually agree to connect, their contact information is revealed to each other. The platform emphasizes authentic introductions over ongoing chatter.

## Target Audience

- Professionals across all industries and roles
- Users seeking genuine professional networking without social distractions
- Job seekers, recruiters, entrepreneurs, freelancers, etc.

## Core Features and Functionality

- Google sign-in with onboarding flow for new users
- User profile creation/editing (skills, interests, location, etc.)
- Connection request system with accept/reject actions
- Mutual connections unlock contact information (email, phone, LinkedIn, etc.)
- Dashboard view of current connections, profile data, and request status

## High-Level Technical Stack

- **Frontend**: Next.js 15 with App Router
- **API/Backend**: tRPC + Zod
- **ORM & DB**: Drizzle ORM + Neon Postgres
- **Auth**: NextAuth v4 (Google only)
- **Hosting**: Vercel

## Conceptual Data Model

### User
- id (UUID)
- name
- email
- profileImage
- isOnboarded (bool)

### Profile
- userId (FK)
- bio
- skills (array)
- interests (array)
- location
- role

### ContactInfo
- userId (FK)
- email
- phone (optional)
- linkedin (optional)
- address (optional)

### ConnectionRequest
- id (UUID)
- fromUserId
- toUserId
- status (pending/accepted/rejected)
- createdAt

## User Interface Design Principles

- Clean, corporate aesthetic with a bluish theme
- Focused UX with minimal distractions
- Responsive, mobile-friendly layout
- Professional fonts (e.g., Inter or IBM Plex Sans)
- Clear CTAs for connecting and managing profiles

## Security Considerations

- OAuth via Google for secure login
- Contact data only shown upon mutual connection
- Input validation with Zod on both client and server
- Database access via type-safe Drizzle queries
- Protection against unauthorized profile or data access

## Development Phases or Milestones

### Phase 1: MVP
- Google login and onboarding flow
- Profile setup and edit functionality
- Connection requests and status management
- Dashboard with profile and connection stats

### Phase 2: Polishing and UI Enhancements
- Refined UI with better styling and transitions
- Filtering/browsing professionals by role/skill/location
- Account settings panel

### Phase 3: Optional Expansion
- Connection analytics
- Smart suggestions
- Advanced profile search
- Admin tools or moderation features

## Potential Challenges and Solutions

- **User discovery**: Implement search/filtering tools for roles, skills, and locations
- **Data privacy**: Limit exposure of contact info until a mutual connection
- **Profile quality**: Require key fields during onboarding to ensure rich profiles

## Future Expansion Possibilities

- Smart connection suggestions via AI
- Role- or industry-specific communities
- Event-based connection tools (e.g., digital business cards at meetups)
- Premium tiers with extended features

