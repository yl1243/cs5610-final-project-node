// py的
import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
    // 获取所有作业
    app.get("/api/assignments", (req, res) => {
        const assignments = assignmentsDao.findAllAssignments();
        res.json(assignments);
    });

    // 获取特定课程的所有作业
    app.get("/api/courses/:courseId/assignments", (req, res) => {
        const { courseId } = req.params;
        const assignments = assignmentsDao.findAssignmentsForCourse(courseId);
        res.json(assignments);
    });

    // 获取特定作业
    app.get("/api/assignments/:assignmentId", (req, res) => {
        const { assignmentId } = req.params;
        const assignment = assignmentsDao.findAssignmentById(assignmentId);
        if (assignment) {
            res.json(assignment);
        } else {
            res.status(404).json({ message: "Assignment not found" });
        }
    });

    // 创建新作业
    app.post("/api/courses/:courseId/assignments", (req, res) => {
        const { courseId } = req.params;
        const newAssignment = {
            ...req.body,
            course: courseId,
        };
        const createdAssignment = assignmentsDao.createAssignment(newAssignment);
        res.json(createdAssignment);
    });

    // 更新作业
    app.put("/api/assignments/:assignmentId", (req, res) => {
        const { assignmentId } = req.params;
        const status = assignmentsDao.updateAssignment(assignmentId, req.body);
        if (status) {
            res.json(status);
        } else {
            res.status(404).json({ message: "Assignment not found" });
        }
    });

    // 删除作业
    app.delete("/api/assignments/:assignmentId", (req, res) => {
        const { assignmentId } = req.params;
        const status = assignmentsDao.deleteAssignment(assignmentId);
        if (status) {
            res.sendStatus(204);
        } else {
            res.status(404).json({ message: "Assignment not found" });
        }
    });
}

// // 旧的
// import * as assignmentsDao from "./dao.js";

// export default function AssignmentRoutes(app) {
//     // update assignment
//     app.put("/api/assignments/:assignmentId", (req, res) => {
//         const { assignmentId } = req.params;
//         const assignmentUpdates = req.body;

//         console.log("assignmentId, ", assignmentId);
//         console.log("assignmentUpdates, ", assignmentUpdates);

//         assignmentsDao.updateAssignment(assignmentId, assignmentUpdates);
//         res.sendStatus(204);
//     });

//     // delete assignment
//     app.delete("/api/assignments/:assignmentId", (req, res) => {
//         const { assignmentId } = req.params;
//         assignmentsDao.deleteAssignment(assignmentId);
//         res.sendStatus(204);
//     });
// }