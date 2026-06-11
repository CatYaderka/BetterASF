#define MyAppName "BetterASF"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "CatYaderka"
#define MyAppExeName "BetterASF.exe"

[Setup]
AppId={{B7E2A4C1-9F3D-4E55-9A21-ASFDESKTOP001}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\BetterASF
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
; Install into Program Files -> needs admin
PrivilegesRequired=admin
OutputDir=Output
OutputBaseFilename=BetterASF-Setup
Compression=lzma2/max
SolidCompression=yes
WizardStyle=modern
SetupIconFile=icon.ico
UninstallDisplayIcon={app}\{#MyAppExeName}
; Modern look
DisableWelcomePage=no
ShowLanguageDialog=auto

[Languages]
Name: "russian"; MessagesFile: "compiler:Languages\Russian.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: checkedonce

[Files]
; Main executable (single-file build, ASF & UI embedded inside).
Source: "dist\BetterASF.exe"; DestDir: "{app}"; Flags: ignoreversion
; Icon for shortcuts.
Source: "icon.ico"; DestDir: "{app}"; Flags: ignoreversion
; Marker that tells the app it is INSTALLED (so it uses Documents for data).

[Dirs]
; Pre-create the writable data folder in the user's Documents.
Name: "{userdocs}\BetterASF"; Flags: uninsneveruninstall
Name: "{userdocs}\BetterASF\config"; Flags: uninsneveruninstall

[Icons]
; Start Menu
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\icon.ico"
Name: "{group}\Папка с аккаунтами"; Filename: "{userdocs}\BetterASF"
Name: "{group}\Удалить {#MyAppName}"; Filename: "{uninstallexe}"
; Desktop (optional task)
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\icon.ico"; Tasks: desktopicon

[Run]
; Offer to launch after install.
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#MyAppName}}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
; Remove only the app folder; user data in Documents is kept by default.
Type: filesandordirs; Name: "{app}"

[Messages]
russian.WelcomeLabel2=Программа установит [name/ver] на ваш компьютер.%n%nАккаунты и рабочие файлы ASF будут храниться в папке «Документы\ASF-Desktop», чтобы не требовались права администратора и данные переживали обновления.
