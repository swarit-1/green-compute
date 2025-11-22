# Green Compute Oracle - Windows Setup Script

Write-Host "🌱 Setting up Green Compute Oracle..." -ForegroundColor Green

# 1. Install Backend Dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Cyan
Set-Location backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Set-Location ..

# 2. Install Frontend Dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location frontend
npm install
Set-Location ..

# 3. Install Agent Dependencies
Write-Host "📦 Installing agent dependencies..." -ForegroundColor Cyan
Set-Location agent
pip install -r requirements.txt
Set-Location ..

# 4. Setup PostgreSQL (Docker)
Write-Host "🗄️  Starting PostgreSQL..." -ForegroundColor Cyan
docker run -d `
  --name green-compute-db `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=changeme `
  -e POSTGRES_DB=green_compute `
  -p 5432:5432 `
  postgres:15

# Wait for DB
Start-Sleep -Seconds 5

# 5. Initialize Database Schema
Write-Host "📊 Initializing database schema..." -ForegroundColor Cyan
Get-Content backend\schema.sql | docker exec -i green-compute-db psql -U postgres -d green_compute

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the system:" -ForegroundColor Yellow
Write-Host "   1. Backend: cd backend && .\venv\Scripts\Activate.ps1 && uvicorn app.main:app --reload"
Write-Host "   2. Frontend: cd frontend && npm run dev"
Write-Host "   3. Agent: cd agent && python agent.py"
Write-Host ""
Write-Host "Or use Docker Compose:" -ForegroundColor Yellow
Write-Host "   cd infra\docker && docker-compose up"
Write-Host ""
