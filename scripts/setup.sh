#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== WhatsApp UserBot Setup Wizard ===${NC}"

# 1. Check Prerequisites
echo -e "\n${YELLOW}Step 1: Checking Prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js v18+ first.${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Node.js found: $(node -v)${NC}"
fi

# Check FFmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${YELLOW}⚠️  FFmpeg is not installed.${NC}"
    echo -e "   Sticker commands will NOT work."
    echo -e "   Please install it using your package manager (e.g., 'brew install ffmpeg', 'sudo apt install ffmpeg')."
    # We don't exit here, just warn
else
    echo -e "${GREEN}✅ FFmpeg found.${NC}"
fi

# 2. Setup Configuration
echo -e "\n${YELLOW}Step 2: Configuration (.env)${NC}"

if [ -f .env ]; then
    echo -e "A .env file already exists. Skipping creation."
else
    echo -e "Creating .env file from template..."
    cp .env.example .env

    echo -e "\n${YELLOW}Please verify your settings:${NC}"
    read -p "Enter Bot Prefix (default: .): " PREFIX
    PREFIX=${PREFIX:-.}

    # OS agnostic sed
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/^PREFIX=.*/PREFIX=${PREFIX}/" .env
    else
        sed -i "s/^PREFIX=.*/PREFIX=${PREFIX}/" .env
    fi

    echo -e "${GREEN}✅ .env file created.${NC}"
fi

# 3. Install Dependencies
echo -e "\n${YELLOW}Step 3: Installing Dependencies...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed.${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies.${NC}"
    exit 1
fi

# 4. Build Project
echo -e "\n${YELLOW}Step 4: Building Project...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful.${NC}"
else
    echo -e "${RED}❌ Build failed.${NC}"
    exit 1
fi

echo -e "\n${GREEN}=== Setup Complete! ===${NC}"
echo -e "To start the bot, run: ${YELLOW}npm start${NC}"
echo -e "To run in development mode, run: ${YELLOW}npm run dev${NC} (after setup is complete)"
