#!/bin/bash

# Kernel Project Initialization Script
# This script handles dependency installation for both frontend and backend

echo "🚀 Starting Kernel Project Initialization..."

# Frontend dependencies
echo "📦 Installing Frontend dependencies (this may take a while)..."
cd frontend
npm install
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install lucide-react framer-motion usehooks-ts date-fns zod zustand
npm install rxdb rxjs dexie-encrypted
npm install recharts
npm install @udecode/plate-common @udecode/plate-ui
cd ..

echo "✅ Frontend setup complete."

# Backend dependencies (optional local venv setup)
echo "🐍 Setting up Backend environment..."
cd backend
# Optional: python -m venv venv && source venv/bin/activate && pip install -r requirements.txt
cd ..

echo "✨ Initialization finished! Use 'docker-compose up' to start the system."
