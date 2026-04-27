$ErrorActionPreference = "Stop"

$uri = "https://ct.unykorn.org"

try {
    $response = Invoke-WebRequest -Uri $uri -Method Head -UseBasicParsing
    $statusCode = [int]$response.StatusCode
} catch {
    if ($_.Exception.Response) {
        $statusCode = [int]$_.Exception.Response.StatusCode
    } else {
        Write-Host "[CT] Live verification failed: $($_.Exception.Message)"
        exit 1
    }
}

Write-Host "[CT] $uri HTTP status: $statusCode"

if ($statusCode -ne 200) {
    Write-Host "[CT] Expected HTTP 200 from $uri"
    exit 1
}

Write-Host "[CT] Live Phase 6 verification passed"