# 🌐 Web Monitor: AI-Powered Tracker

A modern web application that monitors website changes and uses **Google Gemini AI** to summarize the differences between versions. Built with the MERN stack and styled with a sleek, dark-themed UI.

## ✨ Features
* **Real-time Monitoring:** Add up to 8 URLs to track.
* **AI Analysis:** Automatically summarizes what changed on a page using LLMs.
* **Gmail-style Validation:** Real-time URL format checking.
* **System Health:** Dedicated dashboard to monitor API and Database status.
* **Modern UI:** Custom modal confirmations and responsive grid layout.

## 🚀 Tech Stack
* **Frontend:** React, Vite, Axios
* **Backend:** Node.js, Express, MongoDB
* **AI:** Google Gemini API
* **Deployment:** Netlify (Frontend) & Render (Backend)

## 🛠️ Setup
1. Clone the repo.
2. Install dependencies: `npm install`.
3. Create a `.env` file with:
   - `VITE_API_URL` (Frontend)
   - `MONGO_URI` (Backend)
   - `GEMINI_API_KEY` (Backend)
4. Start the app: `npm run dev`.