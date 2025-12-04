# Render Deployment Guide for IndiaBorn

## Overview
Deploy both frontend (React/Vite) and backend (.NET API) on Render.

---

## Backend Deployment (.NET API)

### Prerequisites
1. Create a [Render account](https://render.com/signup)
2. Push your code to GitHub

### Step 1: Create Web Service

1. **Go to Render Dashboard:**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "Web Service"

2. **Connect Repository:**
   - Connect your GitHub account
   - Select your `IndiaBorn` repository

3. **Configure Service:**
   - **Name:** `indiaborn-api`
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** `Indiaborn.Api`
   - **Runtime:** `Docker` OR `.NET`

### Step 2: Build Configuration

**If using .NET runtime:**
- **Build Command:**
  ```bash
  dotnet restore && dotnet publish -c Release -o out
  ```
- **Start Command:**
  ```bash
  cd out && dotnet Indiaborn.Api.dll
  ```

**If using Docker:**
- Render will auto-detect `Dockerfile` in `Indiaborn.Api`
- No build/start commands needed

### Step 3: Environment Variables

Add these in Render dashboard:

```
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://0.0.0.0:$PORT

# MongoDB
MongoSettings__ConnectionString=your_mongodb_connection_string
MongoSettings__DatabaseName=IndiabornDb

# JWT
JwtSettings__Secret=your_super_secret_jwt_key_minimum_32_chars
JwtSettings__Issuer=https://your-api.onrender.com
JwtSettings__Audience=https://your-frontend.onrender.com
JwtSettings__ExpirationMinutes=60

# Stripe
StripeSettings__SecretKey=your_stripe_secret_key
StripeSettings__PublishableKey=your_stripe_publishable_key

# Notification (Optional)
NotificationSettings__EmailFrom=noreply@indiaborn.com
NotificationSettings__SmtpHost=smtp.gmail.com
NotificationSettings__SmtpPort=587
NotificationSettings__SmtpUsername=your_email
NotificationSettings__SmtpPassword=your_app_password
```

### Step 4: Advanced Settings

- **Auto-Deploy:** Enable (deploys on every push)
- **Health Check Path:** `/api/config/health` (or create one)
- **Instance Type:** Free tier or Starter ($7/month)

### Step 5: Deploy

- Click "Create Web Service"
- Wait 5-10 minutes for deployment
- Your API URL: `https://indiaborn-api.onrender.com`

---

## Frontend Deployment (React/Vite)

### Step 1: Create Static Site

1. **Go to Render Dashboard:**
   - Click "New +" → "Static Site"

2. **Connect Repository:**
   - Select your `IndiaBorn` repository

3. **Configure Static Site:**
   - **Name:** `indiaborn-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

### Step 2: Environment Variables

```
VITE_API_URL=https://indiaborn-api.onrender.com
```

### Step 3: Redirects/Rewrites

Render should auto-detect SPA routing, but verify:
- All routes should redirect to `index.html`

### Step 4: Deploy

- Click "Create Static Site"
- Wait 3-5 minutes
- Your frontend URL: `https://indiaborn-frontend.onrender.com`

---

## Post-Deployment Configuration

### Update Backend CORS

After deploying frontend, update backend CORS in `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "https://indiaborn-frontend.onrender.com", // Add your Render URL
            "https://your-custom-domain.com" // If using custom domain
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});
```

### Update Frontend API URL

Already configured via `VITE_API_URL` environment variable.

---

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended)

1. Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist Render IPs or use `0.0.0.0/0` (allow all)
4. Get connection string
5. Add to Render environment variables

### Option 2: Render MongoDB (if available)

Check if Render offers MongoDB add-ons in your region.

---

## Custom Domain (Optional)

### For Backend API:
1. Go to API service settings
2. Click "Custom Domain"
3. Add domain: `api.yourdomain.com`
4. Configure DNS with provided CNAME

### For Frontend:
1. Go to Static Site settings
2. Click "Custom Domain"
3. Add domain: `www.yourdomain.com` or `yourdomain.com`
4. Configure DNS with provided CNAME

---

## Deployment Commands (Git)

```bash
# Commit changes
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

Render auto-deploys on every push to `main` branch.

---

## Monitoring & Logs

### View Logs:
- Dashboard → Your Service → "Logs" tab
- Real-time logs during deployment and runtime

### Metrics:
- Dashboard → Your Service → "Metrics" tab
- CPU, Memory, Network usage

---

## Troubleshooting

### Backend Issues

**Build Fails:**
- Check .NET version matches locally
- Verify `Indiaborn.Api.csproj` has correct dependencies
- Check build logs for missing packages

**Runtime Errors:**
- Check environment variables are set
- Verify MongoDB connection string
- Check logs for specific errors

**Port Issues:**
- Backend must bind to `$PORT` environment variable
- Verify `ASPNETCORE_URLS=http://0.0.0.0:$PORT`

### Frontend Issues

**Build Fails:**
- Test locally: `npm run build`
- Check `package.json` dependencies
- Verify Node version

**API Connection Fails:**
- Verify `VITE_API_URL` is correct
- Check backend CORS settings
- Test API endpoint directly

**Routing Issues:**
- Verify Render redirects all routes to `index.html`
- React Router handles client-side routing

---

## Free Tier Limitations

**Render Free Tier:**
- Backend: Spins down after 15 minutes of inactivity
- First request after spin-down takes ~30-60 seconds
- 750 hours/month free
- 500 MB RAM
- Static sites: Always active (no spin-down)

**Upgrade to Starter ($7/month) for:**
- Always-on instances
- More RAM/CPU
- Faster builds
- Better performance

---

## Production Checklist

Before going live:

- [ ] MongoDB connection string configured
- [ ] JWT secret key set (strong, secure)
- [ ] Stripe keys configured (production keys)
- [ ] CORS updated with frontend URL
- [ ] Environment set to Production
- [ ] Custom domain configured (optional)
- [ ] SSL/HTTPS enabled (automatic with Render)
- [ ] Health checks working
- [ ] Logs monitored
- [ ] Email notifications configured (optional)

---

## Quick Reference

### Backend Service
- **Type:** Web Service
- **Runtime:** Docker or .NET 9.0
- **Port:** Auto-assigned via `$PORT`
- **Health Check:** `/api/config/health`

### Frontend Service
- **Type:** Static Site
- **Build:** `npm install && npm run build`
- **Publish:** `dist`
- **SPA:** Redirect all to `index.html`

### Environment Variables
- Backend: 10+ variables (MongoDB, JWT, Stripe, etc.)
- Frontend: 1 variable (`VITE_API_URL`)

---

## Support & Resources

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- [Render Status](https://status.render.com)
- [Contact Support](https://render.com/support)

---

## Deployment Workflow

1. **Development:** Work locally with localhost
2. **Commit:** Push changes to GitHub
3. **Auto-Deploy:** Render builds and deploys automatically
4. **Monitor:** Check logs and metrics
5. **Test:** Verify functionality on live URLs
6. **Iterate:** Make changes, push, repeat

---

## Cost Estimate

**Free Tier (Good for testing):**
- Backend: Free (with spin-down)
- Frontend: Free (always active)
- MongoDB Atlas: Free (512 MB)
- **Total: $0/month**

**Starter Tier (Production ready):**
- Backend: $7/month (always-on)
- Frontend: Free (always active)
- MongoDB Atlas: Free or $9/month (2 GB)
- **Total: $7-16/month**

---

## Next Steps

1. Create Render account
2. Connect GitHub repository
3. Deploy backend API first
4. Deploy frontend static site
5. Test end-to-end functionality
6. Configure custom domain (optional)
7. Monitor and optimize
