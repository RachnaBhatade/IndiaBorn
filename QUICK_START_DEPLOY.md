# Quick Start Deployment Checklist

## Before You Start
- [ ] Code pushed to GitHub
- [ ] GitHub repository is public (or connected to hosting platforms)

---

## 1. MongoDB Atlas (5 minutes)

1. ✅ Create account: https://www.mongodb.com/cloud/atlas
2. ✅ Create FREE cluster (M0 Sandbox)
3. ✅ Add database user (save username/password!)
4. ✅ Network Access → Add IP: `0.0.0.0/0` (allow from anywhere)
5. ✅ Get connection string: `mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/`
6. ✅ Save it - you'll need it for backend deployment

---

## 2. Backend on Render.com (10 minutes)

1. ✅ Create account: https://render.com
2. ✅ New → Web Service
3. ✅ Connect GitHub repository: `IndiaBorn`
4. ✅ Configure:
   - Name: `indiaborn-api`
   - Root Directory: `Indiaborn.Api`
   - Runtime: `.NET`
   - Build: `dotnet publish -c Release -o out`
   - Start: `cd out && ./Indiaborn.Api`
5. ✅ Environment Variables (click "Add Environment Variable"):
   ```
   MongoSettings__ConnectionString=<your-mongodb-connection-string>
   MongoSettings__DatabaseName=IndiabornDb
   JwtSettings__Secret=super-secret-key-min-32-chars-change-this
   JwtSettings__Issuer=IndiaBornAPI
   JwtSettings__Audience=IndiaBornClient
   JwtSettings__ExpiryMinutes=1440
   ASPNETCORE_URLS=http://0.0.0.0:10000
   ```
6. ✅ Click "Create Web Service"
7. ✅ Wait for deployment (5-10 minutes)
8. ✅ Copy your backend URL: `https://indiaborn-api.onrender.com`

---

## 3. Frontend on Vercel (5 minutes)

1. ✅ Create account: https://vercel.com
2. ✅ Add New → Project
3. ✅ Import GitHub repository: `IndiaBorn`
4. ✅ Configure:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build: `npm run build`
   - Output: `dist`
5. ✅ Environment Variables:
   ```
   VITE_API_URL=https://indiaborn-api.onrender.com
   ```
   (Use YOUR Render backend URL from step 2)
6. ✅ Click "Deploy"
7. ✅ Wait for deployment (2-5 minutes)
8. ✅ Your site is live! `https://indiaborn.vercel.app`

---

## 4. Create Admin User (2 minutes)

Option A - Using MongoDB Atlas Web Interface:
1. Go to Atlas → Database → Browse Collections
2. Database: `IndiabornDb`
3. Collection: `UserAccounts`
4. Insert Document:
```json
{
  "email": "admin@indiaborn.com",
  "passwordHash": "$2a$11$...",
  "role": "Admin",
  "createdAt": "2025-11-30T00:00:00Z"
}
```

Option B - Using Registration API:
1. POST to: `https://your-backend.onrender.com/api/auth/register`
2. Body:
```json
{
  "email": "admin@indiaborn.com",
  "password": "ChangeMe123!",
  "role": "Admin"
}
```

---

## 5. Update Render CORS (2 minutes)

After you have your Vercel URL:

1. Go to Render Dashboard → indiaborn-api
2. Environment → Add:
   ```
   AllowedOrigins__0=https://indiaborn.vercel.app
   ```
   (Replace with YOUR actual Vercel URL)
3. Save (will auto-redeploy)

---

## 6. Test Your Deployment ✅

1. ✅ Visit your Vercel URL
2. ✅ Browse products (should load)
3. ✅ Go to `/admin`
4. ✅ Login: `admin@indiaborn.com` / `ChangeMe123!`
5. ✅ Add a test product with image
6. ✅ Check if image displays on main page

---

## Troubleshooting

### Backend won't start on Render
- Check logs in Render dashboard
- Verify MongoDB connection string is correct
- Ensure environment variables are set

### Frontend can't connect to backend
- Check browser console for errors
- Verify `VITE_API_URL` in Vercel matches your Render URL
- Check Render CORS settings allow your Vercel domain

### Images not uploading
- Render free tier has limited storage
- Consider using Cloudinary (free image hosting)
- Check backend logs for upload errors

### Backend is slow (first load)
- Normal! Free tier sleeps after 15 min
- First request wakes it up (~30 seconds)
- Upgrade to $7/month plan for always-on

---

## Cost: $0/month 🎉

- MongoDB Atlas: FREE (512MB)
- Render.com: FREE (750 hours/month)
- Vercel: FREE (100GB bandwidth)

---

## What's Next?

### Optional Upgrades:
- Custom domain (free on Vercel)
- Cloudinary for image hosting (500MB free)
- Email service (SendGrid 100 emails/day free)
- SSL certificate (automatic on Vercel & Render)

### Recommended:
- Set up MongoDB backups
- Add monitoring (UptimeRobot - free)
- Configure environment-specific settings
- Add error tracking (Sentry - free tier)

---

## Support Links

- MongoDB: https://docs.atlas.mongodb.com/
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs

---

**Total deployment time: ~25 minutes**

Good luck! 🚀
