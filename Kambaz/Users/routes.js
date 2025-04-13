import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
// let currentUser = null;


export default function UserRoutes(app) {

    // add create/delete user
    const createUser = async (req, res) => {
        const user = await dao.createUser(req.body);
        res.json(user);
    };
    const deleteUser = async (req, res) => {
        const status = await dao.deleteUser(req.params.userId);
        res.json(status);
    };


    // sign up (UPDATE!!!!)
    const signup = async (req, res) => {
        const user = await dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json(
                { message: "Username already in use" });
            return;
        }
        const currentUser = await dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };


    // sign in (UPDATED!!!!)
    const signin = async (req, res) => {
        // console.log('Signin request headers:', req.headers);
        const { username, password } = req.body;
        console.log(username, password);
        const currentUser = await dao.findUserByCredentials(username, password);
        console.log("current user: ", currentUser);
        if (currentUser) {
            console.log("fetched");
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } else {
            console.log("not fetched");
            res.status(401).json({ message: "Unable to login. Try again later." });
        }
    };



    // find all users (UPDATED!!!!)
    const findAllUsers = async (req, res) => {
        const { role, name } = req.query;
        if (role) {
            const users = await dao.findUsersByRole(role);
            res.json(users);
            return;
        }
        if (name) {
            const users = await dao.findUsersByPartialName(name);
            res.json(users);
            return;
        }
        const users = await dao.findAllUsers();
        res.json(users);
    };

    // find user by id
    const findUserById = async (req, res) => {
        const user = await dao.findUserById(req.params.userId);
        res.json(user);
    };
    app.get("/api/users/:userId", findUserById);


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
    const profile = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    };


    // Sign out
    const signout = async (req, res) => {

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

    // create a course for the current user
    const createCourse = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.status(401).json({ message: "Not logged in" });
        }
        const newCourse = await courseDao.createCourse(req.body);

        enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
        res.json(newCourse);
    };


    // update role
    const updateRole = async (req, res) => {
        const { role } = req.params;
        const roleUpdates = req.body;
        await dao.updateRole(role, roleUpdates);
        const currentRole = req.session["currentRole"];
        if (currentRole && currentRole.role === role) {
            req.session["currentRole"] = { ...currentRole, ...roleUpdates };
        }
        res.json(currentRole);
    };

    // update email
    const updateEmail = async (req, res) => {
        const { email } = req.params;
        const emailUpdates = req.body;
        await dao.updateEmail(email, emailUpdates);
        const currentEmail = req.session["currentEmail"];
        if (currentEmail && currentEmail.email === email) {
            req.session["currentEmail"] = { ...currentEmail, ...emailUpdates };
        }
        res.json(currentEmail);
    };
    app.put("/api/users/email", updateEmail);


    // update dob
    const updateDob = async (req, res) => {
        const { dob } = req.params;
        const dobUpdates = req.body;
        await dao.updateDob(dob, dobUpdates);
        const currentDob = req.session["currentDob"];
        if (currentDob && currentDob.dob === dob) {
            req.session["currentDob"] = { ...currentDob, ...dobUpdates };
        }
        res.json(currentDob);
    };
    app.put("/api/users/dob", updateDob);
    app.put("/api/users/role", updateRole);
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



    // find courses for user
    const findCoursesForUser = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        if (currentUser.role === "ADMIN") {
            const courses = await courseDao.findAllCourses();
            res.json(courses);
            return;
        }
        let { uid } = req.params;
        if (uid === "current") {
            uid = currentUser._id;
        }
        const courses = await enrollmentsDao.findCoursesForUser(uid);
        res.json(courses);
    };

    // enroll user in course
    const enrollUserInCourse = async (req, res) => {
        let { uid, cid } = req.params;
        if (uid === "current") {
            const currentUser = req.session["currentUser"];
            uid = currentUser._id;
        }
        const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
        res.send(status);
    };

    // unenroll user from course
    const unenrollUserFromCourse = async (req, res) => {
        let { uid, cid } = req.params;
        if (uid === "current") {
            const currentUser = req.session["currentUser"];
            uid = currentUser._id;
        }
        const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
        res.send(status);
    };
    app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
    app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
    app.get("/api/users/:uid/courses", findCoursesForUser);

}