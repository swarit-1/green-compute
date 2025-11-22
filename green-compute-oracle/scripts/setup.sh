#!/bin/bash

# Green Compute Oracle - Complete Setup Script

echo "🌱 Setting up Green Compute Oracle..."

# 1. Install Backend Dependencies
echo "📦 Installing backend dependencies..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# 2. Install Frontend Dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# 3. Install Agent Dependencies
echo "📦 Installing agent dependencies..."
cd agent
pip install -r requirements.txt
cd ..

# 4. Setup PostgreSQL (Docker)
echo "🗄️  Starting PostgreSQL..."
docker run -d \
  --name green-compute-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=changeme \
  -e POSTGRES_DB=green_compute \
  -p 5432:5432 \
  postgres:15

# Wait for DB
sleep 5

# 5. Initialize Database Schema
echo "📊 Initializing database schema..."
docker exec -i green-compute-db psql -U postgres -d green_compute < backend/schema.sql

# 6. Start Backend
echo "🚀 Starting backend..."
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# 7. Start Frontend
echo "🎨 Starting frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# 8. Start Agent (simulation mode)
echo "🤖 Starting telemetry agent..."
cd agent
python agent.py &
AGENT_PID=$!
cd ..

echo ""
echo "✅ Green Compute Oracle is running!"
echo ""
echo "📍 Services:"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo "   Frontend: http://localhost:3000"
echo ""
echo "To stop all services:"
echo "   kill $BACKEND_PID $FRONTEND_PID $AGENT_PID"
echo "   docker stop green-compute-db"
echo ""
