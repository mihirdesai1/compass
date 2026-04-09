Write-Host "Starting Phase 1: Core Engine..." -ForegroundColor Cyan

$env:OLLAMA_API_BASE="http://localhost:11434"

while($true) {
    aider src/lib/questions.ts src/app/api/test/complete/route.ts --model ollama/qwen2.5-coder:7b --message-file autonomous_constitution.md --yes --auto-commit --no-show-model-warnings
    
    $time = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$time] Cycle complete. Cooling down for 60 seconds..." -ForegroundColor Yellow
    Start-Sleep -Seconds 60
}
