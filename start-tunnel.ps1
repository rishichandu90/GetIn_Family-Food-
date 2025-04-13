Write-Host "Starting ngrok tunnel..." -ForegroundColor Green
Write-Host "IMPORTANT: Keep this window open to maintain the connection" -ForegroundColor Yellow
Write-Host ""

try {
    ngrok http 3000
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure you've added your authtoken from ngrok dashboard" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown') 