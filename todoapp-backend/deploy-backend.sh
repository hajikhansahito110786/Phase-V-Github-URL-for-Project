#!/bin/bash

cd /root/todoapp-backend

echo "🚀 Deploying Backend to http://148.230.88.136:8840"
echo "================================================"

# Install Python if not installed
if ! command -v python3 &> /dev/null; then
    echo "📦 Installing Python..."
    apt update && apt install -y python3 python3-pip python3-venv
fi

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Stop existing process
echo "🛑 Stopping existing backend process..."
pkill -f "uvicorn app.main:app" || true

# Start backend
echo "▶️  Starting backend server..."
nohup uvicorn app.main:app --host 0.0.0.0 --port 8840 --reload > backend.log 2>&1 &

sleep 3
if pgrep -f "uvicorn app.main:app" > /dev/null; then
    echo "✅ Backend started successfully on http://148.230.88.136:8840"
    echo "📝 Logs: tail -f backend.log"
else
    echo "❌ Backend failed to start. Check backend.log"
    cat backend.log
fi
