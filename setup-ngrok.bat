@echo off
echo.
echo ===== NGROK SETUP INSTRUCTIONS =====
echo.
echo 1. Go to: https://dashboard.ngrok.com/signup
echo 2. Create a FREE account
echo 3. Go to: https://dashboard.ngrok.com/get-started/your-authtoken
echo 4. Copy your authtoken
echo 5. Run: ngrok config add-authtoken YOUR_AUTHTOKEN
echo 6. Then run: .\start-ngrok.bat
echo.
echo After setup, you'll get a URL like: https://abc123.ngrok-free.app
echo Use that URL in Facebook Developer Console webhook
echo.
pause
