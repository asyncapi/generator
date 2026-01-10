@echo off

:: -------------------------------
:: Check for Administrator rights
:: -------------------------------
net session >nul 2>&1
if %errorlevel% neq 0 (
  echo Requesting administrative privileges...
  call "%~dp0elevate.cmd" "%~f0" %*
  exit /b
)

:: -------------------------------
:: NVM setup
:: -------------------------------
set /P NVM_PATH="Enter the absolute path where the nvm-windows zip file is extracted/copied to: "

set "NVM_HOME=%NVM_PATH%"
set "NVM_SYMLINK=C:\Program Files\nodejs"

:: Set machine-level variables
setx /M NVM_HOME "%NVM_HOME%"
setx /M NVM_SYMLINK "%NVM_SYMLINK%"

:: Save current PATH for debugging
echo PATH=%PATH% > "%NVM_HOME%\PATH.txt"

:: Read existing system PATH
for /f "skip=2 tokens=2,*" %%A in (
  'reg query "HKLM\System\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul'
) do set "SYS_PATH=%%B"

:: Avoid PATH truncation (setx limit ~1024 chars)
setlocal EnableDelayedExpansion
set PATH_LEN=0
set TMP=!SYS_PATH!
:lenloop
if defined TMP (
  set TMP=!TMP:~1!
  set /a PATH_LEN+=1
  goto lenloop
)

if !PATH_LEN! GEQ 900 (
  echo Warning: Existing PATH is very long (!PATH_LEN! chars).
  echo Skipping PATH modification to avoid truncation.
) else (
  setx /M PATH "!SYS_PATH!;%NVM_HOME%;%NVM_SYMLINK%"
)

endlocal

:: Detect system architecture
if exist "%SYSTEMDRIVE%\Program Files (x86)\" (
  set SYS_ARCH=64
) else (
  set SYS_ARCH=32
)

:: Write settings file
(
  echo root: %NVM_HOME%
  echo path: %NVM_SYMLINK%
  echo arch: %SYS_ARCH%
  echo proxy: none
) > "%NVM_HOME%\settings.txt"

notepad "%NVM_HOME%\settings.txt"
@echo on
