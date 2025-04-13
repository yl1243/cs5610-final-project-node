import * as dao from "./dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function EnrollmentsRoutes(app) {

    app.get("/api/enrollments", (req, res) => {
        const enrollments = dao.findAllEnrollments();
        res.send(enrollments);
    });

    app.delete("/api/enrollments/:enrollmentId", (req, res) => {
        const { enrollmentId } = req.params;
        dao.deleteEnrollment(enrollmentId);
        res.sendStatus(204);
    });

    // get enrollments by course id
    app.get("/api/courses/:courseId/enrollments", (req, res) => {
        const { courseId } = req.params;
        const enrollments = enrollmentsDao.findEnrollmentsForCourse(courseId);
        res.json(enrollments);
    });

    // enroll coure for user
    app.post("/api/courses/:courseId/enrollments", (req, res) => {
        const { courseId } = req.params;
        const { userId } = req.body;
        const enrollment = enrollmentsDao.enrollUserInCourse(userId, courseId);
        res.json(enrollment);
    });


    // get enrollments by course id
    app.get("/api/courses/:courseId/enrollments", (req, res) => {
        const { courseId } = req.params;
        const enrollments = enrollmentsDao.findEnrollmentsForCourse(courseId);
        res.json(enrollments);
    });

    // 给user enroll
    app.post("/api/courses/:courseId/enrollments", (req, res) => {
        const { courseId } = req.params;
        const { userId } = req.body;
        const enrollment = enrollmentsDao.enrollUserInCourse(userId, courseId);
        res.json(enrollment);
    });

    // 查询某个用户的所有报名
    app.get("/api/enrollments/user/:userId", (req, res) => {
        const { userId } = req.params;
        const enrollments = dao.findEnrollmentsByUser(userId);
        res.json(enrollments);
    });

}