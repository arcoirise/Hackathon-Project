@echo off
rem Double-click to run WildPass on Windows: sets up anything missing, starts the backend
rem (port 8000) and frontend (port 5173) in their own windows, then opens the browser.
rem Close those two windows to stop.
cd /d "%~dp0"

where python >nul 2>nul || (echo Python is not installed: get it from https://www.python.org/downloads/ & pause & exit /b 1)
where npm >nul 2>nul || (echo Node.js is not installed: get it from https://nodejs.org/ & pause & exit /b 1)

if not exist "backend\.venv\Scripts\python.exe" (
  echo Setting up the backend for the first time...
  python -m venv backend\.venv || (pause & exit /b 1)
)
echo Checking backend packages...
backend\.venv\Scripts\python -m pip install -q -r backend\requirements.txt || (pause & exit /b 1)

echo Checking frontend packages...
pushd frontend
call npm install --silent || (popd & pause & exit /b 1)
popd

start "WildPass backend" /D "%~dp0backend" cmd /k ".venv\Scripts\python -m uvicorn main:app --port 8000"
start "WildPass frontend" /D "%~dp0frontend" cmd /k "npm run dev -- --port 5173 --strictPort"

echo Starting... the site will open in your browser.
timeout /t 6 /nobreak >nul
start "" http://localhost:5173
