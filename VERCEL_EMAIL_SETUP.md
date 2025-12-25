# Setting Up Email on Your .com Domain - Quick Guide

## Step 1: Get Your Resend API Key

1. Go to **https://resend.com** and sign up/login
2. Click **"API Keys"** in the left sidebar
3. Click **"Create API Key"**
4. Name it: "Portfolio Contact Form"
5. Copy the key (starts with `re_`) - **you can only see it once!**

## Step 2: Add API Key to Vercel

1. Go to **https://vercel.com** and open your project
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in the left sidebar
4. Click **"Add New"**
5. **Key:** `RESEND_API_KEY`
6. **Value:** Paste your Resend API key
7. **Select all environments:** ✅ Production, ✅ Preview, ✅ Development
8. Click **"Save"**

## Step 3: Connect Your Domain (if not already done)

1. In Vercel, go to **"Settings"** → **"Domains"**
2. Click **"Add"** or **"Add Domain"**
3. Enter your domain (e.g., `jonahortega.com`)
4. Follow Vercel's DNS instructions to add the required records
5. Wait for DNS propagation (can take a few minutes to 24 hours)

## Step 4: Redeploy Your Site

1. Go to **"Deployments"** tab
2. Click the **three dots (⋯)** on your latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

## Step 5: Test It!

1. Go to your live site (your .com domain)
2. Navigate to the Contact section
3. Fill out and submit the form
4. Check your email at **jonahortega7@me.com**

## Troubleshooting

- **Not receiving emails?** Check Vercel → Your Project → Functions → `/api/send-email` logs
- **API key issues?** Make sure you copied the entire key and selected all environments
- **Domain not working?** Check DNS settings in your domain registrar

