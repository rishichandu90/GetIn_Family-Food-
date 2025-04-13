@echo off
echo Starting ngrok tunnel...
echo Please wait while the tunnel is established...
echo.
echo Note: Keep this window open to maintain the tunnel
echo.
ngrok http 3002 --log=stdout
echo.
echo If the window closes immediately, press any key to see the error
pause 