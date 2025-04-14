import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// 🔌 Route Modules (organized by feature)
import quizRoutes from './Quizzes/routes.js';
import quizAttemptRoutes from './QuizAttempts/routes.js';
import quizResultRoutes from './QuizResults/routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ==========================
// 🌐 Global Middleware
// ==========================
app.use(cors());
app.use(express.json());

// ==========================
// 🛢️ MongoDB Connection
// ==========================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ==========================
// 🔎 Health Check Routes
// ==========================
app.get('/', (req, res) => {
  res.send('KANBAS Backend is running!');
});

// Optional test route for API confirmation
app.get('/api/quizzes/test', (req, res) => {
  res.send('✅ Hello from quizzes test');
});

// ==========================
// 🚦 Feature Routes
// ==========================

// Quiz Management: metadata, publish, preview
app.use('/api/quizzes', quizRoutes);

// Quiz Attempts: start/submit/view attempts
app.use('/api/quiz-attempts', quizAttemptRoutes);

// Quiz Results: final score + breakdowns
app.use('/api/quiz-results', quizResultRoutes);

// ==========================
// 🚀 Start Server
// ==========================
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
