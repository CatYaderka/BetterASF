import os
import shutil
import struct
import subprocess
import sys
import tarfile
import tempfile
import time
from pathlib import Path
import PyInstaller
from PyInstaller.utils.hooks import collect_data_files, collect_dynamic_libs


def _ensure_custom_zig_bootloader():
    if os.name != 'nt':
        return
    target_map = {
        'Windows-64bit-intel': 'x86_64-windows-gnu',
        'Windows-64bit-arm': 'aarch64-windows-gnu',
        'Windows-32bit-intel': 'x86-windows-gnu',
    }
    zig_target = target_map.get(PyInstaller.PLATFORM)
    if not zig_target:
        return
    try:
        import ziglang
    except Exception:
        print('[spec] ziglang is not installed -> keeping current bootloader.')
        return
    bl_dest_dir = Path(PyInstaller.HOMEPATH) / 'PyInstaller' / 'bootloader' / PyInstaller.PLATFORM
    target_runw = bl_dest_dir / 'runw.exe'
    marker = bl_dest_dir / 'betterasf_zig_bl.ok'
    stamp = f'{PyInstaller.__version__}:{getattr(ziglang, "__version__", "zig")}'
    if marker.is_file() and target_runw.is_file():
        try:
            if marker.read_text(encoding='utf-8').strip() == stamp:
                print('[spec] Custom Zig/LLVM bootloader is already active.')
                return
        except Exception:
            pass
    try:
        print('[spec] Compiling clean custom bootloader with Zig/LLVM...')
        with tempfile.TemporaryDirectory(prefix='betterasf_bl_') as td:
            td_path = Path(td)
            subprocess.run(
                [
                    sys.executable,
                    '-m',
                    'pip',
                    'download',
                    '--no-deps',
                    '--no-binary',
                    'pyinstaller',
                    '-d',
                    str(td_path),
                    f'pyinstaller=={PyInstaller.__version__}',
                ],
                check=True,
            )
            archive = next(td_path.glob('pyinstaller-*.tar.gz'))
            with tarfile.open(archive, 'r:gz') as tf:
                tf.extractall(td_path)
            bl_src = next(td_path.glob('pyinstaller-*/bootloader'))
            c_files = sorted(str(p) for p in (bl_src / 'zlib').glob('*.c')) + sorted(
                str(p) for p in (bl_src / 'src').glob('*.c')
            )
            built_runw = td_path / 'runw_custom.exe'
            cmd = [
                sys.executable,
                '-m',
                'ziglang',
                'cc',
                '-target',
                zig_target,
                '-O3',
                '-ffunction-sections',
                '-fdata-sections',
                '-mms-bitfields',
                '-municode',
                '-DWIN32',
                '-D_CRT_NONSTDC_NO_WARNINGS',
                '-D_CRT_SECURE_NO_WARNINGS',
                '-DHAVE_STDBOOL_H=1',
                '-DHAVE_WCSDUP=1',
                '-DNDEBUG',
                '-DWINDOWED',
                '-Wno-unused-variable',
                '-Wno-unused-function',
                f'-I{bl_src / "src"}',
                f'-I{bl_src / "zlib"}',
                *c_files,
                '-Wl,--gc-sections',
                '-Wl,--stack,2000000',
                '-Wl,--subsystem,windows',
                '-s',
                '-luser32',
                '-lcomctl32',
                '-lkernel32',
                '-ladvapi32',
                '-lgdi32',
                '-o',
                str(built_runw),
            ]
            subprocess.run(cmd, check=True)
            if not built_runw.is_file() or built_runw.stat().st_size < 50000 or built_runw.read_bytes()[:2] != b'MZ':
                raise RuntimeError('Compiled bootloader failed validation.')
            backup = bl_dest_dir / 'runw.stock.bak'
            if target_runw.is_file() and not backup.is_file():
                shutil.copyfile(target_runw, backup)
            shutil.copyfile(built_runw, target_runw)
            marker.write_text(stamp, encoding='utf-8')
            print(f'[spec] Custom Zig/LLVM bootloader installed ({built_runw.stat().st_size} bytes).')
    except Exception as exc:
        print(f'[spec] Custom bootloader build skipped: {exc}')


_ensure_custom_zig_bootloader()

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
    print('[spec] _asf folder not found -> BetterASF will download official ASF on first launch.')

datas += collect_data_files('webview', subdir='lib')
datas += collect_data_files('webview', subdir='js')
binaries = collect_dynamic_libs('webview')

hiddenimports = [
    'webview',
    'webview.platforms.winforms',
    'webview.platforms.win32',
    'webview.platforms.edgechromium',
    'clr',
    'pythonnet',
    'clr_loader',
    'pystray',
    'pystray._win32',
    'PIL',
    'PIL.Image',
    'PIL.ImageDraw',
    'PIL.IcoImagePlugin',
    'PIL.PngImagePlugin',
    'PIL.BmpImagePlugin',
]

icon_path = 'icon.ico' if os.path.exists('icon.ico') else None

version_info = None
try:
    from PyInstaller.utils.win32.versioninfo import (
        VSVersionInfo,
        FixedFileInfo,
        StringFileInfo,
        StringTable,
        StringStruct,
        VarFileInfo,
        VarStruct,
    )
    version_info = VSVersionInfo(
        ffi=FixedFileInfo(
            filevers=(3, 0, 0, 0),
            prodvers=(3, 0, 0, 0),
            mask=0x3F,
            flags=0x0,
            OS=0x40004,
            fileType=0x1,
            subtype=0x0,
            date=(0, 0),
        ),
        kids=[
            StringFileInfo([
                StringTable(
                    '040904B0',
                    [
                        StringStruct('CompanyName', 'CatYaderka'),
                        StringStruct('FileDescription', 'BetterASF Desktop Interface for ArchiSteamFarm'),
                        StringStruct('FileVersion', '3.0.0.0'),
                        StringStruct('InternalName', 'BetterASF'),
                        StringStruct('LegalCopyright', 'Copyright (c) CatYaderka. MIT License.'),
                        StringStruct('OriginalFilename', 'BetterASF.exe'),
                        StringStruct('ProductName', 'BetterASF'),
                        StringStruct('ProductVersion', '3.0.0.0'),
                    ],
                )
            ]),
            VarFileInfo([VarStruct('Translation', [1033, 1200])]),
        ],
    )
except Exception:
    version_info = None

a = Analysis(
    ['asf_desktop.py'],
    pathex=[],
    binaries=binaries,
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        'tkinter',
        'unittest',
        'test',
        'pydoc',
        'doctest',
        'xmlrpc',
        'ftplib',
        'telnetlib',
        'imaplib',
        'smtplib',
        'poplib',
        'webview.platforms.android',
        'webview.platforms.cocoa',
        'webview.platforms.gtk',
        'webview.platforms.qt',
        'webview.platforms.cef',
        'webview.platforms.mshtml',
        'pystray._darwin',
        'pystray._gtk',
        'pystray._xorg',
        'pystray._appindicator',
        'pystray._ayatana_appindicator',
        'PIL.EpsImagePlugin',
        'PIL.PdfParser',
        'PIL.SpiderImagePlugin',
        'PIL.ImageTk',
        'PIL.ImageQt',
        'PIL._tkinter_finder',
    ],
    noarchive=False,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='BetterASF',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=icon_path,
    version=version_info,
)

if os.name == 'nt' and os.path.isfile(exe.name):
    import ctypes
    from ctypes import wintypes

    with open(exe.name, 'r+b') as fp:
        fp.seek(0x3C)
        pe_offset = struct.unpack('<I', fp.read(4))[0]
        fp.seek(pe_offset)
        if fp.read(4) == b'PE\x00\x00':
            fp.seek(pe_offset + 8)
            fp.write(struct.pack('<I', int(time.time())))

    imagehlp = ctypes.WinDLL('imagehlp', use_last_error=True)
    imagehlp.MapFileAndCheckSumW.argtypes = [
        wintypes.LPCWSTR,
        ctypes.POINTER(wintypes.DWORD),
        ctypes.POINTER(wintypes.DWORD),
    ]
    imagehlp.MapFileAndCheckSumW.restype = wintypes.DWORD
    header_sum = wintypes.DWORD(0)
    calc_sum = wintypes.DWORD(0)
    if imagehlp.MapFileAndCheckSumW(exe.name, ctypes.byref(header_sum), ctypes.byref(calc_sum)) == 0 and calc_sum.value:
        with open(exe.name, 'r+b') as fp:
            fp.seek(0x3C)
            pe_offset = struct.unpack('<I', fp.read(4))[0]
            fp.seek(pe_offset + 88)
            fp.write(struct.pack('<I', calc_sum.value))
        print(f'[spec] PE header finalized: CheckSum=0x{calc_sum.value:08X}')
