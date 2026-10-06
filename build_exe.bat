@echo off
setlocal enabledelayedexpansion
title Build ASF Desktop (single exe, ASF embedded)
cd /d "%~dp0"

where python >nul 2>nul
if errorlevel 1 goto NOPYTHON

echo [1/4] Installing dependencies...
python -m pip install --upgrade pip
python -m pip install -r requirements.txt pyinstaller pillow
if errorlevel 1 goto FAILDEPS
if exist "_asf\ArchiSteamFarm.exe" goto HAVEASF
echo.
echo [i] Folder "_asf" with ArchiSteamFarm.exe was NOT found.
echo     To EMBED ASF into the single exe:
echo       1) Download ASF (the OS build, e.g. ASF-win-x64) from:
echo          https://github.com/JustArchiNET/ArchiSteamFarm/releases
echo       2) Put its CONTENTS into a folder named  _asf  next to this script
echo          (so that  _asf\ArchiSteamFarm.exe  exists).
echo       3) Run this script again.
echo.
echo     You can also build WITHOUT embedding (ASF must then sit next to the exe).
choice /m "Continue building WITHOUT embedded ASF"
if errorlevel 2 goto END
goto BUILD

:HAVEASF
echo [2/4] Embedded ASF found in _asf. Writing version marker...
for /f "delims=" %%v in ('powershell -NoProfile -Command "(Get-Item _asf\ArchiSteamFarm.exe).LastWriteTime.ToString('yyyyMMddHHmmss')"') do set ASFVER=%%v
if "!ASFVER!"=="" set ASFVER=1
> "_asf\_asf_version.txt" echo !ASFVER!

:BUILD
if exist "icon.ico" goto HAVEICON
if not exist "icon_source.png" goto HAVEICON
python -c "from PIL import Image; Image.open('icon_source.png').convert('RGBA').save('icon.ico', sizes=[(256,256),(128,128),(64,64),(48,48),(32,32),(16,16)])"
:HAVEICON

echo [3/4] Building single exe...
python -m PyInstaller --noconfirm --clean asf_desktop.spec
if errorlevel 1 goto FAILBUILD

echo [4/4] Done.
echo.
echo   Result:  dist\BetterASF.exe
echo.
echo   Run dist\BetterASF.exe once to install it to Program Files\BetterASF.
echo   Desktop and Start Menu shortcuts are created automatically.
echo.
echo   User data is kept outside the executable in:
echo     Documents\BetterASF\config\       (accounts - keep/backup this folder)
echo     Documents\BetterASF\ASF-runtime\  (ASF runtime, managed automatically)
echo.
echo   There is no separate installer. Publish the single dist\BetterASF.exe file.
pause
goto END

:NOPYTHON
echo [ERROR] Python not found. Install Python 3.10+ from python.org
pause
goto END
:FAILDEPS
echo [ERROR] Failed to install dependencies.
pause
goto END
:FAILBUILD
echo [ERROR] Build failed. See messages above.
pause
goto END
:END
endlocal
