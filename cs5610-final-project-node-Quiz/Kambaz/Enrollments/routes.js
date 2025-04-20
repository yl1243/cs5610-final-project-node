import * as enrollmentsDao from "../Enrollments/dao.js";

export default function EnrollmentRoutes(app) {
    const unenrollCourseForCurrentUser = (req, res) => {
        const { enrollmentId } = req.params;
        enrollmentsDao.unenrollUserInCourse(enrollmentId);
        res.sendStatus(204);
      };
      
    const enrollCourseForUser = (req, res) => {
      const {userId, courseId} = req.body;
      res.json(enrollmentsDao.enrollUserInCourse(userId, courseId));

    }
    const unenrollCourseForUser = (req, res) => {
      const {userId, courseId} = req.body;
      res.json(enrollmentsDao.unenrollUserFromCourse(userId, courseId));
    }
    app.delete("/api/enrollments/:enrollmentId", unenrollCourseForCurrentUser);
    app.put("/api/enrollments/enroll", enrollCourseForUser);
    app.put("/api/enrollments/unenroll", unenrollCourseForUser);
}