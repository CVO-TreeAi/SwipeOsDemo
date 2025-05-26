#!/bin/bash

# SwipeOS Termux One-Command Installer
# Run this script in Termux to install and run SwipeOS
# Usage: curl -sSL https://raw.githubusercontent.com/CVO-TreeAi/SwipeOsTreeAI/main/termux-install-swipeos.sh | bash

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emojis for better UX
ROCKET="🚀"
PACKAGE="📦"
GEAR="⚙️"
PHONE="📱"
CHECK="✅"
FIRE="🔥"
SPARKLES="✨"

echo -e "${PURPLE}${ROCKET} SwipeOS Termux Installer ${ROCKET}${NC}"
echo -e "${CYAN}Installing SwipeOS on your Android device...${NC}"
echo ""

# Function to print status
print_status() {
    echo -e "${BLUE}${1}${NC}"
}

print_success() {
    echo -e "${GREEN}${CHECK} ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  ${1}${NC}"
}

print_error() {
    echo -e "${RED}❌ ${1}${NC}"
}

# Check if we're in Termux
if [ ! -d "/data/data/com.termux" ]; then
    print_error "This script is designed for Termux on Android!"
    print_warning "Please install Termux from F-Droid or Google Play Store first."
    exit 1
fi

print_success "Running in Termux environment"

# Step 1: Update Termux packages
print_status "${PACKAGE} Updating Termux packages..."
pkg update -y && pkg upgrade -y
print_success "Termux packages updated"

# Step 2: Install required packages
print_status "${PACKAGE} Installing Node.js, Git, and build tools..."
pkg install -y nodejs git python make clang
print_success "Dependencies installed"

# Step 3: Verify installations
print_status "${GEAR} Verifying installations..."
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
GIT_VERSION=$(git --version | cut -d' ' -f3)

echo -e "  ${GREEN}Node.js: ${NODE_VERSION}${NC}"
echo -e "  ${GREEN}npm: ${NPM_VERSION}${NC}"
echo -e "  ${GREEN}Git: ${GIT_VERSION}${NC}"

# Step 4: Setup npm global directory (avoid permission issues)
print_status "${GEAR} Configuring npm..."
mkdir -p ~/.npm-global
npm config set prefix ~/.npm-global
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
export PATH=~/.npm-global/bin:$PATH
print_success "npm configured"

# Step 5: Clone SwipeOS repository
print_status "${PACKAGE} Cloning SwipeOS repository..."
cd ~
if [ -d "SwipeOsTreeAI" ]; then
    print_warning "SwipeOsTreeAI directory already exists. Updating..."
    cd SwipeOsTreeAI
    git pull origin main
else
    git clone https://github.com/CVO-TreeAi/SwipeOsTreeAI.git
    cd SwipeOsTreeAI
fi
print_success "Repository cloned/updated"

# Step 6: Install project dependencies
print_status "${PACKAGE} Installing project dependencies..."
npm install
print_success "Dependencies installed"

# Step 7: Create startup script
print_status "${GEAR} Creating startup script..."
cat > ~/start-swipeos.sh << 'EOF'
#!/bin/bash

# SwipeOS Startup Script for Termux
echo "🚀 Starting SwipeOS..."

# Navigate to project directory
cd ~/SwipeOsTreeAI

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Get device IP for network access
DEVICE_IP=$(ip route get 8.8.8.8 | awk '{print $7; exit}' 2>/dev/null || echo "localhost")

echo "🌐 Starting development server..."
echo "📱 Local access: http://localhost:3000"
echo "🌍 Network access: http://$DEVICE_IP:3000"
echo ""
echo "💡 Tips:"
echo "  • Add to home screen for PWA experience"
echo "  • Use Chrome/Firefox for best compatibility"
echo "  • Swipe gestures work great on touch screens!"
echo ""

# Start the development server
npm run dev
EOF

chmod +x ~/start-swipeos.sh
print_success "Startup script created"

# Step 8: Create desktop shortcut script
print_status "${GEAR} Creating quick access commands..."
cat > ~/swipeos-commands.sh << 'EOF'
#!/bin/bash

# SwipeOS Quick Commands
echo "📱 SwipeOS Quick Commands:"
echo ""
echo "1. Start SwipeOS:     ~/start-swipeos.sh"
echo "2. Open in browser:   termux-open-url http://localhost:3000"
echo "3. Update SwipeOS:    cd ~/SwipeOsTreeAI && git pull && npm install"
echo "4. View logs:         cd ~/SwipeOsTreeAI && npm run dev"
echo "5. Stop server:       Ctrl+C"
echo ""
echo "🌐 Network URLs (share with other devices):"
DEVICE_IP=$(ip route get 8.8.8.8 | awk '{print $7; exit}' 2>/dev/null || echo "localhost")
echo "   http://$DEVICE_IP:3000"
echo ""
EOF

chmod +x ~/swipeos-commands.sh
print_success "Quick commands created"

# Step 9: Add aliases to bashrc
print_status "${GEAR} Setting up convenient aliases..."
cat >> ~/.bashrc << 'EOF'

# SwipeOS Aliases
alias swipeos='~/start-swipeos.sh'
alias swipe='~/start-swipeos.sh'
alias swipeos-help='~/swipeos-commands.sh'
alias swipeos-update='cd ~/SwipeOsTreeAI && git pull && npm install'
alias swipeos-open='termux-open-url http://localhost:3000'
EOF

print_success "Aliases added to bashrc"

# Step 10: Test build
print_status "${GEAR} Testing build..."
if npm run build > /dev/null 2>&1; then
    print_success "Build test passed"
else
    print_warning "Build test failed, but app should still work in development mode"
fi

# Step 11: Get device info for network access
DEVICE_IP=$(ip route get 8.8.8.8 | awk '{print $7; exit}' 2>/dev/null || echo "localhost")

# Final success message
echo ""
echo -e "${GREEN}${FIRE}${FIRE}${FIRE} SwipeOS Installation Complete! ${FIRE}${FIRE}${FIRE}${NC}"
echo ""
echo -e "${PURPLE}${SPARKLES} Quick Start:${NC}"
echo -e "  ${CYAN}1. Start SwipeOS:${NC} swipeos"
echo -e "  ${CYAN}2. Open in browser:${NC} swipeos-open"
echo -e "  ${CYAN}3. View help:${NC} swipeos-help"
echo ""
echo -e "${PURPLE}${PHONE} Access URLs:${NC}"
echo -e "  ${GREEN}Local:${NC}   http://localhost:3000"
echo -e "  ${GREEN}Network:${NC} http://$DEVICE_IP:3000"
echo ""
echo -e "${PURPLE}${SPARKLES} Pro Tips:${NC}"
echo -e "  • Run ${CYAN}'source ~/.bashrc'${NC} to activate aliases now"
echo -e "  • Add to home screen for native app experience"
echo -e "  • Works great with touch gestures!"
echo -e "  • Share network URL with other devices on same WiFi"
echo ""
echo -e "${YELLOW}Starting SwipeOS now...${NC}"
echo ""

# Source bashrc to activate aliases
source ~/.bashrc

# Start SwipeOS automatically
~/start-swipeos.sh 