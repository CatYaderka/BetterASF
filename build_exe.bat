@echo off
setlocal enabledelayedexpansion
title Build BetterASF (ASF downloads automatically)
cd /d "%~dp0"

where python >nul 2>nul
if errorlevel 1 goto NOPYTHON

echo [1/4] Installing dependencies...
python -m pip install --upgrade pip
python -m pip install -r requirements.txt pyinstaller pillow ziglang
if errorlevel 1 goto FAILDEPS
if exist "_asf\ArchiSteamFarm.exe" goto HAVEASF
echo [2/4] ASF is not bundled. BetterASF will download the official Windows ASF build on first launch.
goto BUILD

:HAVEASF
echo [2/4] Optional embedded ASF found in _asf. Writing version marker...
for /f "delims=" %%v in ('python -c "import os,time; print(time.strftime('%%Y%%m%%d%%H%%M%%S', time.localtime(os.path.getmtime(r'_asf\ArchiSteamFarm.exe'))))"') do set ASFVER=%%v
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
echo     OneDrive\Documents\BetterASF\      (priority path when OneDrive Documents exists)
echo     Documents\BetterASF\               (used when OneDrive Documents is unavailable)
echo     config\                              (accounts - keep/backup this folder)
echo     ASF-runtime\                         (ASF runtime, downloaded and managed automatically)
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
