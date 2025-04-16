import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const QuizSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    title: {
      type: String,
      required: true,
      default: "New Quiz",
    },
    description: {
      type: String,
      default: "",
    },
    quizType: {
      type: String,
      enum: [
        "Graded Quiz",
        "Practice Quiz",
        "Graded Survey",
        "Ungraded Survey",
      ],
      default: "Graded Quiz",
    },
    assignmentGroup: {
      type: String,
      enum: ["Quizzes", "Exams", "Assignments", "Project"],
      default: "Quizzes",
    },
    shuffleAnswers: {
      type: Boolean,
      default: true,
    },
    timeLimit: {
      type: Number, // in minutes
      default: 20,
    },
    multipleAttempts: {
      type: Boolean,
      default: false,
    },
    howManyAttempts: {
      type: Number,
      default: 1,
    },
    showCorrectAnswers: {
      type: Boolean,
      default: false,
    },
    accessCode: {
      type: String,
      default: "",
    },
    oneQuestionAtATime: {
      type: Boolean,
      default: true,
    },
    webcamRequired: {
      type: Boolean,
      default: false,
    },
    lockQuestionsAfterAnswering: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
    },
    availableDate: {
      type: Date,
    },
    untilDate: {
      type: Date,
    },
    published: {
      type: Boolean,
      default: false,
    },
    // A quiz belongs to one course (one-to-many)
    courseId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", QuizSchema);

export default Quiz;
