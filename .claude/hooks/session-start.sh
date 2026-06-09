#!/bin/bash
set -euo pipefail

# Install dependencies
if [ ! -d "node_modules" ]; then
  echo "📦 Installing npm dependencies..."
  npm install
fi

# Start dev server in background
echo "🚀 Starting DrivePrep dev server on port 5173..."
npm run dev > /tmp/vite.log 2>&1 &
DEV_PID=$!

# Wait for server to be ready (timeout after 30 seconds)
echo "⏳ Waiting for dev server to start..."
for i in {1..60}; do
  if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Dev server is ready at http://localhost:5173"
    exit 0
  fi
  sleep 0.5
done

echo "❌ Dev server failed to start"
cat /tmp/vite.log
exit 1
