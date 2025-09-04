#!/bin/bash

echo "🎲 Generating SBR Monorepo Project..."

# Create main project directory
PROJECT_NAME="sbr-monorepo"
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

# Create folder structure
echo "📁 Creating folder structure..."
mkdir -p apps/web/src/app/login
mkdir -p apps/web/src/app/signup
mkdir -p apps/web/src/app/dashboard
mkdir -p apps/web/src/app/verify-email
mkdir -p apps/web/src/app/api/auth/login
mkdir -p apps/web/src/app/api/auth/signup
mkdir -p apps/web/src/app/api/auth/logout

mkdir -p apps/admin/src/app/login
mkdir -p apps/admin/src/app/dashboard
mkdir -p apps/admin/src/app/unauthorized
mkdir -p apps/admin/src/app/api/auth/login
mkdir -p apps/admin/src/app/api/auth/logout

mkdir -p packages/database/src
mkdir -p packages/database/prisma/migrations/20250101000000_init
mkdir -p packages/auth/src
mkdir -p packages/shared/src
mkdir -p packages/config/src
mkdir -p packages/email/src
mkdir -p packages/ui/src

echo "📝 Creating configuration files..."

# Root package.json
cat > package.json << 'EOF'
{
  "name": "sbr-monorepo",
  "private": true,
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "type-check": "turbo type-check",
    "clean": "turbo clean",
    "db:push": "turbo db:push",
    "db:migrate": "turbo db:migrate",
    "db:generate": "turbo db:generate",
    "db:studio": "turbo db:studio"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  },
  "packageManager": "pnpm@8.15.0",
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}
EOF

# pnpm-workspace.yaml
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - "apps/*"
  - "packages/*"
EOF

# turbo.json
cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build", "db:generate"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {},
    "type-check": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "clean": {
      "cache": false
    },
    "db:push": {
      "cache": false
    },
    "db:migrate": {
      "cache": false
    },
    "db:generate": {
      "cache": false,
      "outputs": ["node_modules/.prisma/**"]
    },
    "db:studio": {
      "cache": false,
      "persistent": true
    }
  }
}
EOF

# .env.example
cat > .env.example << 'EOF'
# Environment
NODE_ENV=development

# Database
DATABASE_URL="file:./dev.db"

# Session
SESSION_SECRET="your-super-secret-session-key-change-in-production"
SESSION_DURATION="7d"

# Email Configuration (Optional for development)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="noreply@sbr.com"

# Application URLs
WEB_URL="http://localhost:3000"
ADMIN_URL="http://localhost:3001"

# BoardGameGeek API
BGG_API_URL="https://boardgamegeek.com/xmlapi2"

# Security
BCRYPT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=15
EOF

# Copy .env.example to .env
cp .env.example .env

echo "✅ Basic project structure created!"
echo ""
echo "Next steps:"
echo "1. cd $PROJECT_NAME"
echo "2. Copy the remaining files from the conversation artifacts"
echo "3. Run: pnpm install"
echo "4. Run: pnpm build"
echo "5. Run: pnpm db:generate && pnpm db:push"
echo "6. Run: pnpm dev"
echo ""
echo "📋 You still need to create all the package.json files, source files, and components manually."
echo "📋 Refer to the artifacts in our conversation for the complete file contents."
