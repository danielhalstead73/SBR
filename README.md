# SBR Monorepo

A complete Next.js monorepo with web and admin applications, featuring session-based authentication, role-based access control, and a comprehensive UI component library.

## 🚀 Features

- **Next.js 15.5.2** with App Router
- **TypeScript** throughout the codebase
- **pnpm workspaces** + **Turborepo** for efficient monorepo management
- **Prisma** + **SQLite** database
- **Tailwind CSS** for styling
- **Session-based authentication** with email verification
- **Role-based access control** (SUPER_ADMIN, VENUE_ADMIN, END_USER)
- **Complete CRUD operations**
- **Responsive UI components**

## 📁 Project Structure

```
C:\SBR\
├── apps/
│   ├── web/          # Main user application
│   └── admin/        # Admin panel
└── packages/
    ├── database/     # Prisma schema and client
    ├── auth/         # Authentication utilities
    ├── shared/       # Shared utilities
    ├── config/       # Environment configuration
    ├── email/        # Email templates and sending
    └── ui/           # UI component library
```

## 🛠️ Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Generate Prisma client:**
   ```bash
   pnpm db:generate
   ```

4. **Push database schema:**
   ```bash
   pnpm db:push
   ```

5. **Start development servers:**
   ```bash
   pnpm dev
   ```

## 🌐 Applications

- **Web App**: http://localhost:3000
- **Admin Panel**: http://localhost:3001

## 📦 Available Scripts

- `pnpm dev` - Start development servers
- `pnpm build` - Build all applications
- `pnpm lint` - Run linting
- `pnpm clean` - Clean build artifacts
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push database schema
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Prisma Studio

## 🔐 Authentication

The system uses session-based authentication with the following roles:

- **SUPER_ADMIN**: Full system access
- **VENUE_ADMIN**: Venue management access
- **END_USER**: Basic user access

## 🎨 UI Components

The `@sbr/ui` package provides a complete component library built with Tailwind CSS, including:

- Buttons, inputs, and form components
- Navigation and layout components
- Modal and notification components
- Responsive design utilities

## 📧 Email System

The `@sbr/email` package handles email verification and notifications using customizable templates.

## 🗄️ Database

The database uses Prisma with SQLite for development. The schema includes:

- User management with authentication
- Session management
- Organization/venue management
- Game data with BGG integration

## 🚀 Deployment

This monorepo is designed to be deployed to platforms like Vercel, with proper environment variable configuration for production.
