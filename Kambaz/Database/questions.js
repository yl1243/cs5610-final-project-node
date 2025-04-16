import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const QuestionSchema = new mongoose.Schema(
  {
    // Custom _id field using UUID
    _id: {
      type: String,
      default: uuidv4,
    },
    // Link to the parent quiz (each quiz can have many questions)
    quizId: {
      type: String,
      ref: "Quiz",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      default: 1,
    },
    questionText: {
      type: String,
      required: true,
    },
    questionType: {
      type: String,
      enum: ["multiple-choice", "true-false", "fill-in-blank"],
      required: true,
    },
    // For multiple choice questions:
    choices: [
      {
        text: { type: String },
        isCorrect: { type: Boolean, default: false },
      },
    ],
    // For true/false questions:
    correctAnswer: {
      type: Boolean,
    },
    // For fill-in-the-blank questions:
    answers: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", QuestionSchema);

export default Question;
