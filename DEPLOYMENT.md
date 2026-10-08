# Deployment Guide

This guide covers deploying the Cybersecurity Agent to a live server so it's accessible online.

## Option 1: Railway (Recommended - Easiest)

Railway is the simplest option for this project.

### Steps:

1. **Sign up** at [railway.app](https://railway.app) (free tier available)

2. **Connect your GitHub repo**:
   - Log in to Railway
   - Click "New Project" → "Deploy from GitHub"
   - Select `jroger86/cybersecurity_agent`
   - Authorize Railway to access your GitHub

3. **Set environment variables**:
   - In Railway dashboard, go to "Variables"
   - Add:
     ```
     GEMINI_API_KEY=your_actual_gemini_key_here
     NODE_ENV=production
     ```

4. **Deploy**:
   - Railway auto-deploys on every push to main
   - Your app will be live at a URL like `cybersecurity-agent-prod.up.railway.app`

That's it! No additional configuration needed.

### Cost:
- Free tier: $5/month credits (usually enough for this)
- Paid: $5+/month based on usage

---

## Option 2: Heroku (Traditional)

Heroku is a classic deployment platform.

### Steps:

1. **Install Heroku CLI**:
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku

   # Windows/Linux - download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create a Heroku app**:
   ```bash
   heroku login
   heroku create cybersecurity-agent-unique-name
   ```

3. **Set environment variables**:
   ```bash
   heroku config:set GEMINI_API_KEY=your_actual_key_here
   ```

4. **Deploy**:
   ```bash
   git push heroku main
   ```

5. **View logs**:
   ```bash
   heroku logs --tail
   ```

Your app will be live at `https://cybersecurity-agent-unique-name.herokuapp.com`

### Cost:
- Free tier: Deprecated (Heroku ended free tier)
- Paid: $7+/month

---

## Option 3: Render (Alternative)

Render is modern and straightforward.

### Steps:

1. **Sign up** at [render.com](https://render.com)

2. **Create new Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repo
   - Select branch: `main`

3. **Configure**:
   - **Name**: `cybersecurity-agent`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Add environment variables**:
   - Go to "Environment" section
   - Add `GEMINI_API_KEY=your_key_here`

5. **Deploy**:
   - Click "Create Web Service"
   - Render auto-deploys from GitHub

Your app will be live at a URL like `cybersecurity-agent.onrender.com`

### Cost:
- Free tier: Available (with ~15 min spin-down)
- Paid: $7+/month

---

## Option 4: AWS, Google Cloud, Azure (Advanced)

For production-grade deployment with custom domains and scaling.

- **AWS**: Use EC2 + RDS or Elastic Beanstalk
- **Google Cloud**: Use App Engine or Cloud Run
- **Azure**: Use App Service

Not recommended for this project unless you need enterprise features.

---

## Recommended: Railway Setup (Step-by-Step)

### 1. Push to GitHub first:
```bash
git add .
git commit -m "Deploy: add Procfile and deployment config"
git push origin main
```

### 2. Go to [railway.app](https://railway.app)

### 3. Click "New Project"

### 4. Select "Deploy from GitHub repo"

### 5. Find and select `jroger86/cybersecurity_agent`

### 6. In the Railway dashboard:
- Click on your project
- Go to "Variables"
- Add: `GEMINI_API_KEY` with your actual key

### 7. Railway auto-deploys
- Wait ~2-3 minutes
- Check the "Deployments" tab to see status
- Click the URL to visit your live site

---

## After Deployment

### Test your live app:
```bash
curl https://your-deployed-url.com/health
```

Should return:
```json
{"status":"ok","timestamp":"2026-10-08T..."}
```

### Scan a file:
- Visit your deployed URL
- Upload a file
- It should scan and save findings

### View findings:
```bash
curl https://your-deployed-url.com/memory
```

---

## Troubleshooting

**App crashes on deploy:**
- Check logs: Railway/Render dashboard → Logs
- Ensure `GEMINI_API_KEY` is set
- Verify `package.json` has correct start script

**Files not persisting between deploys:**
- Railway/Render restart the app periodically
- `security_memory.json` will be reset
- For persistent storage, upgrade to a database (PostgreSQL)

**API key not working:**
- Copy exact key from Google Cloud console
- No extra spaces or quotes
- Verify API is enabled

**Slow uploads:**
- Railway/Render free tier has ~10 second timeout
- Upgrade to paid for faster scans

---

## Next Steps

Once deployed:

1. **Share the URL** - Anyone can now visit and use it
2. **Add authentication** - Protect with login if needed
3. **Database upgrade** - Switch to PostgreSQL for persistent memory
4. **Custom domain** - Set up a domain name (optional)
5. **Monitoring** - Set up alerts for errors

Need help with any of these? Let me know!
