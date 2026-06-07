@echo off
setlocal enabledelayedexpansion

:: Устанавливаем пути
set PROJECT_DIR=%~dp0..

echo ================================================
echo   Building TZ Oscar-Print EXE via Forge
echo ================================================

:: Проверка Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found.
    pause
    exit /b 1
)

cd /d "%PROJECT_DIR%"

:: 1. Установка зависимостей (если их нет)
echo [1/3] Checking dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed.
    pause
    exit /b 1
)

:: 2. Сборка фронтенда и упаковка через Forge
echo [2/3] Building and Packaging...
call npm run make
if %errorlevel% neq 0 (
    echo ERROR: Build or Make failed.
    pause
    exit /b 1
)

echo.
echo ================================================
echo   Done! 
echo   EXE is in: out\make\squirrel.windows\x64\
echo ================================================
pause
endlocal