import express from "express";
import {
  createQuestion,
  createMultipleChoiceQuestion,
  createTrueFalseQuestion,
  createFillInBlankQuestion,
  getQuestionById,
  getQuestionsForQuiz,
  updateQuestion,
  deleteQuestion,
  countQuestionsForQuiz,
} from "./dao.js";

const router = express.Router();

//GET /api/quizzes/:quizId/questions
//Retrieve all questions for a particular quiz.
router.get("/api/quizzes/:quizId/questions", async (req, res) => {
  try {
    const { quizId } = req.params;
    const questions = await getQuestionsForQuiz(quizId);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//POST /api/quizzes/:quizId/questions
//Create a new generic question for a quiz.
router.post("/api/quizzes/:quizId/questions", async (req, res) => {
  try {
    const { quizId } = req.params;
    const data = req.body;
    data.quizId = quizId;
    const question = await createQuestion(data);
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//GET /api/questions/:questionId
//Retrieve a specific question by its ID.
router.get("/api/questions/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await getQuestionById(questionId);
    if (!question) return res.status(404).json({ error: "Question not found" });
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//PUT /api/questions/:questionId
//Update an existing question.
router.put("/api/questions/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;
    const data = req.body;
    const updated = await updateQuestion(questionId, data);
    if (!updated) return res.status(404).json({ error: "Question not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//DELETE /api/questions/:questionId
//Delete a question by its ID.
router.delete("/api/questions/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;
    const deleted = await deleteQuestion(questionId);
    if (!deleted) return res.status(404).json({ error: "Question not found" });
    res.json(deleted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//POST /api/questions/multiple-choice
//Create a multiple choice question.
router.post("/api/questions/multiple-choice", async (req, res) => {
  try {
    const data = req.body;
    const question = await createMultipleChoiceQuestion(data);
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//POST /api/questions/true-false
//Create a true/false question.
router.post("/api/questions/true-false", async (req, res) => {
  try {
    const data = req.body;
    const question = await createTrueFalseQuestion(data);
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//POST /api/questions/fill-in-blank
//Create a fill-in-blank question.
router.post("/api/questions/fill-in-blank", async (req, res) => {
  try {
    const data = req.body;
    const question = await createFillInBlankQuestion(data);
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//GET /api/quizzes/:quizId/questions/count
//Retrieve the count of questions for a particular quiz.
router.get("/api/quizzes/:quizId/questions/count", async (req, res) => {
  try {
    const { quizId } = req.params;
    const count = await countQuestionsForQuiz(quizId);
    res.json({ count });
  } catch (error) {
    console.error("Error fetching question count:", error);
    res.status(500).json({ error: error.message });
  }
});

export default (app) => {
  app.use(router);
};
