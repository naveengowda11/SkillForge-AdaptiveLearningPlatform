# SkillForge-AdaptiveLearningPlatform


SkillForge is a full-stack AI-focused adaptive learning platform designed to provide personalized learning experiences based on student performance.

This project is built as a production-style web application with authentication, role-based access, adaptive testing, and performance tracking.

---

## 🌟 Current Features Implemented

### 🔐 Authentication System
- User Registration
- Email OTP Verification
- Secure Login
- JWT-based authentication
- Password hashing
- Role-based access (Student / Admin)

### 👤 Profile Management
- Update personal details
- Education & graduation details
- Skills & interests
- LinkedIn & GitHub links
- Profile photo upload

### 📚 Course System
- AI-focused course structure
- Beginner to Advanced level learning pages
- Protected course access

### 🧠 Adaptive Test Module
- Performance-based testing
- Tracks student results
- Performance page for analytics

### 📊 Dashboard
- Protected dashboard
- Sidebar layout
- User-specific data
- Clean UI structure

### 🗄 Database
- SQLite database
- Normalized tables
- Profile storage
- User storage
- Test results storage

---

## 🛠 Tech Stack

### Frontend
- HTML
- CSS
- Vanilla JavaScript

### Backend
- Node.js
- Express.js
- SQLite

### Security
- JWT Authentication
- bcrypt password hashing
- Environment variables (.env)
- Role-based route protection

---

## ⚙️ How to Run Locally

### 1️⃣ Clone Repository


git clone https://github.com/yourusername/SkillForge.git


### 2️⃣ Navigate to Project


cd SkillForge/backend


### 3️⃣ Install Dependencies


npm install


### 4️⃣ Create .env File

Inside backend folder:


PORT=5000
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_app_password


### 5️⃣ Start Server


node server.js


Server will run at:

http://localhost:5000


---

## 🔒 Environment Variables

The following variables must be configured:

- JWT_SECRET
- EMAIL_USER
- EMAIL_PASS
- PORT

⚠️ .env file is not included in repository for security reasons.

---

## 🎯 Future Improvements (Planned)

- AI Tutor Integration
- Recommendation Engine based on test performance
- Real-time analytics
- Course progress tracking
- Production deployment

---

## 👨‍💻 Author

**Naveen Kumar B**  
CSE (Data Science)  

---

## 📌 Project Status

Currently under active development.
Frontend core systems are functional.
