# 💻 CodeCrackr – AI-Powered DSA Q&A Platform 

A full-stack collaborative platform for solving Data Structures & Algorithms problems with Code Compilations.
Users can ask questions, answer with code, run solutions in a built-in compiler, and leverage AI tools for **debugging**, **review**, **refactoring**,** test case generation**, and **code explanations**.
Includes **leaderboards**, **user history**, and **profile tracking**.
---

## 📂 Project Structure

```
/client   ← Frontend (React + Vite + Tailwind + ShadCN UI)
/server  ← Backend (Node.js + Express + MongoDB)
```

---

## 🚀 Features

- ✨**Q&A Platform**
  - Post questions with Problem Title, Descritpion and Test Cases
  - Answer and accept best solutions 
  - View & manage your questions and answers\
    
- 👨🏻‍💻 **Built-in Compiler**
  - Supports multiple programming languages (C, C++, Java, Python, JavaScript, etc.)
  - Real-time code execution 
    
- 🔒 **Authentication using JWT + Cookies**
  - JWT + cookie-based login
  - Registration & password reset
  
- 🤖 **AI Tool**
  - Code Debugging
  - Code generation
  - Explanation
  - Optimization
  - Test case generation
  - Review & refactor suggestions
    
- 💬 **User & Community Features**
    - Leaderboard based on answers & accepted solutions
    - User profile with stats (questions, answers, AI tool usage)

  
- 📜 **History**
    - History of AI interactions 
    - History uploaded questions
    - History of Answered Questions
      
- 📱 **UI**
    - Modern responsive design (ShadCN UI + Tailwind)
    - Monaco Editor integration
    - Dark/Light theme toggle
      
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
- MongoDB + Mongoose
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

Create a `.env` file inside `/frontend `:

```env
VITE_API_BASE_URL = your_vite_api_base_url
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
FRONTEND_URL = http://localhost:5173
EMAIL_USER= your_email_id
EMAIL_PASS= your_email_pass
JUDGE0_API=https://judge0-ce.p.rapidapi.com
JUDGE0_KEY= your-judge0-api-key
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


## 📄 License

MIT © 2025 [Your Name]
