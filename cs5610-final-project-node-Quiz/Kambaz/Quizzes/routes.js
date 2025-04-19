import express from "express";
import {
  createQuiz,
  getQuizById,
  getQuizzesForCourse,
  updateQuiz,
  deleteQuiz,
  calculateTotalPoints,
  publishQuiz,
  unpublishQuiz,
  previewQuiz
} from "./dao.js";

const router = express.Router();

// Create a new quiz for a course
router.post("/api/courses/:courseId/quizzes", async (req, res) => {
  try {
    const { courseId } = req.params;
    const data = req.body;
    const quiz = await createQuiz(courseId, data);
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all quizzes for a given course
router.get("/api/courses/:courseId/quizzes", async (req, res) => {
  try {
    const { courseId } = req.params;
    const quizzes = await getQuizzesForCourse(courseId);
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single quiz by its ID
router.get("/api/quizzes/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await getQuizById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a quiz by its ID
router.put("/api/quizzes/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;
    const data = req.body;
    const updatedQuiz = await updateQuiz(quizId, data);
    if (!updatedQuiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a quiz by its ID
router.delete("/api/quizzes/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;
    const deletedQuiz = await deleteQuiz(quizId);
    if (!deletedQuiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(deletedQuiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get the total points for a quiz (sum of all question points)
router.get("/api/quizzes/:quizId/points", async (req, res) => {
  try {
    const { quizId } = req.params;
    const totalPoints = await calculateTotalPoints(quizId);
    res.json({ totalPoints });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Publish a quiz
router.put("/api/quizzes/:quizId/publish", async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await publishQuiz(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unpublish a quiz
router.put("/api/quizzes/:quizId/unpublish", async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await unpublishQuiz(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Preview a quiz
router.get("/api/quizzes/:quizId/preview", async (req, res) => {
  try {
    const { quizId } = req.params;
    const result = await previewQuiz(quizId);
    if (!result.quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export a function to attach these routes to your app
export default (app) => {
  app.use(router);
};
