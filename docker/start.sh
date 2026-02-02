#!/bin/sh
set -e

echo "🚀 Starting Lumina Agency..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
sleep 5

# Run Prisma migrations
echo "📦 Running database migrations..."
npx prisma db push --accept-data-loss 2>/dev/null || echo "⚠️ Migration skipped (using init SQL)"

# Create admin user if not exists
echo "👤 Checking admin user..."
node scripts/create-admin.js 2>/dev/null || echo "⚠️ Admin check skipped"

# Start the application
echo "✅ Starting Next.js server..."
exec node server.js
