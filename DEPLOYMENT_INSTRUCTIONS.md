# Free Hosting Deployment Guide for IndiaBorn

## Overview
This guide will help you deploy your IndiaBorn e-commerce website for FREE using:
- **Frontend**: Vercel (free tier)
- **Backend**: Render.com (free tier)
- **Database**: MongoDB Atlas (free tier)

Total Cost: **$0/month**

---

## Step 1: Database Setup (MongoDB Atlas)

### 1.1 Create Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new project named "IndiaBorn"

### 1.2 Create Free Cluster
1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select a cloud provider (AWS recommended)
4. Choose a region close to your users
5. Cluster name: `IndiabornCluster`
6. Click "Create"

### 1.3 Configure Database Access
1. Go to "Database Access" in left menu
2. Click "Add New Database User"
3. Create username and password (save these!)
4. Database User Privileges: "Read and write to any database"
5. Click "Add User"

### 1.4 Configure Network Access
1. Go to "Network Access" in left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.5 Get Connection String
1. Go to "Database" → Click "Connect"
2. Choose "Connect your application"
3. Driver: C#/.NET
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Example: `mongodb+srv://username:password@indiaborncluster.xxxxx.mongodb.net/?retryWrites=true&w=majority`

---

## Step 2: Backend Deployment (Render.com)

### 2.1 Prepare Repository
1. Make sure your code is pushed to GitHub
2. Repository should be public (or connect Render to private repos)

### 2.2 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub account

### 2.3 Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select the `IndiaBorn` repository

### 2.4 Configure Web Service
- **Name**: `indiaborn-api`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `Indiaborn.Api`
- **Runtime**: `.NET`
- **Build Command**: `dotnet publish -c Release -o out`
- **Start Command**: `cd out && ./Indiaborn.Api`

### 2.5 Add Environment Variables
Click "Advanced" → "Add Environment Variable"

Add these variables:

```
MongoSettings__ConnectionString=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
MongoSettings__DatabaseName=IndiabornDb
JwtSettings__Secret=your-super-secret-jwt-key-min-32-characters-long-change-this
JwtSettings__Issuer=IndiaBornAPI
JwtSettings__Audience=IndiaBornClient
JwtSettings__ExpiryMinutes=1440
StripeSettings__PublishableKey=your_stripe_publishable_key
StripeSettings__SecretKey=your_stripe_secret_key
NotificationSettings__WhatsAppToken=your_whatsapp_token
NotificationSettings__MessengerToken=your_messenger_token
NotificationSettings__TwilioAccountSid=your_twilio_sid
NotificationSettings__TwilioAuthToken=your_twilio_token
NotificationSettings__TwilioPhoneNumber=your_twilio_phone
ASPNETCORE_URLS=http://+:5000
```

### 2.6 Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your backend URL will be: `https://indiaborn-api.onrender.com`

**Note**: Free tier sleeps after 15 minutes of inactivity. First request after sleep takes ~30 seconds.

---

## Step 3: Frontend Deployment (Vercel)

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub account

### 3.2 Import Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Select the `IndiaBorn` repository

### 3.3 Configure Project
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.4 Add Environment Variable
Click "Environment Variables" and add:

```
VITE_API_URL=https://indiaborn-api.onrender.com
```

### 3.5 Deploy
1. Click "Deploy"
2. Wait for deployment (2-5 minutes)
3. Your frontend URL will be: `https://indiaborn.vercel.app`

### 3.6 Custom Domain (Optional)
1. Go to project settings → "Domains"
2. Add your custom domain
3. Update DNS records as instructed

---

## Step 4: Initialize Database

### 4.1 Create Admin User
Use MongoDB Compass or Atlas web interface:

1. Connect to your database
2. Select database: `IndiabornDb`
3. Create collection: `UserAccounts`
4. Insert document:

```json
{
  "email": "admin@indiaborn.com",
  "passwordHash": "$2a$11$your-hashed-password",
  "role": "Admin",
  "createdAt": "2025-11-30T00:00:00Z"
}
```

**To generate password hash:**
Run this locally with your backend:
```bash
POST https://your-backend-url/api/auth/register
{
  "email": "admin@indiaborn.com",
  "password": "ChangeMe123!",
  "role": "Admin"
}
```

---

## Post-Deployment Checklist

✅ **Test Backend**
- Visit: `https://indiaborn-api.onrender.com/api/products`
- Should return products array (may be empty)

✅ **Test Frontend**
- Visit: `https://indiaborn.vercel.app`
- Website should load completely
- Check browser console for errors

✅ **Test Admin Login**
- Go to: `https://indiaborn.vercel.app/admin`
- Login with: admin@indiaborn.com / ChangeMe123!

✅ **Test File Upload**
- Login to admin panel
- Try uploading a product image
- Image should display correctly

✅ **Test Full Flow**
1. Browse products
2. Add to cart
3. Checkout process
4. Check pin code
5. View order history

---

## Troubleshooting

### Backend Issues

**Problem**: Backend won't start
- Check Render logs: Dashboard → Service → "Logs"
- Verify environment variables are correct
- Ensure MongoDB connection string is valid

**Problem**: 500 errors
- Check Render logs for detailed error
- Verify MongoDB Atlas allows connections from anywhere
- Test database connection string locally first

**Problem**: Images not uploading
- Render free tier has limited storage
- Consider using Cloudinary for image hosting (free tier available)

### Frontend Issues

**Problem**: API calls failing
- Check browser console for CORS errors
- Verify VITE_API_URL is correct
- Ensure backend CORS allows your Vercel domain

**Problem**: Environment variables not working
- Redeploy after adding environment variables
- Ensure variable names start with `VITE_`

**Problem**: Build fails
- Check Vercel build logs
- Verify `package.json` has correct dependencies
- Try building locally first: `npm run build`

---

## Cost Breakdown

| Service | Free Tier Limits | Cost |
|---------|-----------------|------|
| MongoDB Atlas | 512MB storage | $0 |
| Render.com | 750 hours/month, sleeps after 15min | $0 |
| Vercel | 100GB bandwidth, unlimited sites | $0 |
| **Total** | | **$0/month** |

---

## Upgrade Paths (When Needed)

### When to Upgrade Backend ($7/month)
- Backend sleeping is annoying users
- Need faster response times
- More than 750 hours/month usage

### When to Upgrade Database ($9/month)
- More than 512MB data
- Need automated backups
- Need better performance

### When to Upgrade Frontend ($20/month)
- More than 100GB bandwidth
- Need advanced analytics
- Need team collaboration

---

## Support

- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **Render**: https://render.com/docs
- **Vercel**: https://vercel.com/docs

---

## Security Notes

1. **Never commit secrets** to GitHub
2. **Use environment variables** for all sensitive data
3. **Enable 2FA** on all hosting accounts
4. **Regularly update** dependencies
5. **Monitor logs** for suspicious activity

---

Good luck with your deployment! 🚀
