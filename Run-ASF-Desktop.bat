@echo off
setlocal
title ASF Desktop
cd /d "%~dp0"

REM ===============================================================
REM  Launches the ASF interface in a native window (no browser).
REM  Run this ON WINDOWS by double-click.
REM ===============================================================

REM 1) If a built exe exists next to this file, run it.
if exist "BetterASF.exe" (
    start "" "BetterASF.exe"
    goto END
)
if exist "dist\BetterASF.exe" (
    start "" "dist\BetterASF.exe"
    goto END
)

REM 2) Otherwise run via Python (pythonw = no console window).
where pythonw >nul 2>nul
if not errorlevel 1 (
    start "" pythonw "asf_desktop.py"
    goto END
)

where python >nul 2>nul
if not errorlevel 1 (
    python "asf_desktop.py"
    goto END
)

echo Python not found. Install Python 3.10+ or build BetterASF.exe first.
pause

:END
endlocal
