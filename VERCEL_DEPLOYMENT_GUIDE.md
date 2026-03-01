# 🚀 Deploying Travel App to Vercel

Vercel is an excellent, free-tier friendly platform for hosting full-stack JavaScript applications. This guide will walk you through hosting your React frontend and Express backend together on Vercel.

---

## Step 1: Push Your Code to GitHub
Vercel connects directly to your GitHub repository to automatically build and deploy your app whenever you push changes.

1. Ensure your `.gitignore` is in the root directory (I've already created this for you!).
2. Initialize and push your code:
   ```bash
   git init
   git add .
   git commit -m "Ready for Vercel deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

---

## Step 2: Prepare the Backend for Serverless
Vercel turns Express applications into **Serverless Functions**. I have already made the necessary code changes for you:
*   Created `server/api/index.js` (The serverless entry point).
*   Created `server/vercel.json` (Tells Vercel how to route traffic).

> [!NOTE]
> Serverless functions spin up on-demand. When the very first request hits your API, it will take a second or two to connect to MongoDB. Subsequent requests will be much faster.

---

## Step 3: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New** -> **Project**.
3. Import the GitHub repository you just created.

### ⚙️ Crucial Configuration Settings:
When you reach the "Configure Project" screen, make the following adjustments:

**A. Framework Preset:**
Leave this as `Vite`.

**B. Root Directory:**
Click `Edit` and change the Root Directory to **`client`**.
*(Vercel needs to know the frontend is inside the `client` folder. It will still find your `server/api` functions automatically because they are in the repository root).*

**C. Environment Variables:**
You MUST copy all your variables from both `.env` files here so the production server can read them.

**From your server `.env`:**
*   `MONGODB_URI` (Your MongoDB Atlas connection string)
*   `JWT_SECRET`
*   `CLOUDINARY_CLOUD_NAME`
*   `CLOUDINARY_API_KEY`
*   `CLOUDINARY_API_SECRET`
*   `NODE_ENV` (Set this manually to `production`)

**From your client `.env`:**
*   `VITE_GOOGLE_CLIENT_ID`
*   `VITE_GOOGLE_MAPS_API_KEY`

> [!IMPORTANT]
> Change your `VITE_API_URL` to point to the production environment! 
> Add variable: `VITE_API_URL` 
> Value: `/api/v1` (Because we configured Vercel routes to proxy this natively).

---

## Step 4: Deploy!

Click the **Deploy** button. Vercel will install dependencies, build your Vite frontend, and configure your Express serverless functions.

Once finished, you will be given a live `yourapp.vercel.app` URL!

---

## Troubleshooting "Network Errors" after Deploying

*   **Whitelist Vercel in MongoDB Atlas:** Since Vercel IPs change constantly, you must go to your MongoDB Atlas dashboard -> Network Access -> and click **Allow Access from Anywhere (0.0.0.0/0)** so Vercel can connect to the database.
*   **Google OAuth Authorized Origins:** You will need to take your new `.vercel.app` URL, go to the Google Cloud Console, and add it to the **Authorized JavaScript origins** and **Authorized redirect URIs** for your Google Login to work in production.
