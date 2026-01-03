# PowerShell script to create GitHub repository and push code
# Requires GitHub CLI (gh) or manual creation

Write-Host "🚀 Setting up GitHub repository for Kin website..." -ForegroundColor Green

# Check if GitHub CLI is available
$ghAvailable = Get-Command gh -ErrorAction SilentlyContinue

if (-not $ghAvailable) {
    Write-Host "`n⚠️  GitHub CLI (gh) not found." -ForegroundColor Yellow
    Write-Host "`nOption 1: Install GitHub CLI" -ForegroundColor Cyan
    Write-Host "  winget install --id GitHub.cli" -ForegroundColor Gray
    Write-Host "  Then run: gh auth login" -ForegroundColor Gray
    
    Write-Host "`nOption 2: Create repository manually" -ForegroundColor Cyan
    Write-Host "  1. Go to: https://github.com/new" -ForegroundColor Gray
    Write-Host "  2. Repository name: yourkinapp" -ForegroundColor Gray
    Write-Host "  3. Make it Public" -ForegroundColor Gray
    Write-Host "  4. Don't initialize with anything" -ForegroundColor Gray
    Write-Host "  5. Click Create repository" -ForegroundColor Gray
    Write-Host "`nThen run these commands:" -ForegroundColor Yellow
    Write-Host "  git remote add origin https://github.com/YOUR_USERNAME/yourkinapp.git" -ForegroundColor Gray
    Write-Host "  git push -u origin main" -ForegroundColor Gray
    exit
}

# Check if authenticated
Write-Host "`nChecking GitHub authentication..." -ForegroundColor Cyan
$authStatus = gh auth status 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n⚠️  Not authenticated with GitHub." -ForegroundColor Yellow
    Write-Host "Run: gh auth login" -ForegroundColor Yellow
    exit
}

# Create repository
Write-Host "`nCreating GitHub repository 'yourkinapp'..." -ForegroundColor Cyan
gh repo create yourkinapp --public --source=. --remote=origin --push

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Repository created and code pushed!" -ForegroundColor Green
    Write-Host "`n📱 Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Go to: https://github.com/YOUR_USERNAME/yourkinapp/settings/pages" -ForegroundColor Gray
    Write-Host "  2. Source: Deploy from a branch" -ForegroundColor Gray
    Write-Host "  3. Branch: main / (root)" -ForegroundColor Gray
    Write-Host "  4. Save" -ForegroundColor Gray
    Write-Host "`nYour site will be live at: https://YOUR_USERNAME.github.io/yourkinapp" -ForegroundColor Green
} else {
    Write-Host "`n❌ Failed to create repository. Please create manually." -ForegroundColor Red
}

