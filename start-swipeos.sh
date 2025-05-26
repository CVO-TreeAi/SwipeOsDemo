#!/bin/bash

# SwipeOS Startup Script
echo "🚀 Starting SwipeOS..."

# Navigate to project directory
cd "$(dirname "$0")"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Get device IP for network access
DEVICE_IP=$(ipconfig getifaddr en0 2>/dev/null || echo "localhost")

echo "🌐 Starting development server..."
echo "📱 Local access: http://localhost:3000"
echo "🌍 Network access: http://$DEVICE_IP:3000"
echo ""
echo "💡 Tips:"
echo "  • Add to home screen for PWA experience"
echo "  • Use Chrome/Safari for best compatibility"
echo "  • Swipe gestures work great on touch screens!"
echo ""

# Start the development server
npm run dev 