# Render.com Deployment Configuration for IndiaBorn API

# Build Command
dotnet publish -c Release -o out

# Start Command  
cd out && ./Indiaborn.Api

# Environment Variables (Add these in Render Dashboard)
# MongoSettings__ConnectionString=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
# MongoSettings__DatabaseName=IndiabornDb
# JwtSettings__Secret=your-super-secret-jwt-key-min-32-characters-long
# JwtSettings__Issuer=IndiaBornAPI
# JwtSettings__Audience=IndiaBornClient
# JwtSettings__ExpiryMinutes=1440
# StripeSettings__PublishableKey=your_stripe_key
# StripeSettings__SecretKey=your_stripe_secret
# NotificationSettings__WhatsAppToken=your_token
# NotificationSettings__MessengerToken=your_token
# NotificationSettings__TwilioAccountSid=your_sid
# NotificationSettings__TwilioAuthToken=your_token
# NotificationSettings__TwilioPhoneNumber=your_phone
# ASPNETCORE_URLS=http://+:5000
