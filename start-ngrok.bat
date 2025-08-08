@echo off
echo Starting ngrok tunnel for WhatsApp webhook...
echo.
echo Server should be running on port 3000
echo.
ngrok http 3000
pause
