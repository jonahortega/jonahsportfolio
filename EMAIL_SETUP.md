# Email Setup for Contact Form - Step by Step Guide

This guide will walk you through setting up email functionality for the contact form on Vercel.

## Part 1: Getting Your Resend API Key

### Step 1: Sign Up/Login to Resend
1. Go to **https://resend.com**
2. Click **"Sign Up"** (or **"Log In"** if you already have an account)
3. Create an account using your email (free tier available)

### Step 2: Access API Keys Section
1. Once logged in, you'll be on the Resend dashboard
2. Look at the **left sidebar menu**
3. Click on **"API Keys"** (it's in the menu, usually near the bottom)

### Step 3: Create a New API Key
1. Click the **"Create API Key"** button (usually a blue button at the top right)
2. Give it a name like: **"Portfolio Contact Form"**
3. Select permissions: Choose **"Sending access"** (this allows sending emails)
4. Click **"Add"** or **"Create"**
5. **IMPORTANT:** Copy the API key immediately! It will look like: `re_xxxxxxxxxxxxx`
   - ⚠️ **You can only see this key once** - if you close the window, you'll need to create a new one
   - Save it somewhere safe (like a password manager or notes app)

## Part 2: Adding API Key to Vercel

### Step 1: Go to Your Vercel Project
1. Go to **https://vercel.com**
2. Log in to your account
3. Find and click on your project (should be **"jonahortega-portfolio"** or similar)

### Step 2: Navigate to Environment Variables
1. Click on the **"Settings"** tab (at the top of the project page)
2. In the left sidebar under Settings, click **"Environment Variables"**

### Step 3: Add the API Key
1. Click the **"Add New"** button (or **"Add"** button)
2. In the **"Key"** field, type exactly: `RESEND_API_KEY`
3. In the **"Value"** field, paste your Resend API key (the one that starts with `re_`)
4. **Select all three environments:**
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
5. Click **"Save"**

### Step 4: Redeploy Your Site
1. Go to the **"Deployments"** tab (at the top)
2. Find your latest deployment
3. Click the **three dots (⋯)** menu on the right side of the deployment
4. Click **"Redeploy"**
5. Confirm by clicking **"Redeploy"** again
6. Wait for the deployment to complete (usually 1-2 minutes)

## Part 3: Testing

After redeployment:
1. Go to your live website
2. Navigate to the **Contact** section
3. Fill out the contact form with a test message
4. Submit the form
5. Check your email at **jonahortega7@me.com** - you should receive the email!

## Troubleshooting

- **Not receiving emails?** Check Vercel function logs:
  - Go to Vercel → Your Project → Functions tab
  - Look for `/api/send-email` logs
- **API key not working?** Make sure you copied the entire key (it's long, starts with `re_`)
- **Still having issues?** Check that the environment variable is set for all environments (Production, Preview, Development)

## Option 2: Using Other Email Services

You can modify `/api/send-email.js` to use other services like:
- SendGrid
- Mailgun
- Nodemailer with SMTP
- AWS SES

## Testing

After deployment, test the contact form. Emails will be sent to: `jonahortega7@me.com`

## Troubleshooting

- If emails aren't sending, check Vercel function logs
- Make sure the `RESEND_API_KEY` environment variable is set correctly
- Verify the email address in the API function matches your desired recipient

