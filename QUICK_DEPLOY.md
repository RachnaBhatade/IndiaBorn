# Quick Deploy Guide - Indiaborn™ Website

## Fastest Way to Deploy (Railway - 5 minutes)

### Step 1: Prepare Your Code
```bash
# Make sure you're in the project directory
cd Indiaborn.Api

# Initialize git if not done
git init
git add .
git commit -m "Ready for deployment"
```

### Step 2: Push to GitHub
1. Create a new repository on GitHub.com
2. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/indiaborn.git
git branch -M main
git push -u origin main
```

### Step 3: Set Up MongoDB Atlas (Free)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create cluster (Free M0)
4. Create database user (remember password!)
5. Network Access → Add IP Address → `0.0.0.0/0` (allow all)
6. Database → Connect → "Connect your application"
7. Copy connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/`)

### Step 4: Deploy on Railway
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Railway will auto-detect .NET and start building

### Step 5: Add Environment Variables
In Railway dashboard, go to your project → Variables tab, add:

```
Mongo__ConnectionString=mongodb+srv://username:password@cluster.mongodb.net/
Mongo__DatabaseName=IndiabornDb
Jwt__SigningKey=CHANGE-THIS-TO-A-RANDOM-32-CHARACTER-STRING
Jwt__Issuer=Indiaborn
Jwt__Audience=IndiabornUsers
Admin__Email=admin@indiaborn.com
Admin__Password=YourSecurePassword123!
```

### Step 6: Get Your Free Domain
1. Railway provides: `your-app.railway.app`
2. Or add custom domain (free) in Settings → Domains

### Step 7: Access Your Site
- Storefront: `https://your-app.railway.app`
- Admin Panel: `https://your-app.railway.app/admin.html`
- Login: `admin@indiaborn.com` / `YourSecurePassword123!`

---

## Alternative: Render (Also Free)

1. Go to https://render.com
2. Sign up with GitHub
3. New → Web Service
4. Connect your GitHub repo
5. Settings:
   - **Build Command:** `dotnet publish -c Release -o ./publish`
   - **Start Command:** `dotnet ./publish/Indiaborn.Api.dll`
6. Add same environment variables as above
7. Deploy!

Free domain: `your-app.onrender.com`

---

## Important Notes

✅ **MongoDB:** Use MongoDB Atlas (free tier) - don't use localhost  
✅ **JWT Key:** Generate a strong random key (minimum 32 characters)  
✅ **Admin Password:** Change from default!  
✅ **HTTPS:** Automatically provided by hosting platforms  

---

## Generate Secure JWT Key

Use this PowerShell command:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

Or use an online generator: https://randomkeygen.com/

---

## Troubleshooting

**Build fails?**
- Check Railway/Render logs
- Ensure .NET 9.0 is supported
- Verify all files are committed to GitHub

**Can't connect to MongoDB?**
- Check IP whitelist (should include `0.0.0.0/0`)
- Verify connection string format
- Ensure password is correct

**Site not loading?**
- Check environment variables are set
- Review application logs
- Verify build completed successfully

---

## Cost: $0/month

- Hosting: Free (Railway/Render)
- Database: Free (MongoDB Atlas)
- Domain: Free subdomain included
- **Total: FREE!**



