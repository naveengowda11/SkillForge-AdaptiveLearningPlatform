SkillForge – Adaptive Learning Platform

SkillForge is a full-stack learning platform I built with the idea of making learning more personalized and performance-driven. The goal is simple — instead of giving the same content to everyone, the system adapts based on how a student performs.

This project is designed more like a real product than just a demo, with proper authentication, course flow, testing, and user tracking.

What the Project Does

SkillForge allows users to register, log in securely, and access courses. After learning, they can take tests, and based on their performance, the system tracks their progress and shows insights.

There’s also an admin side where courses and data can be managed.

Features
Authentication

User registration with OTP verification

Secure login system

JWT-based authentication

Password hashing using bcrypt

Role-based access (student and admin)

User Profile

Users can update personal details

Add education, skills, and interests

Upload profile photo

Add GitHub and LinkedIn links

Course System

Structured courses (mainly AI-focused)

Different levels of learning

Access control for enrolled users

Adaptive Test Module

Tests based on course content

Stores and tracks results

Helps analyze student performance

Dashboard

Personalized dashboard for each user

Clean layout with sidebar navigation

Shows user-related data and progress

Database

SQLite used for storage

Proper separation of users, profiles, and test data

Tech Stack

Frontend

HTML

CSS

JavaScript

Backend

Node.js

Express.js

SQLite

Security

JWT authentication

bcrypt for password hashing

Environment variables for sensitive data

Running the Project Locally

Clone the repository:

git clone https://github.com/yourusername/SkillForge-AdaptiveLearningPlatform.git

Go to backend:

cd SkillForge/backend

Install dependencies:

npm install

Create a .env file inside backend:

PORT=5000
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_app_password

Run the server:

node server.js

Open in browser:

http://localhost:5000
What I Plan to Improve

This is still evolving. Some things I want to add next:

Better AI-based recommendations

Smarter adaptive learning logic

More detailed analytics

Improved course tracking

Deployment and scaling

About Me

Naveen Kumar B
CSE (Data Science)

Project Status

The core features are working and stable.
Still improving the system and planning to make it more intelligent and scalable
