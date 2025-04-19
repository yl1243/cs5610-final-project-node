import Quiz from "../Database/quizzes.js";
import Question from "../Database/questions.js";

// Create a new quiz and associate it with a course
export async function createQuiz(courseId, data) {
  try {
    const quiz = new Quiz({
      courseId,
      ...data,
    });
    await quiz.save();
    return quiz;
  } catch (error) {
    throw new Error(`Error creating quiz: ${error.message}`);
  }
}

// Get a single quiz by its ID
export async function getQuizById(quizId) {
  try {
    return await Quiz.findById(quizId);
  } catch (error) {
    throw new Error(`Error fetching quiz: ${error.message}`);
  }
}

// Get all quizzes for a given course
export async function getQuizzesForCourse(courseId, filter = {}) {
  try {
    const query = { courseId, ...filter };
    return await Quiz.find(query);
  } catch (error) {
    throw new Error(`Error fetching quizzes for course: ${error.message}`);
  }
}

// Update an existing quiz by its ID
export async function updateQuiz(quizId, data) {
  try {
    return await Quiz.findByIdAndUpdate(quizId, data, { new: true });
  } catch (error) {
    throw new Error(`Error updating quiz: ${error.message}`);
  }
}

// Delete a quiz by its ID
export async function deleteQuiz(quizId) {
  try {
    return await Quiz.findByIdAndDelete(quizId);
  } catch (error) {
    throw new Error(`Error deleting quiz: ${error.message}`);
  }
}

// Calculate total quiz points by summing the points of all its questions
export async function calculateTotalPoints(quizId) {
  try {
    const questions = await Question.find({ quizId });
    const totalPoints = questions.reduce(
      (sum, question) => sum + (question.points || 0),
      0
    );
    return totalPoints;
  } catch (error) {
    throw new Error(`Error calculating total points: ${error.message}`);
  }
}

// Publish a quiz
export async function publishQuiz(quizId) {
  try {
    return await Quiz.findByIdAndUpdate(quizId, { published: true }, { new: true });
  } catch (error) {
    throw new Error(`Error publishing quiz: ${error.message}`);
  }
}

// Unpublish a quiz
export async function unpublishQuiz(quizId) {
  try {
    return await Quiz.findByIdAndUpdate(quizId, { published: false }, { new: true });
  } catch (error) {
    throw new Error(`Error unpublishing quiz: ${error.message}`);
  }
}

//Preview a quiz and its questions.
export async function previewQuiz(quizId) {
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new Error("Quiz not found");

    const questions = await Question.find(
      { quizId },
      { 
        title: 1, 
        points: 1, 
        questionText: 1, 
        questionType: 1, 
        choices: 1, 
        acceptedAnswers: 1,
        course: 1,
        quiz: 1 
      }
    );
    return { quiz, questions };
  } catch (error) {
    throw new Error(`Error previewing quiz: ${error.message}`);
  }
}

// Export
export default {
  createQuiz,
  getQuizById,
  getQuizzesForCourse,
  updateQuiz,
  deleteQuiz,
  calculateTotalPoints,
  publishQuiz,
  unpublishQuiz,
  previewQuiz
};
