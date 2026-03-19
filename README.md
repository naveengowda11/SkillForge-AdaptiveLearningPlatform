SkillForge-AdaptiveLearningPlatform

SkillForge is a full-stack adaptive learning platform I built to explore how learning can be personalized based on student performance.

Instead of giving the same content to every user, the platform focuses on adapting the learning experience through testing, tracking, and feedback.

This project is designed like a real application with authentication, role-based access, course management, testing, and performance tracking.

🌟 Current Features Implemented
🔐 Authentication System

User Registration with Email OTP verification

Secure Login system

JWT-based authentication

Password hashing using bcrypt

Role-based access (Student / Admin)

Google OAuth login

👤 Profile Management

Update personal details

Education and skills information

Interests and social links (GitHub, LinkedIn)

Profile photo upload

📚 Course System

Dynamic course creation (Admin)

Course modules and lessons

Video-based learning

Course enrollment system

🧠 Adaptive & Final Test Module

Adaptive quizzes based on courses

Final quiz after course completion

Automatic result calculation

Certificate generation based on performance

📊 Dashboard & Performance Tracking

Personalized dashboard

Course progress tracking

Test performance analytics

Leaderboard system

🤖 AI Tutor

Integrated AI tutor using local model (Phi-3 via Ollama)

Helps explain concepts in simple terms

Responds to student queries in real-time

🔔 Notifications & Social Features

Notifications for course updates and completion

Basic messaging system

Friend system

📁 File & Notes System

Admin can upload course-related files

Students can access and download notes

🗄 Database

SQLite database

Normalized relational structure

Stores users, profiles, courses, quizzes, results, and certificates

🛠 Tech Stack
Frontend

HTML

CSS

Vanilla JavaScript

Backend

Node.js

Express.js

SQLite

Security

JWT Authentication

bcrypt password hashing

Environment variables (.env)

Role-based route protection

⚙️ How to Run Locally
1️⃣ Clone Repository

git clone https://github.com/yourusername/SkillForge-AdaptiveLearningPlatform.git

2️⃣ Navigate to Project

cd SkillForge/backend

3️⃣ Install Dependencies

npm install

4️⃣ Create .env File

Inside backend folder:

PORT=5000
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_app_password

5️⃣ Start Server

node server.js

Server will run at:

http://localhost:5000

🔒 Environment Variables

The following variables must be configured:

JWT_SECRET

EMAIL_USER

EMAIL_PASS

PORT

⚠️ .env file is not included in repository for security reasons.

🎯 Future Improvements (Planned)

AI-based personalized suggestions after quizzes

Better adaptive learning based on weak areas

Improved analytics and visual insights

Real-time features and activity tracking

UI/UX improvements

Production deployment and scaling

👨‍💻 Author

Naveen Kumar B
CSE (Data Science)

📌 Project Status

Currently under active development.
Core features are working and the platform is continuously being improved
