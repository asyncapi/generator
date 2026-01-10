@echo off
powershell -NoProfile -WindowStyle Hidden -Command ^
  "Start-Process -FilePath \"$env:NVM_HOME\bin\nvm.exe\" -ArgumentList \"%*\" -NoNewWindow"
