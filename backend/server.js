require("dotenv").config();

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SECRET_KEY = process.env.JWT_SECRET || "skillforge_secret";

const ADMIN_EMAIL = "admin@skillforge.com";
const ADMIN_PASSWORD = "Admin@123";
// ================= DATABASE =================

const db = new sqlite3.Database("./database.db");

db.run(`
CREATE TABLE IF NOT EXISTS users(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
email TEXT UNIQUE,
password TEXT,
created_at TEXT
)
`);
db.run(`
   CREATE TABLE IF NOT EXISTS courses(
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT,
description TEXT,
category TEXT,
video TEXT

)`
);
db.run(`CREATE TABLE IF NOT EXISTS quizzes(
id INTEGER PRIMARY KEY AUTOINCREMENT,
course TEXT,
question TEXT,
option1 TEXT,
option2 TEXT,
option3 TEXT,
option4 TEXT,
answer INTEGER
)
`);
db.run(`CREATE TABLE IF NOT EXISTS feedback(
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER,
course TEXT,
message TEXT,
date TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS profiles(
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER UNIQUE,
phone TEXT,
dob TEXT,
gender TEXT,
education TEXT,
university TEXT,
skills TEXT,
interests TEXT,
github TEXT,
linkedin TEXT,
bio TEXT,
photo TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS test_results(
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER,
score INTEGER,
total INTEGER,
weakest_domain TEXT,
date TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS messages(
id INTEGER PRIMARY KEY AUTOINCREMENT,
sender_id INTEGER,
receiver_id INTEGER,
message TEXT,
date TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS friends(
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER,
friend_id INTEGER
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS certificates(
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER,
course TEXT,
date TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS files(
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT,
path TEXT
)
`);
// ================= COURSE PROGRESS =================

db.run(`
CREATE TABLE IF NOT EXISTS course_progress(
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER,
course TEXT,
module_completed INTEGER,
total_modules INTEGER,
completed INTEGER DEFAULT 0
)
`);


// ================= NOTIFICATIONS =================

db.run(`
CREATE TABLE IF NOT EXISTS notifications(
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER,
message TEXT,
date TEXT
)
`);

// ================= EMAIL CONFIG =================

const otpStore = new Map();

const transporter = nodemailer.createTransport({
service: "gmail",
auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS
}
});
transporter.verify(function (error, success) {
  if (error) {
    console.log("Email server error:", error);
  } else {
    console.log("Email server ready");
  }
});

// ================= FILE UPLOAD =================

const storage = multer.diskStorage({
destination: "./uploads/",
filename: (req,file,cb)=>{
cb(null,Date.now()+path.extname(file.originalname));
}
});

const upload = multer({storage});

app.use("/uploads",express.static("uploads"));


// ================= REGISTER =================

app.post("/api/register",async(req,res)=>{

const {name,email,password}=req.body;

const hashed=await bcrypt.hash(password,10);

db.run(
"INSERT INTO users(name,email,password,created_at) VALUES(?,?,?,?)",
  [name,email,hashed,new Date().toISOString()],
function(err){

if(err){
return res.status(400).json({message:"User exists"});
}

res.json({message:"Registered successfully"});
});

});


// ================= LOGIN =================
app.post("/api/login", async (req,res)=>{

const {email,password} = req.body;

/* ADMIN LOGIN */

if(email === ADMIN_EMAIL && password === ADMIN_PASSWORD){

const token = jwt.sign(
{role:"admin"},
SECRET_KEY,
{expiresIn:"1h"}
);

return res.json({
token,
role:"admin",
name:"Admin"
});
}

/* STUDENT LOGIN */

db.get("SELECT * FROM users WHERE email=?",[email],async(err,user)=>{

if(!user) return res.status(400).json({message:"Invalid credentials"});

const valid = await bcrypt.compare(password,user.password);

if(!valid) return res.status(400).json({message:"Invalid credentials"});

const token = jwt.sign(
{id:user.id,role:"student"},
SECRET_KEY,
{expiresIn:"1h"}
);

res.json({
token,
role:"student",
name:user.name,
email:user.email,
userId:user.id
});

});

});


// ================= SEND OTP =================

app.post("/api/send-otp", async (req, res) => {

const { email } = req.body;

if (!email) {
return res.status(400).json({ message: "Email required" });
}

const otp = Math.floor(100000 + Math.random() * 900000).toString();

otpStore.set(email, otp);

try {

await transporter.sendMail({
from: `"SkillForge" <${process.env.EMAIL_USER}>`,
to: email,
subject: "Verify Your SkillForge Account",
html: `
<div style="font-family:Arial,sans-serif;background:#f4f6fb;padding:40px">

<div style="max-width:600px;margin:auto;background:white;border-radius:12px;padding:35px">

<h2 style="color:#4f46e5;margin-bottom:10px">SkillForge</h2>

<p style="font-size:16px;color:#333">
Hello Learner,
</p>

<p style="font-size:15px;color:#555">
Welcome to <b>SkillForge</b>.  
Use the verification code below to complete your account setup.
</p>

<div style="
background:#eef2ff;
padding:20px;
text-align:center;
font-size:28px;
font-weight:bold;
letter-spacing:4px;
color:#4f46e5;
border-radius:8px;
margin:25px 0;
">
${otp}
</div>

<p style="font-size:14px;color:#666">
This OTP will expire in <b>5 minutes</b>.  
Do not share this code with anyone.
</p>

<hr style="margin:30px 0;border:none;border-top:1px solid #eee">

<p style="font-size:13px;color:#888">
If you did not request this verification, please ignore this email.
</p>

<p style="font-size:13px;color:#888">
© ${new Date().getFullYear()} SkillForge Learning Platform
</p>

</div>
</div>
`
});

res.json({ message: "OTP sent successfully" });

} catch (error) {

console.error(error);
res.status(500).json({ message: "Failed to send OTP" });

}

});


// ================= VERIFY OTP =================

app.post("/api/verify-otp", (req, res) => {

const { email, otp } = req.body;

const storedOtp = otpStore.get(email);

if (!storedOtp) {
return res.status(400).json({ message: "OTP expired or not requested" });
}

if (storedOtp !== otp) {
return res.status(400).json({ message: "Invalid OTP" });
}

otpStore.delete(email);

res.json({ verified: true });

});


// ================= PROFILE SAVE =================

app.post("/api/profile", upload.single("photo"), (req,res)=>{

const token = req.headers.authorization?.split(" ")[1];
if(!token) return res.status(401).json({message:"Unauthorized"});

const decoded = jwt.verify(token,SECRET_KEY);
const userId = decoded.id;

const {
phone,
dob,
gender,
education,
university,
skills,
interests,
github,
linkedin,
bio
} = req.body;

const photo = req.file ? req.file.path : null;

db.run(`
INSERT OR REPLACE INTO profiles
(user_id,phone,dob,gender,education,university,skills,interests,github,linkedin,bio,photo)
VALUES(?,?,?,?,?,?,?,?,?,?,?,?)
`,
[
userId,
phone,
dob,
gender,
education,
university,
skills,
interests,
github,
linkedin,
bio,
photo
],
(err)=>{
if(err) return res.status(500).json({message:"Profile save error"});
res.json({message:"Profile updated"});
});

});

// ================= GET PROFILE =================

app.get("/api/profile",(req,res)=>{

const token=req.headers.authorization?.split(" ")[1];
if(!token) return res.status(401).json({message:"Unauthorized"});

const decoded=jwt.verify(token,SECRET_KEY);

db.get(
"SELECT * FROM profiles WHERE user_id=?",
[decoded.id],
(err,row)=>{

if(err) return res.status(500).json({message:"Error"});
res.json(row);

});

});


// ================= SAVE TEST RESULT =================

app.post("/api/save-test-result",(req,res)=>{

const token=req.headers.authorization?.split(" ")[1];
if(!token) return res.status(401).json({message:"Unauthorized"});

const decoded=jwt.verify(token,SECRET_KEY);

const {score,total,weakest_domain}=req.body;

const date=new Date().toISOString();

db.run(
"INSERT INTO test_results(user_id,score,total,weakest_domain,date) VALUES(?,?,?,?,?)",
[decoded.id,score,total,weakest_domain,date],
()=>{

const percentage = (score/total)*100;

if(percentage >= 60){

db.run(`
INSERT INTO certificates(user_id,course,date)
VALUES(?,?,?)
`,
[decoded.id,"AI Course",date]);

transporter.sendMail({

from:`"SkillForge" <${process.env.EMAIL_USER}>`,

to:req.headers.email,

subject:"🎉 Certificate Earned",

html:`
<h2>Congratulations!</h2>
<p>You successfully completed the course.</p>
<p>Your certificate is now available in your dashboard.</p>
`

});

}

res.json({message:"Saved"});

}
);

});


// ================= PERFORMANCE =================

app.get("/api/performance",(req,res)=>{

const token=req.headers.authorization?.split(" ")[1];
if(!token) return res.status(401).json({message:"Unauthorized"});

const decoded=jwt.verify(token,SECRET_KEY);

db.all(
"SELECT * FROM test_results WHERE user_id=?",
[decoded.id],
(err,rows)=>{

if(err) return res.status(500).json({message:"Error"});
res.json(rows);

});

});


// ================= LEADERBOARD =================

app.get("/api/leaderboard",(req,res)=>{

db.all(`
SELECT users.name,
SUM(test_results.score) as total_score
FROM test_results
JOIN users ON users.id=test_results.user_id
GROUP BY users.id
ORDER BY total_score DESC
LIMIT 10
`,
(err,rows)=>{
res.json(rows);
});

});
app.post("/api/enroll-course", async (req, res) => {

const token = req.headers.authorization?.split(" ")[1];
if(!token) return res.status(401).json({message:"Please login again"});

let decoded;

try{
decoded = jwt.verify(token, SECRET_KEY);
}catch{
return res.status(401).json({message:"Session expired"});
}

const userId = decoded.id;
const { course } = req.body;

if(!course){
return res.status(400).json({message:"Course name missing"});
}

/* GET USER EMAIL */

db.get("SELECT email FROM users WHERE id=?", [userId], (err,user)=>{

if(err || !user){
return res.status(404).json({message:"User email does not exist"});
}

const email = user.email;

/* CHECK IF ALREADY ENROLLED */

db.get(
"SELECT * FROM course_progress WHERE user_id=? AND course=?",
[userId,course],
async (err,row)=>{

if(row){
return res.status(400).json({
message:"You are already enrolled in this course"
});
}

/* INSERT ENROLLMENT */

db.run(
`INSERT INTO course_progress
(user_id,course,module_completed,total_modules,completed)
VALUES(?,?,?,?,?)`,
[userId,course,0,5,0],
async (err)=>{

if(err){
return res.status(500).json({message:"Enrollment failed"});
}

/* SEND EMAIL (YOUR SAME TEMPLATE) */

try{

const info = await transporter.sendMail({
from: `"SkillForge" <${process.env.EMAIL_USER}>`,
to: email,
subject: "Course Enrollment Confirmation",
html: `
<div style="font-family:Arial,sans-serif;background:#f4f6fb;padding:40px">

<div style="max-width:600px;margin:auto;background:white;border-radius:12px;padding:35px">

<h2 style="color:#4f46e5;margin-bottom:10px">SkillForge</h2>

<p style="font-size:16px;color:#333">
Hello Learner,
</p>

<p style="font-size:15px;color:#555">
You have successfully enrolled in the following course:
</p>

<div style="
background:#eef2ff;
padding:18px;
border-radius:8px;
margin:20px 0;
font-size:18px;
font-weight:600;
color:#4f46e5;
">
${course}
</div>

<p style="font-size:15px;color:#555">
Start learning now and track your progress through adaptive tests and personalized insights.
</p>

<a href="http://localhost:5500/dashboard.html"
style="
display:inline-block;
margin-top:20px;
background:#4f46e5;
color:white;
padding:12px 22px;
border-radius:8px;
text-decoration:none;
font-weight:600;
">
Go to Dashboard
</a>

<hr style="margin:30px 0;border:none;border-top:1px solid #eee">

<p style="font-size:13px;color:#888">
Happy Learning!  
<b>Team SkillForge</b>
</p>

<p style="font-size:12px;color:#aaa">
© ${new Date().getFullYear()} SkillForge AI Learning Platform
</p>

</div>
</div>
`
});

console.log("Mail sent:", info.response);

}catch(emailErr){
console.log("Email error:", emailErr);
}

res.json({message:"Course enrolled successfully"});

});

});

});

});
// ================= UPDATE COURSE PROGRESS =================

app.post("/api/update-progress",(req,res)=>{

const token=req.headers.authorization?.split(" ")[1];
if(!token) return res.status(401).json({message:"Unauthorized"});

const decoded=jwt.verify(token,SECRET_KEY);

const {course,module_completed,total_modules}=req.body;

const completed = module_completed >= total_modules ? 1 : 0;

db.run(`
INSERT OR REPLACE INTO course_progress(user_id,course,module_completed,total_modules,completed)
VALUES(?,?,?,?,?)
`,
[decoded.id,course,module_completed,total_modules,completed],
()=>{

if(completed){

db.run(`
INSERT INTO notifications(user_id,message,date)
VALUES(?,?,?)
`,
[
decoded.id,
`You completed the course: ${course}`,
new Date().toISOString()
]);

}

res.json({message:"Progress updated"});

});

});
// ================= GET COURSE PROGRESS =================

app.get("/api/course-progress/:course",(req,res)=>{

const token=req.headers.authorization?.split(" ")[1];
if(!token) return res.status(401).json({message:"Unauthorized"});

const decoded=jwt.verify(token,SECRET_KEY);

const course=req.params.course;

db.get(
"SELECT * FROM course_progress WHERE user_id=? AND course=?",
[decoded.id,course],
(err,row)=>{

res.json(row);

});

});
// ================= ADAPTIVE TEST QUESTIONS =================

app.get("/api/adaptive-test/:course",(req,res)=>{

const course=req.params.course;

const questions={

"Machine Learning":[
{q:"What is supervised learning?",level:"easy"},
{q:"What is overfitting?",level:"medium"},
{q:"Explain gradient descent.",level:"hard"}
],

"Deep Learning":[
{q:"What is a neural network?",level:"easy"},
{q:"What is backpropagation?",level:"medium"},
{q:"Explain CNN architecture.",level:"hard"}
],

"NLP":[
{q:"What is tokenization?",level:"easy"},
{q:"What is stemming?",level:"medium"},
{q:"Explain transformers.",level:"hard"}
]

};

res.json(questions[course] || []);

});
// ================= AI RECOMMENDATIONS =================

app.get("/api/recommendations",(req,res)=>{

const token=req.headers.authorization?.split(" ")[1];
if(!token) return res.status(401).json({message:"Unauthorized"});

const decoded=jwt.verify(token,SECRET_KEY);

db.get(`
SELECT weakest_domain
FROM test_results
WHERE user_id=?
ORDER BY date DESC
LIMIT 1
`,
[decoded.id],
(err,row)=>{

if(!row){
return res.json({recommendations:[]});
}

const map={

"math":[
"Linear Algebra Basics",
"Probability for ML"
],

"coding":[
"Python for AI",
"Data Structures"
],

"machine learning":[
"Model Evaluation",
"Feature Engineering"
]

};

res.json({
weak_topic:row.weakest_domain,
recommendations:map[row.weakest_domain] || []
});

});

});
// ================= GET NOTIFICATIONS =================

app.get("/api/notifications",(req,res)=>{

const token=req.headers.authorization?.split(" ")[1];
if(!token) return res.status(401).json({message:"Unauthorized"});

const decoded=jwt.verify(token,SECRET_KEY);

db.all(
"SELECT * FROM notifications WHERE user_id=? ORDER BY date DESC",
[decoded.id],
(err,rows)=>{

res.json(rows);

});

});
// ================= SEARCH USERS =================

app.get("/api/search-users",(req,res)=>{

const q=req.query.q;

db.all(
"SELECT id,name,email FROM users WHERE name LIKE ?",
[`%${q}%`],
(err,rows)=>{

res.json(rows);

});

});
// ================= ADD FRIEND =================

app.post("/api/add-friend",(req,res)=>{

const {userId,friendId}=req.body;

db.run(
"INSERT INTO friends(user_id,friend_id) VALUES(?,?)",
[userId,friendId],
()=>{

res.json({message:"Friend added"});

});

});
// ================= GET FRIENDS =================

app.get("/api/friends/:id",(req,res)=>{

const id=req.params.id;

db.all(`
SELECT users.id,users.name
FROM friends
JOIN users ON users.id=friends.friend_id
WHERE friends.user_id=?
`,
[id],
(err,rows)=>{

res.json(rows);

});

});
app.get("/api/profile-stats/:userId",(req,res)=>{

const userId=req.params.userId;

db.get(
"SELECT COUNT(*) as enrolled FROM test_results WHERE user_id=?",
[userId],
(err,enrolled)=>{

db.get(
"SELECT COUNT(*) as certificates FROM certificates WHERE user_id=?",
[userId],
(err,certs)=>{

db.get(
`SELECT rank FROM (
SELECT user_id,
RANK() OVER (ORDER BY SUM(score) DESC) rank
FROM test_results
GROUP BY user_id
) WHERE user_id=?`,
[userId],
(err,rank)=>{

res.json({
enrolled: enrolled?.enrolled || 0,
completed: certs?.certificates || 0,
certificates: certs?.certificates || 0,
rank: rank?.rank || "-"
});

});

});

});

});
app.get("/api/admin/stats",(req,res)=>{

db.get("SELECT COUNT(*) as users FROM users",(e,u)=>{
db.get("SELECT COUNT(*) as courses FROM courses",(e,c)=>{
db.get("SELECT COUNT(*) as tests FROM test_results",(e,t)=>{
db.get("SELECT COUNT(*) as feedback FROM feedback",(e,f)=>{
db.get("SELECT COUNT(*) as enrollments FROM course_progress",(e,en)=>{

res.json({
users:u.users,
courses:c.courses,
tests:t.tests,
feedback:f.feedback,
enrollments:en.enrollments
});

});
});
});
});
});

});
app.post("/api/admin/add-course", upload.single("video"), (req,res)=>{

const {title,description,category} = req.body;

const video = req.file ? req.file.path : null;

db.run(
"INSERT INTO courses(title,description,category,video) VALUES(?,?,?,?)",
[title,description,category,video],
(err)=>{
if(err) return res.status(500).json({message:"Error"});
res.json({message:"Course added"});
}
);

});
app.get("/api/admin/courses",(req,res)=>{

db.all("SELECT * FROM courses",(err,rows)=>{
res.json(rows);
});

});
app.delete("/api/admin/course/:id",(req,res)=>{

db.run(
"DELETE FROM courses WHERE id=?",
[req.params.id],
()=>res.json({message:"Course deleted"})
);

});
app.post("/api/admin/add-question",(req,res)=>{

const {
course,
question,
option1,
option2,
option3,
option4,
answer
} = req.body;

db.run(`
INSERT INTO quizzes
(course,question,option1,option2,option3,option4,answer)
VALUES(?,?,?,?,?,?,?)
`,
[course,question,option1,option2,option3,option4,answer],
()=>res.json({message:"Question added"})
);

});
app.get("/api/admin/questions/:course",(req,res)=>{

db.all(
"SELECT * FROM quizzes WHERE course=?",
[req.params.course],
(err,rows)=>res.json(rows)
);

});
app.delete("/api/admin/question/:id",(req,res)=>{

db.run(
"DELETE FROM quizzes WHERE id=?",
[req.params.id],
()=>res.json({message:"Deleted"})
);

});
app.get("/api/quiz/:course",(req,res)=>{

db.all(
`SELECT * FROM quizzes
WHERE course=?
ORDER BY RANDOM()
LIMIT 20`,
[req.params.course],
(err,rows)=>res.json(rows)
);

});
app.get("/api/admin/course-stats",(req,res)=>{

db.all(`
SELECT course,COUNT(*) as students
FROM course_progress
GROUP BY course
`,(err,rows)=>{

res.json(rows);

});

});
app.post("/api/feedback",(req,res)=>{

const token=req.headers.authorization?.split(" ")[1];
const decoded=jwt.verify(token,SECRET_KEY);

const {course,message}=req.body;

db.run(
"INSERT INTO feedback(user_id,course,message,date) VALUES(?,?,?,?)",
[decoded.id,course,message,new Date().toISOString()],
()=>res.json({message:"Feedback submitted"})
);

});
app.get("/api/admin/feedback",(req,res)=>{

db.all(`
SELECT feedback.*,users.name
FROM feedback
JOIN users ON feedback.user_id=users.id
ORDER BY date DESC
`,
(err,rows)=>res.json(rows)
);

});
app.delete("/api/delete-account", (req, res) => {

const token = req.headers.authorization?.split(" ")[1];
if(!token) return res.status(401).json({message:"Unauthorized"});

let decoded;

try{
decoded = jwt.verify(token, SECRET_KEY);
}catch{
return res.status(401).json({message:"Invalid token"});
}

const userId = decoded.id;

db.serialize(()=>{

db.run("DELETE FROM users WHERE id=?", [userId]);
db.run("DELETE FROM profiles WHERE user_id=?", [userId]);
db.run("DELETE FROM test_results WHERE user_id=?", [userId]);
db.run("DELETE FROM certificates WHERE user_id=?", [userId]);
db.run("DELETE FROM feedback WHERE user_id=?", [userId]);
db.run("DELETE FROM course_progress WHERE user_id=?", [userId]);
db.run("DELETE FROM notifications WHERE user_id=?", [userId]);

res.json({message:"Account deleted successfully"});

});

});
app.get("/api/admin/analytics/users", (req,res)=>{

db.all(`
SELECT substr(created_at,1,7) as month, COUNT(*) as count
FROM users
GROUP BY month
ORDER BY month
`,(err,rows)=>{
res.json(rows);
});

});
app.get("/api/admin/analytics/courses",(req,res)=>{

db.all(`
SELECT course, COUNT(*) as students
FROM course_progress
GROUP BY course
ORDER BY students DESC
`,(err,rows)=>{
res.json(rows);
});

});
app.get("/api/admin/analytics/tests",(req,res)=>{

db.all(`
SELECT date, (score*100.0/total) as percentage
FROM test_results
ORDER BY date
`,(err,rows)=>{
res.json(rows);
});

});
// ================= START SERVER =================

const PORT=5000;

app.listen(PORT,()=>{
console.log("SkillForge backend running on port "+PORT);
});
