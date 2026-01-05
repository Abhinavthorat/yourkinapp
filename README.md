# Kin Website

Landing page for Kin.

## Setup for GitHub Pages

1. **Create a new GitHub repository** named `yourkinapp` (or your preferred name)

2. **Push this website directory to the repo:**
   ```bash
   cd website
   git init
   git add .
   git commit -m "Initial commit - Kin website"
   git branch -M main
   git remote add origin https://github.com/yourusername/yourkinapp.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `root`
   - Save

4. **Custom Domain Setup:**
   - The `CNAME` file is already configured for `yourkinapp.com`
   - In GitHub Settings → Pages, add your custom domain
   - Update DNS records:
     - Add A record: `@` → GitHub Pages IPs (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153)
     - Add CNAME record: `www` → `yourusername.github.io`

5. **SSL Certificate:**
   - GitHub automatically provisions SSL for custom domains
   - Wait 24-48 hours for DNS propagation

## Local Development

Simply open `index.html` in a browser or use a local server:

```bash
# Python
python -m http.server 8000

# Node.js
npx serve
```

## Features

- ✅ Modern, clean design
- ✅ Mobile responsive
- ✅ Smooth animations
- ✅ Email signup form (ready for backend integration)

## Customization

- Update colors in `styles.css` (`:root` variables)
- Modify content in `index.html`
- Add analytics in `script.js`

