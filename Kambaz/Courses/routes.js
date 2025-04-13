import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as assignmentsDao from "../Assignments/dao.js";


export default function CourseRoutes(app) {

    app.get("/api/courses", (req, res) => {
        const courses = dao.findAllCourses();
        res.send(courses);
    });

    // delete course
    app.delete("/api/courses/:courseId", (req, res) => {
        const { courseId } = req.params;
        const status = dao.deleteCourse(courseId);
        res.send(status);
    });

    // update course
    app.put("/api/courses/:courseId", (req, res) => {
        const { courseId } = req.params;
        const courseUpdates = req.body;
        const status = dao.updateCourse(courseId, courseUpdates);
        res.send(status);
    });


    // findmodules for course
    app.get("/api/courses/:courseId/modules", (req, res) => {
        const { courseId } = req.params;
        const modules = modulesDao.findModulesForCourse(courseId);
        res.json(modules);
    });

    // create module
    app.post("/api/courses/:courseId/modules", (req, res) => {
        const { courseId } = req.params;
        const module = {
            ...req.body,
            course: courseId,
        };
        const newModule = modulesDao.createModule(module);
        res.send(newModule);
    });

    // // HW5旧的 要加， py的不加
    // // get assignments by course id
    // app.get("/api/courses/:courseId/assignments", (req, res) => {
    //     const { courseId } = req.params;
    //     const assignments = assignmentsDao.findAssignmentsForCourse(courseId);
    //     res.json(assignments);
    // });

    // // create assignment
    // app.post("/api/courses/:courseId/assignments", (req, res) => {
    //     const { courseId } = req.params;
    //     const assignment = {
    //         ...req.body,
    //         course: courseId,
    //     };
    //     const newAssignment = assignmentsDao.createAssignment(assignment);
    //     res.send(newAssignment);
    // });



}


