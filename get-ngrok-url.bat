@echo off
echo.
echo ===== GETTING NEW NGROK URL =====
echo.
echo 1. Make sure your authtoken is configured:
echo    ngrok config add-authtoken YOUR_AUTHTOKEN
echo.
echo 2. Start ngrok:
echo    ngrok http 3000
echo.
echo 3. Copy the HTTPS URL and use it in Facebook webhook
echo.
echo If ngrok asks for authtoken:
echo - Go to: https://dashboard.ngrok.com/get-started/your-authtoken
echo - Copy your authtoken
echo - Run: ngrok config add-authtoken YOUR_AUTHTOKEN
echo.
ngrok http 3000
pause
