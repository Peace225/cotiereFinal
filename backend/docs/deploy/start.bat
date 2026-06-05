@echo off
echo Démarrage de CÔTIÈRE Platform...
cd /d "%~dp0"
start "ngrok" cmd /k "C:\Users\abdou\AppData\Roaming\npm\ngrok http --domain=size-matador-savior.ngrok-free.dev 3000"
timeout /t 2
npm run dev
