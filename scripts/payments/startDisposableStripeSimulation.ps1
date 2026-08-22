$ErrorActionPreference = 'Stop'

$confirmationText = 'CREATE DISPOSABLE STRIPE SIMULATION'
$keyEnvironmentName = 'LATT_DISPOSABLE_STRIPE_SETUP_KEY'
$confirmationEnvironmentName = 'LATT_DISPOSABLE_STRIPE_CONFIRMATION'
$secureKey = $null
$keyPointer = [IntPtr]::Zero

Write-Host ''
Write-Host 'LATT - DISPOSABLE STRIPE SANDBOX SIMULATION'
Write-Host 'This launcher is runtime-disabled and cannot create Stripe objects.'
Write-Host 'It is locked to learner 8bf0e3bc-bed7-43bf-a4db-e8f788c19852 and AWS SAA-C03.'
Write-Host 'Resume-only boundary: existing Customer cus_V7aJjrJFCVjm5I; no new clock or Customer.'
Write-Host ''

$confirmation = Read-Host "Type exactly: $confirmationText"
if ($confirmation -cne $confirmationText) {
  throw 'Disposable Stripe simulation stopped safely: confirmation did not match.'
}

try {
  $secureKey = Read-Host 'Paste the temporary Stripe rk_test_ restricted key' -AsSecureString
  $keyPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
  $temporaryKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($keyPointer)
  if (-not $temporaryKey.StartsWith('rk_test_')) {
    throw 'Disposable Stripe simulation stopped safely: a sandbox restricted key is required.'
  }

  [Environment]::SetEnvironmentVariable($keyEnvironmentName, $temporaryKey, 'Process')
  [Environment]::SetEnvironmentVariable($confirmationEnvironmentName, $confirmationText, 'Process')

  & node (Join-Path $PSScriptRoot 'runDisposableStripeSimulation.mjs')
  if ($LASTEXITCODE -ne 0) {
    throw 'Disposable Stripe simulation runner stopped safely.'
  }
}
finally {
  [Environment]::SetEnvironmentVariable($keyEnvironmentName, $null, 'Process')
  [Environment]::SetEnvironmentVariable($confirmationEnvironmentName, $null, 'Process')
  $temporaryKey = $null
  $confirmation = $null
  if ($keyPointer -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($keyPointer)
  }
  $secureKey = $null
}
