import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
// let currentUser = null;


export default function UserRoutes(app) {
    const createUser = (req, res) => { };
    const deleteUser = (req, res) => { };


    // sign up
    const signup = (req, res) => {
        const user = dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json({ message: "Username already in use" });
            return;
        }
        const currentUser = dao.createUser(req.body);
        req.session["currentUser"] = currentUser; // 不同用户有不同的session， 每个页面看到不同的用户
        res.json(currentUser);
    };


    // sign in
    const signin = (req, res) => {
        const { username, password } = req.body;
        const currentUser = dao.findUserByCredentials(username, password);
        if (currentUser) {
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } else {
            res.status(401).json({ message: "Unable to login. Try again later." });
        }
    };



    // find all users
    const findAllUsers = (req, res) => {
        // const allUsers = dao.findAllUsers();
        // res.json(allUsers);
    };


    // Update user
    const updateUser = (req, res) => {
        const userId = req.params.userId;
        const userUpdates = req.body;
        dao.updateUser(userId, userUpdates);
        const currentUser = dao.findUserById(userId); // only update 自己的profile
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };



    // profile: Retrieving the Profile from the Server
    const profile = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    };


    //  Integrating Signout with a RESTful Web API
    const signout = (req, res) => {

        req.session.destroy();  // Users can be signed out by destroying the session.
        res.sendStatus(200);
    };





    // retrieve courses the current user is enrolled in
    const findCoursesForEnrolledUser = (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const courses = courseDao.findCoursesForEnrolledUser(userId);
        res.json(courses);
    };


    // Create course
    // const createCourse = (req, res) => {
    //     const currentUser = req.session["currentUser"];
    //     const newCourse = courseDao.createCourse(req.body);
    //     enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    //     res.json(newCourse);
    // };
    const createCourse = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.status(401).json({ message: "Not logged in" });
        }

        const newCourse = {
            ...req.body,
            owner: currentUser._id,
        };

        const createdCourse = courseDao.createCourse(newCourse);

        // 如果需要课程加入用户的enrollment
        enrollmentsDao.enrollUserInCourse(currentUser._id, createdCourse._id);

        res.json(createdCourse);
    };



    // find user by id
    const findUserById = (req, res) => {
        // const userId = req.body;
        // const user = dao.findUserById(userId);
        // console.log(user);
        // res.json(user);
    };

    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.get("/api/users/:userId", findUserById);

    app.get("/api/users", findAllUsers);
    app.post("/api/users/profile", profile);
    app.put("/api/users/:userId", updateUser);
    app.post("/api/users/signout", signout);
    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
    app.post("/api/users/current/courses", createCourse);
    app.post("/api/users", createUser);
    app.delete("/api/users/:userId", deleteUser);

}