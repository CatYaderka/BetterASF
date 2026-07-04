# -*- mode: python ; coding: utf-8 -*-
# PyInstaller spec for BetterASF (onefile, no console).
# UI assets and config.ini are bundled into the executable.
# Build on Windows: pyinstaller asf_desktop.spec

import os
from PyInstaller.utils.hooks import collect_all

block_cipher = None

# pywebview + edgechromium backend (WebView2) require extra data files.
datas = [
    ('ui', 'ui'),
    ('config.ini', '.'),
]
if os.path.exists('icon.ico'):
    datas.append(('icon.ico', '.'))
if os.path.exists('icon_source.png'):
    datas.append(('icon_source.png', '.'))
# Embedded ASF: if the _asf folder exists, it is bundled into the executable
# and extracted to ASF-runtime on first launch.
if os.path.isdir('_asf'):
    datas.append(('_asf', '_asf'))
    print('[spec] Embedded ASF will be bundled (_asf folder found).')
else:
    print('[spec] _asf folder not found -> ASF will not be bundled; ArchiSteamFarm.exe is required nearby.')
binaries = []
hiddenimports = [
    'webview',
    'webview.platforms.edgechromium',
    'clr',          # pythonnet
    'pystray',      # tray icon
    'PIL', 'PIL.Image', 'PIL.ImageDraw',
]

# Collect everything required by pywebview (backends and DLLs).
for pkg in ('webview', 'pystray', 'PIL'):
    d, b, h = collect_all(pkg)
    datas += d
    binaries += b
    hiddenimports += h

icon_path = 'icon.ico' if os.path.exists('icon.ico') else None

a = Analysis(
    ['asf_desktop.py'],
    pathex=[],
    binaries=binaries,
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name="BetterASF",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,          # no console window
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=icon_path,
)
