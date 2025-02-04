# check_and_start_server.ps1
$port = 5000
$projectPath = "G:\Delte disker\Development\Prosjekter\settlers2\area_planner"
$serverBatch = Join-Path $projectPath "start_server.bat"

# Logging function
function Write-Log {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message"
}

Write-Log "Starting server check script"

# Check if server is running
$serverRunning = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if (-not $serverRunning) {
    Write-Log "Server not running. Attempting to start..."
    
    # Start server in a new dedicated console window
    Start-Process cmd.exe -ArgumentList "/c", $serverBatch -WorkingDirectory $projectPath -WindowStyle Normal
    
    # Wait for server to start (max 30 seconds)
    $timeout = 30
    $started = $false
    for ($i = 0; $i -lt $timeout; $i++) {
        try {
            Write-Log "Checking server status (attempt $i)..."
            $response = Invoke-WebRequest "http://localhost:$port" -TimeoutSec 5
            if ($response.StatusCode -eq 200) {
                $started = $true
                Write-Log "Server started successfully!"
                break
            }
        }
        catch {
            Write-Log "Server not ready yet. Waiting..."
            Start-Sleep -Seconds 1
        }
    }

    if (-not $started) {
        Write-Log "Server failed to start within $timeout seconds"
        exit 1
    }
}
else {
    Write-Log "Server already running"
}

# Open browser
Write-Log "Opening browser..."
Start-Process "http://localhost:$port"
