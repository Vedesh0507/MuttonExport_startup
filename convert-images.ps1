Write-Host "Starting image conversion..."

$extensions = "*.jpg","*.jpeg","*.png"

foreach ($ext in $extensions) {
    Get-ChildItem -Recurse -Filter $ext | ForEach-Object {

        $inputPath = $_.FullName
        $output = [System.IO.Path]::ChangeExtension($inputPath, "webp")

        if (Test-Path $output) {
            return
        }

        Write-Host "Converting $inputPath"

        magick "$inputPath" -quality 82 "$output"

        if ($LASTEXITCODE -eq 0) {
            Write-Host "Converted successfully"
        } else {
            Write-Host "Failed to convert"
        }
    }
}

Write-Host "Image conversion completed."
