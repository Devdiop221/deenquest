# DeenQuest Project Structure

## Monorepo Organization
```
DeenQuest/
├── apps/
│   ├── native/  # React Native mobile app
│   └── server/          # Hono API server
├── scripts/             # Build and deployment scripts
├── docs/               # Project documentation
└── .kiro/              # Kiro AI assistant configuration
```

## Mobile App Structure (apps/native/)
```
apps/native/
├── app/                # Expo Router pages (file-based routing)
│   ├── (tabs)/         # Tab navigation screens
│   │   ├── index.tsx   # Home screen
│   │   ├── quiz.tsx    # Quiz listing
│   │   ├── lectures.tsx # Audio stories
│   │   ├── favorites.tsx # User favorites
│   │   └── profile.tsx # User profile
│   ├── auth/           # Authentication screens
│   ├── category/       # Category detail screens
│   ├── lecture/        # Individual lecture screens
│   └── quiz/           # Individual quiz screens
├── components/         # Reusable UI components
├── lib/               # Utilities, hooks, and services
│   ├── auth-client.ts  # Authentication logic
│   ├── trpc-client.ts  # API client setup
│   ├── constants.ts    # App constants and colors
│   └── use-*.ts       # Custom hooks
├── assets/            # Images, fonts, and static files
└── utils/             # Helper functions
```

## Server Structure (apps/server/)
```
apps/server/
├── src/
│   ├── routers/        # tRPC route handlers
│   ├── db/
│   │   ├── schema/     # Database schema definitions
│   │   ├── migrations/ # Database migrations
│   │   └── seed.ts     # Database seeding scripts
│   ├── lib/
│   │   ├── auth.ts     # Authentication setup
│   │   ├── trpc.ts     # tRPC configuration
│   │   └── context.ts  # Request context
│   └── index.ts        # Server entry point
└── supabase/          # Supabase configuration
```

## Naming Conventions

### Files and Folders
- **Screens**: PascalCase for React components (`Profile.tsx`)
- **Utilities**: kebab-case for non-component files (`auth-client.ts`)
- **Hooks**: Prefix with `use-` (`use-theme-colors.ts`)
- **Components**: PascalCase (`ThemedView.tsx`)
- **Database**: snake_case for tables and columns

### Routes (Expo Router)
- **Tab screens**: Located in `app/(tabs)/`
- **Dynamic routes**: Use brackets `[id].tsx`
- **Layout files**: Named `_layout.tsx`
- **Modal screens**: Use `modal.tsx` or dedicated modal folder

### Database Schema
- **Tables**: Plural snake_case (`user_progress`, `categories`)
- **Columns**: snake_case (`created_at`, `user_id`)
- **Primary keys**: UUID with `defaultRandom()`
- **Foreign keys**: Reference pattern `{table}_id`

## Component Architecture

### Themed Components
- Use `ThemedView` and `ThemedText` for consistent theming
- Colors defined in `lib/constants.ts` with light/dark variants
- Theme context provides dynamic color switching

### tRPC Integration
- Client setup in `lib/trpc-client.ts`
- Server routers in `src/routers/`
- Type-safe API calls throughout the app
- React Query integration for caching and state management

### Authentication Flow
- Better Auth with Expo integration
- Protected routes use `protectedProcedure` in tRPC
- Auth context provides user session state
- Secure storage for tokens via Expo SecureStore