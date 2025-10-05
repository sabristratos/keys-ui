$file = 'C:\Work\keys\packages\keys-ui\resources\js\TableActions.ts'
$content = Get-Content $file -Raw

# Remove the classList.add line
$content = $content -replace "\s+row\.classList\.add\('table-row-selected'\);`r?`n", ""

# Remove the classList.remove line
$content = $content -replace "\s+row\.classList\.remove\('table-row-selected'\);`r?`n", ""

Set-Content $file -Value $content -NoNewline
Write-Host "Fixed TableActions.ts"
