import { requireRole } from "../Middleware/authorization.js";
export default function QuizRoutes(app) {
    app.get("/api/quizzes", async (req, res) => {
        res.json([{ id: "q1", title: "Demo Quiz" }]);
    });

    app.post("/api/quizzes/:qid/submit", requireRole("STUDENT"), async (req, res) => {
        res.json({ message: `Submission received for quiz ${req.params.qid}` });
    });

    app.get("/api/quizzes/:qid/grade", requireRole("STUDENT"), async (req, res) => {
        res.json({ message: `Grade for quiz ${req.params.qid}: 95 (demo)` });
    });

    app.post("/api/quizzes", requireRole("FACULTY"), async (req, res) => {
        res.json({ message: "Quiz created (demo)" });
    });

    app.put("/api/quizzes/:qid", requireRole("FACULTY"), async (req, res) => {
        res.json({ message: `Quiz ${req.params.qid} updated (demo)` });
    });

    app.delete("/api/quizzes/:qid", requireRole("FACULTY"), async (req, res) => {
        res.json({ message: `Quiz ${req.params.qid} deleted (demo)` });
    });
}


// import { requireRole } from "../Middleware/authorization.js";

// export default function QuizRoutes(app) {



//     // ✅ 所有人都能访问：查看 quiz 列表
//     app.get("/api/quizzes", async (req, res) => {
//         const quizzes = await dao.findAllQuizzes();
//         res.json(quizzes);
//     });

//     // ✅ 学生提交 quiz
//     app.post("/api/quizzes/:qid/submit", requireRole("STUDENT"), async (req, res) => {
//         const submission = await dao.submitQuiz(req.params.qid, req.body.answers, req.session["currentUser"]._id);
//         res.json(submission);
//     });

//     // ✅ 学生查看自己答题分数
//     app.get("/api/quizzes/:qid/grade", requireRole("STUDENT"), async (req, res) => {
//         const grade = await dao.findGradeForUser(req.params.qid, req.session["currentUser"]._id);
//         res.json(grade);
//     });

//     // ❌ 以下仅限 FACULTY
//     // create quizzes
//     app.post("/api/quizzes", requireRole("FACULTY"), async (req, res) => {
//         const quiz = await dao.createQuiz({ ...req.body, createdBy: req.session["currentUser"]._id });
//         res.json(quiz);
//     });

//     // update quizzes
//     app.put("/api/quizzes/:qid", requireRole("FACULTY"), async (req, res) => {
//         const status = await dao.updateQuiz(req.params.qid, req.body);
//         res.json(status);
//     });

//     // delete quizzes
//     app.delete("/api/quizzes/:qid", requireRole("FACULTY"), async (req, res) => {
//         const status = await dao.deleteQuiz(req.params.qid);
//         res.json(status);
//     });
// }