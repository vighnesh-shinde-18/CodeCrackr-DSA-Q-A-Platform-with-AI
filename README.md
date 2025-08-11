# 💻 CodeCrackr – AI-Powered DSA Q&A Platform

A full-stack collaborative platform for solving Data Structures & Algorithms problems with **real-time code compilation** and **AI-powered assistance**.

Users can ask questions, answer with executable code, run solutions in a built-in compiler, and leverage AI tools for **debugging**, **code review**, **refactoring**, **test case generation**, and **detailed explanations**.

Features **leaderboards**, **comprehensive user history**, and **detailed profile tracking** for a complete learning experience.

---

## 📂 Project Structure

```
CodeCrackr/
├── client/          # Frontend (React + Vite + Tailwind + ShadCN UI)
├── server/          # Backend (Node.js + Express + MongoDB)
└── README.md
```

---

## 🚀 Key Features

### ✨ **Q&A Platform**
- Post DSA questions with problem descriptions, constraints, and test cases
- Answer questions with executable code solutions
- Community voting and solution acceptance system
- View and manage your questions and contributions

### 👨🏻‍💻 **Built-in Code Compiler**
- **Multi-language support**: C, C++, Java, Python, JavaScript, and more
- **Real-time execution** with instant results
- **Judge0 API integration** for reliable code compilation
- **Monaco Editor** for professional code editing experience

### 🤖 **AI-Powered Tools**
- **Code Debugging**: Identify and fix issues in your code
- **Code Generation**: Get AI-assisted solution suggestions  
- **Explanation**: Understand complex algorithms step-by-step
- **Optimization**: Improve time and space complexity
- **Test Case Generation**: Create comprehensive test scenarios
- **Code Review**: Get feedback on best practices and improvements

### 🔒 **Authentication & Security**
- JWT + HTTP-only cookie-based authentication
- Secure user registration and password reset
- Rate limiting and security headers (Helmet, CORS)

### 💬 **Community Features**
- **Dynamic Leaderboard** based on accepted solutions and contributions
- **User Profiles** with detailed statistics and achievements
- Track questions asked, answers provided, and AI tool usage

### 📜 **Comprehensive History Tracking**
- AI interaction history with timestamps
- Personal question and answer archives
- Solution tracking and performance analytics

### 📱 **Modern UI/UX**
- Responsive design with ShadCN UI components
- Dark/Light theme toggle for comfortable coding
- Professional Monaco Editor integration
- Mobile-optimized interface

---

## 🛠️ Tech Stack

### 🔹 **Frontend**
- **React 19** with Vite for fast development
- **Tailwind CSS** for utility-first styling
- **ShadCN UI** for consistent component library
- **React Router** for navigation
- **Monaco Editor** for code editing
- **Axios** for API communication

### 🔹 **Backend**
- **Node.js + Express** for server framework
- **MongoDB + Mongoose** for database operations
- **JWT + Cookie-Parser** for authentication
- **Google Gemini API** for AI functionality
- **Judge0 API** for code compilation
- **Helmet, CORS, Express-rate-limit** for security

---

## ⚙️ Installation Guide

### ✅ Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** package manager
- **Judge0 API key** (for code compilation)
- **Google Gemini API key** (for AI features)

---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/vighnesh-shinde-18/CodeCrackr-DSA-Q-A-Platform-with-AI.git
cd CodeCrackr-DSA-Q-A-Platform-with-AI
```

---

### 2️⃣ Frontend Setup
```bash
cd client
npm install
```

Create `.env` file in `/client` directory:
```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the frontend development server:
```bash
npm run dev
```

---

### 3️⃣ Backend Setup
```bash
cd ../server
npm install
```

Create `.env` file in `/server` directory:
```env
# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URL=mongodb://127.0.0.1:27017/codecrackr

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
SALT=10

# AI Services
GEMINI_API_KEY=your_gemini_api_key_here

# Email Configuration (for password reset)
EMAIL_USER=your_email_address
EMAIL_PASS=your_app_specific_password

# Code Compilation
JUDGE0_API=https://judge0-ce.p.rapidapi.com
JUDGE0_KEY=your_judge0_rapidapi_key
```

Start the backend server:
```bash
npm start
```

---

## 🌐 Running the Application

1. **Backend Server**: `http://localhost:5000`
2. **Frontend Application**: `http://localhost:5173`

> **Note**: Ensure both servers are running simultaneously for full functionality.

---

## 🔑 API Keys Setup

### Judge0 API (Code Compilation)
1. Visit [RapidAPI Judge0](https://rapidapi.com/judge0-official/api/judge0-ce/)
2. Subscribe to the free tier
3. Copy your API key to `JUDGE0_KEY` in backend `.env`

### Google Gemini API (AI Features)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to `GEMINI_API_KEY` in backend `.env`

---

## 🔐 Authentication System

- **JWT tokens** stored in HTTP-only cookies for security
- **Protected routes** require valid authentication tokens
- **Cookie-based sessions** - ensure cookies are enabled in your browser
- **Automatic token refresh** for seamless user experience

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy the 'dist' folder
```

### Backend (Heroku/Railway/DigitalOcean)
```bash
cd server
# Set environment variables in your hosting platform
# Deploy with your preferred service
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🐛 Troubleshooting

### Common Issues:
- **MongoDB Connection**: Ensure MongoDB is running locally or check Atlas connection string
- **CORS Errors**: Verify `FRONTEND_URL` matches your client URL exactly
- **Judge0 API**: Check API key validity and subscription status
- **Environment Variables**: Ensure all `.env` files are properly configured

---

## 📝 License

MIT © 2025 [Vighnesh Shinde](https://github.com/vighnesh-shinde-18)

---

## 🌟 Acknowledgments

- Judge0 for reliable code compilation API
- Google Gemini for AI capabilities
- ShadCN UI for beautiful components
- Monaco Editor for professional code editing

---

**Happy Coding! 🚀**
