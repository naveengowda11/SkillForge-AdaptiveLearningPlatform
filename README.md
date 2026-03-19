🚀 SkillForge – Adaptive Learning Platform

SkillForge is a full-stack learning platform built to explore how education can move from static content to performance-driven learning.

Instead of giving every user the same path, SkillForge focuses on adapting the learning experience based on how a student performs.

💡 Why SkillForge?

Most learning platforms deliver content.
SkillForge tries to answer a different question:

What if the platform could understand how you're learning and guide you accordingly?

This project is my attempt to build that idea into a working system.

✨ What Makes It Interesting

Adaptive testing based on performance

AI-powered tutor integration (local model)

Personalized dashboard and analytics

Full authentication and role-based system

End-to-end learning flow (course → test → result → progress)

It’s not just pages — it’s a complete learning cycle.

🧩 Features
🔐 Authentication

Email + OTP verification

JWT-based secure sessions

Role-based access (Student / Admin)

👤 User Profile

Education, skills, interests

GitHub & LinkedIn integration

Profile image upload

📚 Course System

Structured learning flow

Course-level access control

Modular content design

🧠 Adaptive Testing

Dynamic quizzes

Tracks performance over time

Stores results for analysis

📊 Dashboard & Analytics

User-specific data

Performance insights

Clean and simple UI

🤖 AI Tutor

Local LLM (Phi-3 via Ollama)

Helps explain concepts

Designed to simulate guided learning

🛠 Tech Stack

Frontend

HTML, CSS, JavaScript

Backend

Node.js, Express

Database

SQLite

Security

JWT Authentication

bcrypt password hashing

Environment-based configs

⚙️ Run Locally
git clone https://github.com/yourusername/SkillForge-AdaptiveLearningPlatform.git
cd SkillForge/backend
npm install
node server.js

Create a .env file:

PORT=5000
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_app_password

Open:

http://localhost:5000
📈 What’s Next

Smarter recommendations based on performance

Deeper AI integration for personalized guidance

Better analytics and insights

Deployment and scalability improvements

👨‍💻 About

Naveen Kumar B
CSE (Data Science)

📌 Status

Actively being improved.
Core system is functional and evolving towards a more intelligent learning experience.
