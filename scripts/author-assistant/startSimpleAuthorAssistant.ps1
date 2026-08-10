$ErrorActionPreference = 'Stop'

$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..'))
$keyWasProvidedByLauncher = $false
$plainKey = $null
$keyPointer = [IntPtr]::Zero
$assistantExitCode = 0
$originalConsoleInputEncoding = [Console]::InputEncoding
$originalConsoleOutputEncoding = [Console]::OutputEncoding
$originalPipelineOutputEncoding = $OutputEncoding

try {
    $utf8WithoutBom = New-Object System.Text.UTF8Encoding($false)
    [Console]::InputEncoding = $utf8WithoutBom
    [Console]::OutputEncoding = $utf8WithoutBom
    $OutputEncoding = $utf8WithoutBom

    if ([string]::IsNullOrWhiteSpace($env:OPENAI_API_KEY)) {
        Write-Host ''
        Write-Host 'AUTHOR ASSISTANT - PRIVATE KEY SETUP' -ForegroundColor Cyan
        Write-Host 'Your key is hidden, used for this run only, and never saved.'
        $secureKey = Read-Host 'Paste your OpenAI API key' -AsSecureString
        $keyPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
        $plainKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($keyPointer)
        if ([string]::IsNullOrWhiteSpace($plainKey)) { throw 'No API key was entered. Nothing was run.' }
        $env:OPENAI_API_KEY = $plainKey
        $keyWasProvidedByLauncher = $true
    }
    if ([string]::IsNullOrWhiteSpace($env:AUTHOR_ASSISTANT_MODEL)) { $env:AUTHOR_ASSISTANT_MODEL = 'gpt-5.6-terra' }
    Push-Location -LiteralPath $projectRoot
    try {
        & node 'scripts\author-assistant\runSimpleAuthorAssistant.mjs'
        if ($LASTEXITCODE -ne 0) { $assistantExitCode = $LASTEXITCODE }
    }
    finally { Pop-Location }
}
catch {
    $assistantExitCode = 1
    Write-Host "Author Assistant stopped safely: $($_.Exception.Message)" -ForegroundColor Yellow
}
finally {
    $plainKey = $null
    if ($keyPointer -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($keyPointer) }
    if ($keyWasProvidedByLauncher) { Remove-Item Env:OPENAI_API_KEY -ErrorAction SilentlyContinue }
    [Console]::InputEncoding = $originalConsoleInputEncoding
    [Console]::OutputEncoding = $originalConsoleOutputEncoding
    $OutputEncoding = $originalPipelineOutputEncoding
}

[Environment]::ExitCode = $assistantExitCode
