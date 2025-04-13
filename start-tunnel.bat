@echo off
cls
echo Checking if React app is running...
echo.
timeout /t 2 /nobreak > nul

netstat -ano | find ":3000" > nul
if errorlevel 1 (
    echo ERROR: React app is not running on port 3000!
    echo Please start your React app first with 'npm start'
    echo.
    pause
    exit
)

echo React app found on port 3000
echo.
echo Starting tunnel service...
echo IMPORTANT: Keep this window open to maintain the connection
echo.
echo If you see any errors, make sure you've run:
echo ngrok config add-authtoken YOUR_AUTH_TOKEN
echo.
echo Starting ngrok...
echo.
ngrok http 3000
echo.
if errorlevel 1 (
    echo ERROR: ngrok failed to start!
    echo Please make sure you've added your authtoken
    echo.
)
pause 
pause 