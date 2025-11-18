# Indiaborn™ Website - Free Hosting Guide

This guide will help you deploy your Indiaborn™ e-commerce website to free hosting platforms.

## Prerequisites

1. **GitHub Account** (for code hosting)
2. **MongoDB Atlas Account** (free database)
3. **Hosting Platform Account** (choose one below)

---

## Step 1: Set Up MongoDB Atlas (Free Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account
3. Create a new cluster (Free M0 tier)
4. Create a database user:
   - Username: `indiaborn`
   - Password: (generate a strong password)
5. Whitelist IP: Add `0.0.0.0/0` (allow all IPs) or your hosting platform's IP
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
   - Replace `<password>` with your actual password

---

## Step 2: Choose a Hosting Platform

### Option A: Railway (Recommended - Easiest)

**Free Tier:** $5 credit/month (enough for small apps)

1. **Sign up:** [railway.app](https://railway.app)
2. **Deploy:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select your repository
   - Railway will auto-detect .NET
3. **Configure Environment Variables:**
   ```
   Mongo__ConnectionString=mongodb+srv://username:password@cluster.mongodb.net/
   Mongo__DatabaseName=IndiabornDb
   Jwt__SigningKey=your-secret-key-here-min-32-characters
   Jwt__Issuer=Indiaborn
   Jwt__Audience=IndiabornUsers
   ```
4. **Get Domain:**
   - Railway provides a free `.railway.app` subdomain
   - Or connect a custom domain (free)

---

### Option B: Render

**Free Tier:** 750 hours/month

1. **Sign up:** [render.com](https://render.com)
2. **Create Web Service:**
   - Connect GitHub repo
   - Build Command: `dotnet publish -c Release -o ./publish`
   - Start Command: `dotnet Indiaborn.Api.dll`
   - Environment: `Docker` or `Native`
3. **Environment Variables:** (same as Railway)
4. **Free Domain:** `.onrender.com` subdomain

---

### Option C: Fly.io

**Free Tier:** 3 shared VMs

1. **Install Fly CLI:**
   ```bash
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```
2. **Sign up:** [fly.io](https://fly.io)
3. **Deploy:**
   ```bash
   fly launch
   fly deploy
   ```
4. **Free Domain:** `.fly.dev` subdomain

---

### Option D: Azure App Service (Free Tier)

**Free Tier:** Limited, but free

1. **Sign up:** [azure.microsoft.com](https://azure.microsoft.com/free/)
2. **Create App Service:**
   - Create Resource → Web App
   - Runtime: .NET 9
   - Free tier (F1)
3. **Deploy from GitHub:**
   - Deployment Center → GitHub
   - Connect repo
4. **Free Domain:** `.azurewebsites.net` subdomain

---

## Step 3: Configure Environment Variables

Set these in your hosting platform's environment variables:

```bash
# MongoDB
Mongo__ConnectionString=mongodb+srv://username:password@cluster.mongodb.net/
Mongo__DatabaseName=IndiabornDb
Mongo__ProductsCollection=products
Mongo__OrdersCollection=orders
Mongo__UsersCollection=users

# JWT (IMPORTANT: Change this!)
Jwt__SigningKey=your-super-secret-key-minimum-32-characters-long
Jwt__Issuer=Indiaborn
Jwt__Audience=IndiabornUsers
Jwt__ExpirationMinutes=120

# Admin Credentials
Admin__Email=admin@indiaborn.com
Admin__Password=ChangeMe123!

# Stripe (Optional - leave empty if not using)
Stripe__ApiKey=
Stripe__PublishableKey=
Stripe__Currency=usd

# Notifications (Optional)
Notifications__Email__SendGridApiKey=
Notifications__WhatsApp__TwilioAccountSid=
Notifications__Phone__TwilioAccountSid=
```

---

## Step 4: Update Configuration for Production

Update `appsettings.json` or use environment variables:

1. **Change JWT Signing Key** (use a strong random key)
2. **Update MongoDB connection string**
3. **Update admin password**
4. **Update URLs** in Stripe settings (if using)

---

## Step 5: Free Domain Options

### Option 1: Free Subdomain from Hosting Platform
- Railway: `your-app.railway.app`
- Render: `your-app.onrender.com`
- Fly.io: `your-app.fly.dev`
- Azure: `your-app.azurewebsites.net`

### Option 2: Free Domain Providers
1. **Freenom** (https://www.freenom.com)
   - Free domains: `.tk`, `.ml`, `.ga`, `.cf`, `.gq`
   - Point to your hosting platform's IP/DNS

2. **No-IP** (https://www.noip.com)
   - Free dynamic DNS
   - Good for testing

3. **Cloudflare** (https://www.cloudflare.com)
   - Free DNS management
   - Connect your domain

---

## Step 6: Deploy Your Code

### Using GitHub (Recommended):

1. **Initialize Git** (if not done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository:**
   - Go to GitHub.com
   - Create new repository
   - Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/indiaborn.git
   git push -u origin main
   ```

3. **Connect to Hosting Platform:**
   - Most platforms auto-deploy from GitHub
   - Push changes = automatic deployment

---

## Step 7: Post-Deployment Checklist

- [ ] MongoDB connection working
- [ ] Admin login works (`admin@indiaborn.com` / `ChangeMe123!`)
- [ ] Products display on homepage
- [ ] Image upload works in admin panel
- [ ] HTTPS enabled (most platforms do this automatically)
- [ ] Custom domain configured (if using)

---

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Failed:**
   - Check IP whitelist in MongoDB Atlas
   - Verify connection string format
   - Ensure password is URL-encoded

2. **Build Fails:**
   - Check .NET version (should be 9.0)
   - Verify all NuGet packages are restored

3. **Environment Variables Not Working:**
   - Use double underscore `__` for nested settings
   - Restart the application after adding variables

4. **Static Files Not Loading:**
   - Ensure `wwwroot` folder is included in build
   - Check file paths (should start with `/`)

---

## Security Notes

⚠️ **IMPORTANT for Production:**

1. **Change JWT Signing Key** - Use a strong random key (minimum 32 characters)
2. **Change Admin Password** - Don't use default password
3. **Use HTTPS** - Most platforms provide this automatically
4. **Limit MongoDB IP Access** - Use specific IPs instead of `0.0.0.0/0` if possible
5. **Set Strong MongoDB Password** - Use a complex password

---

## Cost Summary

- **Hosting:** FREE (with limitations)
- **Database:** FREE (MongoDB Atlas M0)
- **Domain:** FREE (subdomain) or ~$0-12/year (custom domain)
- **Total:** $0/month

---

## Recommended Setup

**Best Free Stack:**
- **Hosting:** Railway or Render
- **Database:** MongoDB Atlas (Free M0)
- **Domain:** Free subdomain from hosting platform
- **CDN:** Cloudflare (free, optional)

---

## Need Help?

- Check hosting platform documentation
- Review application logs in hosting dashboard
- Test locally first with production settings



