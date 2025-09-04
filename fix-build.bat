@echo off
echo 🔧 Fixing SBR Monorepo Build Issues...

cd /d C:\SBR

echo 📦 Installing dependencies...
pnpm install

echo 🗄️ Generating Prisma client FIRST...
pnpm --filter @sbr/database db:generate

echo 🏗️ Building packages in correct order...
pnpm --filter @sbr/shared build
pnpm --filter @sbr/config build  
pnpm --filter @sbr/database build
pnpm --filter @sbr/email build
pnpm --filter @sbr/auth build
pnpm --filter @sbr/ui build

echo 🎯 Setting up database...
pnpm --filter @sbr/database db:push

echo ✅ Build fix complete! 

echo 🚀 Starting development servers...
pnpm dev

pause
