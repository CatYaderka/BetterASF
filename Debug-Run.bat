@echo off
setlocal
title ASF Desktop - DEBUG
cd /d "%~dp0"

REM ===============================================================
REM  Diagnostic launch: keeps console open and writes a log file.
REM  Use this if the window hangs or the theme is not applied.
REM  Send the contents of debug-log.txt for support.
REM ===============================================================

where python >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Python not found. Install Python 3.10+ from python.org
    pause
    exit /b 1
)

echo Installing/updating dependencies...
python -m pip install -r requirements.txt >nul 2>nul

echo.
echo Starting ASF Desktop in debug mode...
echo (console stays open; log saved to debug-log.txt)
echo.

REM Run with output shown LIVE in the console (so you see where it freezes).
python -u asf_desktop.py

echo.
echo ---------------------------------------------------------------
echo Window closed. Full log saved to debug-log.txt
echo ---------------------------------------------------------------
pause
endlocal
