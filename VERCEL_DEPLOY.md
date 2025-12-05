# Vercel Deployment Guide for IndiaBorn

## Prerequisites
1. Create a [Vercel account](https://vercel.com/signup)
2. Install Vercel CLI: `npm install -g vercel`

## Quick Deploy Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Select "Set up and deploy"
   - Choose your project name
   - Accept the default settings

4. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Add Vercel configuration"
   git push origin main
   ```

2. **Import Project on Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Choose the `frontend` folder as the root directory

3. **Configure Build Settings:**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Environment Variables (if needed):**
   - Add `VITE_API_URL` with your backend API URL
   - Example: `https://your-backend-api.com`

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

## Environment Variables

If your backend API is deployed separately, set:

```
VITE_API_URL=https://your-backend-api-url.com
```

## Custom Domain (Optional)

1. Go to your project settings on Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request

## Local Testing Before Deploy

Test the production build locally:
```bash
npm run build
npm run preview
```

## Vercel Configuration Files

- `vercel.json` - Already configured with routing rules
- `.vercelignore` - Specifies files to exclude from deployment

## Troubleshooting

### Build Fails
- Check build logs on Vercel dashboard
- Ensure all dependencies are in `package.json`
- Test build locally: `npm run build`

### API Connection Issues
- Verify `VITE_API_URL` environment variable
- Check CORS settings on your backend
- Ensure backend accepts requests from Vercel domain

### Routing Issues
- `vercel.json` handles SPA routing
- All routes redirect to `index.html`
- React Router handles client-side routing

## Post-Deployment

After deployment, you'll get:
- **Production URL**: `https://your-project.vercel.app`
- **Preview URLs**: For each commit/PR
- **Analytics**: Available in Vercel dashboard

## Quick Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls
```

## Notes

- Frontend is configured as a static site
- Backend API should be deployed separately (Railway, Render, etc.)
- Update `VITE_API_URL` to point to your deployed backend
- SSL/HTTPS is automatic with Vercel
