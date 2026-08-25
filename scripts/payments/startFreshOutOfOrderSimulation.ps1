$ErrorActionPreference = 'Stop'

$confirmationText = 'CREATE FRESH OUT OF ORDER SIMULATION'
$keyEnvironmentName = 'LATT_FRESH_OUT_OF_ORDER_KEY'
$confirmationEnvironmentName = 'LATT_FRESH_OUT_OF_ORDER_CONFIRMATION'
$secureKey = $null
$keyPointer = [IntPtr]::Zero

Write-Host ''
Write-Host 'LATT - FRESH OUT-OF-ORDER STRIPE SANDBOX SIMULATION'
Write-Host 'This launcher is runtime-disabled and cannot create Stripe objects.'
Write-Host 'It is locked to learner a54a5e55-482f-4bd2-adc1-d58f2b4f235b and AWS SAA-C03.'
Write-Host 'It will not reuse or modify the stuck Step 009H clock, Customer or Subscription.'
Write-Host ''

$confirmation = Read-Host "Type exactly: $confirmationText"
if ($confirmation -cne $confirmationText) {
  throw 'Fresh out-of-order simulation stopped safely: confirmation did not match.'
}

try {
  $secureKey = Read-Host 'Paste the temporary Stripe rk_test_ restricted key' -AsSecureString
  $keyPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
  $temporaryKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($keyPointer)
  if (-not $temporaryKey.StartsWith('rk_test_')) {
    throw 'Fresh out-of-order simulation stopped safely: a sandbox restricted key is required.'
  }

  [Environment]::SetEnvironmentVariable($keyEnvironmentName, $temporaryKey, 'Process')
  [Environment]::SetEnvironmentVariable($confirmationEnvironmentName, $confirmationText, 'Process')

  & node (Join-Path $PSScriptRoot 'runFreshOutOfOrderSimulation.mjs')
  if ($LASTEXITCODE -ne 0) {
    throw 'Fresh out-of-order simulation runner stopped safely.'
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
