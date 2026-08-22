$ErrorActionPreference = 'Stop'

$confirmationText = 'PREPARE DISPOSABLE FAILED RENEWAL'
$keyEnvironmentName = 'LATT_DISPOSABLE_STRIPE_FAILURE_KEY'
$confirmationEnvironmentName = 'LATT_DISPOSABLE_STRIPE_FAILURE_CONFIRMATION'
$secureKey = $null
$keyPointer = [IntPtr]::Zero

Write-Host ''
Write-Host 'LATT - DISPOSABLE STRIPE FAILED-RENEWAL PREPARATION'
Write-Host 'This launcher is runtime-disabled and cannot change Stripe objects.'
Write-Host 'It is locked to Customer cus_V7aJjrJFCVjm5I.'
Write-Host 'It is locked to Subscription sub_1U7LH93Ne8JYQdqLKUFDoY7s.'
Write-Host 'It can attach only pm_card_chargeCustomerFail and update only that Subscription.'
Write-Host ''

$confirmation = Read-Host "Type exactly: $confirmationText"
if ($confirmation -cne $confirmationText) {
  throw 'Disposable failed-renewal preparation stopped safely: confirmation did not match.'
}

try {
  $secureKey = Read-Host 'Paste the temporary Stripe rk_test_ restricted key' -AsSecureString
  $keyPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
  $temporaryKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($keyPointer)
  if (-not $temporaryKey.StartsWith('rk_test_')) {
    throw 'Disposable failed-renewal preparation stopped safely: a sandbox restricted key is required.'
  }

  [Environment]::SetEnvironmentVariable($keyEnvironmentName, $temporaryKey, 'Process')
  [Environment]::SetEnvironmentVariable($confirmationEnvironmentName, $confirmationText, 'Process')

  & node (Join-Path $PSScriptRoot 'runDisposableFailedRenewalPreparation.mjs')
  if ($LASTEXITCODE -ne 0) {
    throw 'Disposable failed-renewal preparation runner stopped safely.'
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
