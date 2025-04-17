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
        _id: false, // disable Mongoose ObjectId
        id: {
          type: String,
          default: uuidv4,
        },
        text: { type: String },
        isCorrect: { type: Boolean, default: false },
      },
    ],
    correctAnswer: {
      _id: false,
      id: {
        type: String,
        default: uuidv4,
      },
      value: {
        type: Boolean,
        required: true,
      },
    },
    // For fill-in-the-blank questions:
    answers: {
      type: [
        {
          _id: false,
          id: {
            type: String,
            default: uuidv4,
          },
          value: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
    // For question editing:
    possibleAnswers: {
      type: [
        {
          //disable Mongoose auto‐id on each subdoc
          _id: false,
          id: {
            type: String,
            default: uuidv4,
          },
          value: {
            type: String,
            default: "",
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", QuestionSchema);

export default Question;
