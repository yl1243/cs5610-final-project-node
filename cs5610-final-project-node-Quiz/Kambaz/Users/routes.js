import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

// let currentUser = null;
export default function UserRoutes(app) {
  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };
  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };
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
  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };
  const updateUser = async (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    const currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
      req.session["currentUser"] = { ...currentUser, ...userUpdates };
    }
    res.json(currentUser);

  };
  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    /**
     * if a user is found a 400 error status is returned along with
     * an error message for display in the UI
     *  */
    if (user) {
      res.status(400).json(
        { message: "Username already in use" });
      return;
    }
    /**
     * (deleted) If the username is not already taken the user is inserted into
     * (deleted) the database and stored in the currentUser server variable.
     * (deleted) The response returned by the server includes the newly created user.
     * If the username is not already taken, create the new user and store it
     * in the session's "currentUser" property to remember that this new user
     * is now the currently logged-in user.
     */
    // currentUser = dao.createUser(req.body);
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;

    res.json(currentUser);

  };
  const signin = async (req, res) => {
    // extracts username and password from the request's body
    // communication to the database is asynchronous
    const { username, password } = req.body;
    // pass username and password properties into findUserByCredentials function
    // implemented by the DAO.
    // currentUser = dao.findUserByCredentials(username, password);

    // the found user is sent to the client in the response
    // res.json(currentUser);

    /**
     * signin route looks up the user by their credentials, stores it in "currentUser"
     * session, and responds with the user if they exist.
     * Otherwise, responds with an error.
     */
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }

  };

  // route for users to signout which resets "currentUser" to null in the server
  const signout = (req, res) => {
    // currentUser = null;
    req.session.destroy(); // users can be signed out by destroying the session
    res.sendStatus(200);

  };

  /**
   * When a successful sign in occurs, the account information is stored in a server variable
   * called "currentUser". The variable retains the signed-in user information as long as the
   * server is running.
   * The Sign in screen in the client copies "currentUser" from the server into the "currentUser"
   * state variable in the reducer and then navigates to the Profile screen.
   * If the browser reloads, the "currentUser" state variable is cleared and the user is logged out.
   * To address this, the browser must check whether someone is already logged in from the server,
   * and if so, update the copy in the reducer.
   * create profile route on the server to provide access to "currentUser"
   */
  const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  const createCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    const newCourse = courseDao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };

  const enrollUserInCourse = async (req, res) => {
    let { userId, courseId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      userId = currentUser._id;
    }
    const status = await enrollmentsDao.enrollUserInCourse(userId, courseId);
    res.send(status);
  };
  const unenrollUserFromCourse = async (req, res) => {
    let { userId, courseId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      userId = currentUser._id;
    }
    const status = await enrollmentsDao.unenrollUserFromCourse(userId, courseId);
    res.send(status);
  };
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
    let { userId } = req.params;
    if (userId === "current") {
      userId = currentUser._id;
    }
    const courses = await enrollmentsDao.findCoursesForUser(userId);
    res.json(courses);
  };


  // 先定义具体路径路由
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
  app.post("/api/users/current/courses", createCourse);

  // 然后定义参数化路由
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);

  // 其他参数化路由
  app.get("/api/users/:userId/courses", findCoursesForUser);
  app.post("/api/users/:userId/courses/:courseId", enrollUserInCourse);
  app.delete("/api/users/:userId/courses/:courseId", unenrollUserFromCourse);
}
