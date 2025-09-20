@echo off
echo Starting SBR Monorepo Clean Setup...

echo.
echo Step 1: Cleaning all node_modules and build artifacts...
if exist node_modules rmdir /s /q node_modules
if exist packages\database\node_modules rmdir /s /q packages\database\node_modules
if exist packages\auth\node_modules rmdir /s /q packages\auth\node_modules
if exist packages\shared\node_modules rmdir /s /q packages\shared\node_modules
if exist packages\config\node_modules rmdir /s /q packages\config\node_modules
if exist packages\email\node_modules rmdir /s /q packages\email\node_modules
if exist packages\ui\node_modules rmdir /s /q packages\ui\node_modules
if exist apps\admin\node_modules rmdir /s /q apps\admin\node_modules
if exist apps\web\node_modules rmdir /s /q apps\web\node_modules
if exist apps\admin\.next rmdir /s /q apps\admin\.next
if exist apps\web\.next rmdir /s /q apps\web\.next
if exist packages\database\.prisma rmdir /s /q packages\database\.prisma
if exist packages\database\prisma\dev.db del packages\database\prisma\dev.db
if exist pnpm-lock.yaml del pnpm-lock.yaml

echo.
echo Step 2: Installing dependencies with correct Prisma version...
pnpm install

echo.
echo Step 3: Generating Prisma client...
cd packages\database
pnpm prisma generate
pnpm prisma db push
cd ..\..

echo.
echo Step 4: Starting development servers...
echo Web app will run on http://localhost:3000
echo Admin app will run on http://localhost:3001
echo.
pnpm dev

pause
