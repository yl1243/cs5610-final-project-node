import Question from "../Database/questions.js";

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
    // Force the question type to multiple-choice
    data.questionType = "multiple-choice";
    const question = new Question(data);
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
    // Force the question type to true-false
    data.questionType = "true-false";
    const question = new Question(data);
    await question.save();
    return question;
  } catch (error) {
    throw new Error(`Error creating true/false question: ${error.message}`);
  }
}

// Create a fill-in-blank question
export async function createFillInBlankQuestion(data) {
  try {
    // Force the question type to fill-in-blank
    data.questionType = "fill-in-blank";
    const question = new Question(data);
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

// Update a question by its ID
export async function updateQuestion(questionId, data) {
  try {
    return await Question.findByIdAndUpdate(questionId, data, { new: true });
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
