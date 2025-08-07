# DeenQuest Tech Stack

## Build System
- **Monorepo**: Turborepo for coordinated builds across apps
- **Package Manager**: Bun (v1.2.16+) for fast installs and runtime
- **Node Version**: 18+ required

## Frontend (Mobile App)
- **Framework**: React Native 0.79 with Expo 53
- **Routing**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Icons**: Lucide React Native
- **Fonts**: Space Grotesk, Urbanist
- **Audio**: Expo AV for audio playback
- **State Management**: React Query + tRPC for server state

## Backend (API Server)
- **Runtime**: Bun with TypeScript
- **Framework**: Hono (fast web framework)
- **API**: tRPC for type-safe client-server communication
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Better Auth with Expo integration
- **Deployment**: Vercel

## Development Tools
- **TypeScript**: Strict typing across the stack
- **Testing**: Jest for unit tests
- **Database**: Drizzle Kit for migrations and schema management
- **Build**: EAS Build for native app compilation

## Common Commands

### Root Level
```bash
# Install dependencies
bun install

# Start all services
bun run dev

# Build all apps
bun run build

# Type checking
bun run check-types
```

### Database (from root)
```bash
# Push schema changes
bun run db:push

# Open database studio
bun run db:studio

# Generate migrations
bun run db:generate

# Run migrations
bun run db:migrate
```

### Mobile App (apps/native)
```bash
# Start development server
bun run dev

# Build for different environments
bun run build:dev
bun run build:preview
bun run build:production

# Run tests
bun run test
bun run test:coverage
```

### Server (apps/server)
```bash
# Start development server
bun run dev

# Build for production
bun run build

# Database operations
bun run db:seed
bun run db:seed-badges
```

## Environment Setup
- Copy `.env.example` files in both `apps/native` and `apps/server`
- Configure database URL in server `.env`
- Set API endpoints in native app `.env` files
- EAS project configuration in `app.config.js`