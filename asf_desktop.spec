




import os
from PyInstaller.utils.hooks import collect_all

block_cipher = None


datas = [
    ('ui', 'ui'),
    ('config.ini', '.'),
]

if os.path.exists('plugin_catalog.json'):
    datas.append(('plugin_catalog.json', '.'))
if os.path.exists('icon.ico'):
    datas.append(('icon.ico', '.'))
if os.path.exists('icon_source.png'):
    datas.append(('icon_source.png', '.'))


if os.path.isdir('_asf'):
    datas.append(('_asf', '_asf'))
    print('[spec] Embedded ASF will be bundled (_asf folder found).')
else:
    print('[spec] _asf folder not found -> ASF will not be bundled; ArchiSteamFarm.exe is required nearby.')
binaries = []
hiddenimports = [
    'webview',
    'webview.platforms.edgechromium',
    'clr',
    'pystray',
    'PIL', 'PIL.Image', 'PIL.ImageDraw',
]


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
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=icon_path,
)
