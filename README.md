# 💻 AI-Powered DSA Assistant

A full-stack web application that helps users solve DSA (Data Structures & Algorithms) problems using AI. Features include **code debugging**, **generation**, **explanation**, **optimization**, **test case generation**, **review**, and more — powered by Hugging Face and Gemini APIs.

---

## 📂 Project Structure

```
/client   ← Frontend (React + Vite + Tailwind + ShadCN UI)
/server  ← Backend (Node.js + Express + MongoDB)
```

---

## 🚀 Features

- ✨ Modern UI with **ShadCN UI** and **Monaco Editor**
- 🔒 Authentication using JWT + Cookies
- 🤖 AI Features: Debug, Generate, Explain, Optimize, Test Case Generator, Review
- 🧠 Gemini + Hugging Face APIs for smart coding assistance
- 💬 Chat-like interface with structured responses
- 📜 History: View previous conversations
- 🌙 Dark/Light theme toggle
- 👥 User profile support
- 📱 Mobile responsive

---

## 🛠️ Tech Stack

### 🔹 Frontend
- React 19 (Vite)
- Tailwind CSS
- ShadCN UI
- React Router
- Monaco Editor
- Axios

### 🔹 Backend
- Node.js + Express
- MongoDB (Mongoose)
- JWT + Cookie-Parser
- Google Gemini API
- Helmet, CORS, Express-rate-limit

---

## ⚙️ Installation Instructions

### ✅ Prerequisites

- Node.js (v18+ recommended)
- MongoDB running locally or MongoDB Atlas
- NPM

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/vighnesh-shinde-18/CodeCrackr-DSA-Q-A-Platform-with-AI
cd CodeCrackr-DSA-Q-A-Platform-with-AI
```

---

### 2️⃣ Install Frontend

```bash
cd client
npm install
```

Start frontend dev server:
```bash
npm run dev
```

---

### 3️⃣ Install Backend

```bash
cd ../backend
npm install
```

Create a `.env` file inside `/backend`:

```env
JWT_EXPIRES_IN=24h
MONGODB_URL = mongodb://127.0.0.1:27017/
SALT = 5
JWT_SECRET = your_secret_key
PORT = 5000
GEMINI_API_KEY = your_gemini_api_key
FRONTEND_URL = your_frontend_url
EMAIL_USER= your_email_id
EMAIL_PASS= your_email_pass
```

Create a `.env` file inside `/backend`:

```env
JWT_EXPIRES_IN=24h
MONGODB_URL = mongodb://127.0.0.1:27017/
SALT = 5
JWT_SECRET = your_secret_key
PORT = 5000
GEMINI_API_KEY = your_gemini_api_key
FRONTEND_URL = your_frontend_url
EMAIL_USER= your_email_id
EMAIL_PASS= your_email_pass
```

Start backend server:

```bash
npm start
```

---

## 🌐 Running App

1. Backend will run on `http://localhost:5000`
2. Frontend will run on `http://localhost:5173` (default Vite port)

Make sure both servers are running simultaneously.

---

## 🔐 Authentication

- JWT token is sent via **cookies**
- Protected routes require token in cookies (`httpOnly`)
- Mobile users must have cookies enabled to access secured APIs

---

## ✅ Checklist Before Moving to Next Project

| Task | Status |
|------|--------|
| ✅ Complete frontend pages (Feature, History, Profile, etc.) | ✔️ |
| ✅ Finalized backend APIs (auth, AI routes, history) | ✔️ |
| ✅ Cookies-based auth with mobile support | ✔️ |
| ✅ Token sending and reading correctly (CORS + credentials) | ✔️ |
| ✅ Responsive UI tested on mobile and desktop | ✔️ |
| ✅ Final `.env` setup | ✔️ |
| ✅ Code cleanup and comments | ✔️ |
| ✅ README.md complete | ✔️ |
| ✅ Deployment-ready (optional) | 🚧 (next step) |

---

## 📦 Future Improvements

- ✅ Add OAuth (Google Sign-In)
- ✅ Rate-limiting per user
- ✅ Save and load favorite prompts
- ✅ Shareable public links of solutions
- ✅ In-browser code execution sandbox

---

## 🧪 Testing

- Manual test across devices (mobile & desktop)
- Check for:
  - Auth issues (esp. mobile cookies)
  - CORS errors
  - AI API rate limits
  - Broken UI on smaller screens

---

## 📄 License

MIT © 2025 [Your Name]