import mongoose from 'mongoose';

/**
 * Schema for a QuizResult document.
 * Stores summary of a user's quiz submission, including:
 * - Final score and pass status
 * - Reference to the attempt
 * - Per-question breakdown (graded feedback)
 */
const quizResultSchema = new mongoose.Schema({
  quizId: {
    type: String,
    ref: 'Quiz', // Link to the quiz
    required: true
  },
  userId: {
    type: String,
    ref: 'User', // Link to the user who took the quiz
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  maxScore: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  attemptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuizAttempt',
    required: true
  },
  submittedAt: {
    type: Date,
    required: true
  },

  //Detailed feedback for each question
  breakdown: [
    {
      questionId: {
        type: String,
        required: true
      },
      correct: {
        type: Boolean,
        required: true
      },
      selectedAnswer: mongoose.Schema.Types.Mixed,  // index, bool, or string
      correctAnswer: mongoose.Schema.Types.Mixed,   // varies by type
      pointsEarned: {
        type: Number,
        required: true
      },
      pointsPossible: {
        type: Number,
        required: true
      }
    }
  ]
}, { timestamps: true }); // Adds createdAt, updatedAt

const QuizResult = mongoose.model('QuizResult', quizResultSchema);
export default QuizResult;
