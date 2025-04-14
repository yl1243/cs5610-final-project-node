import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  _id: String,  
  title: String,
  course: String,
  dueDate: String,
  availableFromDate: String,
  availableTilDate: String,
  points: Number,
  numQuestions: Number,
  description: String,
  quizType: String,
  assignmentGroup: String,
  shuffleAnswers: Boolean,
  timeLimit: Number,
  multipleAttempts: Boolean,
  attempts: Number,
  showCorrectAnswers: Boolean,
  accessCode: String,
  oneQAtATime: Boolean,
  webcamRequired: Boolean,
  lockQAfterAnswer: Boolean,
  published: { type: Boolean, default: false }
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
