# @sbr/database

Database package for the SBR monorepo containing Prisma schema, client, and services.

## Usage

### Import the Prisma client
```typescript
import prisma from '@sbr/database/client'
```

### Import database services
```typescript
import { userService, organizationService, eventService } from '@sbr/database'
```

## Database Operations

- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema changes to database
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Prisma Studio

## Environment Setup

The database uses SQLite for development. Ensure your `DATABASE_URL` points to the correct location:

- For Prisma CLI operations: `DATABASE_URL="file:./dev.db"`
- For runtime in apps: `DATABASE_URL="file:../../packages/database/prisma/dev.db"`
