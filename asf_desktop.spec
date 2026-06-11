# -*- mode: python ; coding: utf-8 -*-
# PyInstaller spec для ASF Desktop (onefile, без консоли).
# Тема (assets) и config.ini вшиваются внутрь exe.
# Сборка:  pyinstaller asf_desktop.spec   (на Windows)

import os
from PyInstaller.utils.hooks import collect_all

block_cipher = None

# pywebview + edgechromium backend (WebView2) тянут доп. данные.
datas = [
    ('ui', 'ui'),
    ('config.ini', '.'),
]
# Встроенный ASF: если рядом есть папка _asf (положите туда содержимое ASF),
# она будет вшита в .exe и распакована при первом запуске в ASF-runtime/.
if os.path.isdir('_asf'):
    datas.append(('_asf', '_asf'))
    print('[spec] Встроенный ASF будет вшит в .exe (папка _asf найдена).')
else:
    print('[spec] Папка _asf не найдена -> ASF НЕ будет вшит (нужен рядом ArchiSteamFarm.exe).')
binaries = []
hiddenimports = [
    'webview',
    'webview.platforms.edgechromium',
    'clr',          # pythonnet
]

# Собрать всё, что нужно pywebview (бэкенды, dll'ки).
for pkg in ('webview',):
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
    console=False,          # без чёрной консоли
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=icon_path,
)
