# Deployment Instructions for Task Manager

## Step 1: GitHub Repository Setup

1. Go to [GitHub](https://github.com) and create a new repository named `task-manager-fullstack`
2. Make it public so others can see it
3. Don't initialize with README (we already have one)

## Step 2: Push Code to GitHub

Run these commands in your terminal from the project root (`d:\taskmanager`):

```bash
git remote add origin https://github.com/YOUR_USERNAME/task-manager-fullstack.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy Backend to Railway

1. Go to [Railway](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `task-manager-fullstack` repository
4. Choose the `backend` folder as the root directory
5. Add these environment variables in Railway:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string
   - `ADMIN_INVITE_TOKEN`: 271104
   - `CLIENT_URL`: Will be your Netlify URL (add later)
6. Deploy and copy the Railway URL

## Step 4: Deploy Frontend to Netlify

1. Go to [Netlify](https://netlify.com) and sign up/login
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Set build settings:
   - Build command: `cd frontend/Task-Manager && npm install && npm run build`
   - Publish directory: `frontend/Task-Manager/dist`
5. Add environment variable:
   - `VITE_API_URL`: Your Railway backend URL
6. Deploy the site

## Step 5: Update CORS Settings

Update the `CLIENT_URL` environment variable in Railway with your Netlify URL.

## Your Live Application URLs

- **Frontend**: https://your-app-name.netlify.app
- **Backend API**: https://your-app-name.up.railway.app
- **GitHub Repository**: https://github.com/YOUR_USERNAME/task-manager-fullstack

## Features Available in Live App

✅ User Registration & Login
✅ Admin Dashboard with Analytics
✅ Task Management (Create, Update, Delete)
✅ User Management
✅ File Uploads
✅ Excel Report Generation
✅ Role-based Access Control
✅ Responsive Design
