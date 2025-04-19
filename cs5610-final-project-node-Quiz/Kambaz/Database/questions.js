import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const QuestionSchema = new mongoose.Schema(
  {
    // Use UUID for the question’s primary key
    _id: {
      type: String,
      default: uuidv4,
    },

    // Parent quiz reference
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

    // Multiple-choice options
    choices: [
      {
        _id: false, // disable Mongo’s ObjectId
        id: {
          type: String,
          default: uuidv4, // your UUID string
        },
        text: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // True/false answer — only required when questionType is 'true-false'
    correctAnswer: {
      _id: false,
      id: {
        type: String,
        default: uuidv4,
      },
      value: {
        type: Boolean,
        required: function () {
          return this.questionType === "true-false";
        },
      },
    },

    // Fill-in-the-blank answers — must have at least one when questionType is 'fill-in-blank'
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
      validate: {
        validator: function (arr) {
          if (this.questionType === "fill-in-blank") {
            return Array.isArray(arr) && arr.length > 0;
          }
          return true;
        },
        message: "fill-in-blank questions need at least one answer",
      },
    },

    // Editor-only possible answers
    possibleAnswers: [
      {
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
  },
  { timestamps: true }
);

export default mongoose.model("Question", QuestionSchema);