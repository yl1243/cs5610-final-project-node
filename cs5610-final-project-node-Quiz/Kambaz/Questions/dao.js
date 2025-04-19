import Question from "../Database/questions.js";
import { v4 as uuidv4 } from "uuid";

// Create a generic question (the payload should include quizId, title, points, questionText, questionType, etc.)
export async function createQuestion(data) {
  try {
    const question = new Question(data);
    await question.save();
    return question;
  } catch (error) {
    throw new Error(`Error creating question: ${error.message}`);
  }
}

// Create a multiple choice question
export async function createMultipleChoiceQuestion(data) {
  try {
    // Force the question type
    data.questionType = "multiple-choice";
    delete data.correctAnswer;
    delete data.answers;
    const question = new Question(data);
    question.correctAnswer = undefined;
    question.answers = [];
    await question.save();
    return question;
  } catch (error) {
    throw new Error(
      `Error creating multiple choice question: ${error.message}`
    );
  }
}

// Create a true/false question
export async function createTrueFalseQuestion(data) {
  try {
    data.questionType = "true-false";
    // remove irrelevant fields
    delete data.choices;
    delete data.answers;
    const question = new Question(data);
    // ensure no stray fields
    question.choices = [];
    question.answers = [];
    await question.save();
    return question;
  } catch (error) {
    throw new Error(`Error creating true/false question: ${error.message}`);
  }
}

// Create a fill-in-blank question
export async function createFillInBlankQuestion(data) {
  try {
    data.questionType = "fill-in-blank";
    // remove irrelevant fields
    delete data.choices;
    delete data.correctAnswer;
    const question = new Question(data);
    // ensure no stray fields
    question.choices = [];
    question.correctAnswer = undefined;
    await question.save();
    return question;
  } catch (error) {
    throw new Error(`Error creating fill-in-blank question: ${error.message}`);
  }
}

// Get a question by its ID
export async function getQuestionById(questionId) {
  try {
    return await Question.findById(questionId);
  } catch (error) {
    throw new Error(`Error fetching question: ${error.message}`);
  }
}

// Get all questions for a given quiz
export async function getQuestionsForQuiz(quizId) {
  try {
    return await Question.find({ quizId });
  } catch (error) {
    throw new Error(`Error fetching questions for quiz: ${error.message}`);
  }
}

// Add auto‑removing irrelevant fields for the current questionType.
// mongoDB always returns the fields, even if they are not relevant and not created, disgusting
export async function updateQuestion(questionId, data) {
  try {
    // 1) Load the existing document
    const question = await Question.findById(questionId);
    if (!question) {
      return null;
    }
    // 2) Overwrite simple fields if provided
    const updatableFields = [
      "title",
      "points",
      "questionText",
      "questionType",
      "choices",
      "correctAnswer",
      "answers",
    ];
    updatableFields.forEach((field) => {
      if (data[field] !== undefined) {
        question[field] = data[field];
      }
    });
    // 3) Merge possibleAnswers, preserving or generating each id
    if (Array.isArray(data.possibleAnswers)) {
      question.possibleAnswers = data.possibleAnswers.map((ans) => ({
        id: ans.id || uuidv4(),
        value: ans.value ?? "",
      }));
    }
    // If this is NOT a true-false question, remove any correctAnswer
    if (question.questionType !== "true-false") {
      question.correctAnswer = undefined;
    }
    // If this is NOT a fill-in-blank question, clear any answers array
    if (question.questionType !== "fill-in-blank") {
      question.answers = [];
    }
    // 4) Save & return
    await question.save();
    return question;
  } catch (error) {
    throw new Error(`Error updating question: ${error.message}`);
  }
}

// Delete a question by its ID
export async function deleteQuestion(questionId) {
  try {
    return await Question.findByIdAndDelete(questionId);
  } catch (error) {
    throw new Error(`Error deleting question: ${error.message}`);
  }
}
// Count questions for a given quiz
export async function countQuestionsForQuiz(quizId) {
  try {
    return await Question.countDocuments({ quizId });
  } catch (error) {
    throw new Error(`Error counting questions for quiz: ${error.message}`);
  }
}