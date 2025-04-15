// ==== Kambaz/Users/routes.js ====
import * as dao from "./dao.js";
import { requireRole } from "../Middleware/authorization.js";

export default function UserRoutes(app) {
    app.post("/api/users/signup", async (req, res) => {
        const existing = await dao.findUserByUsername(req.body.username);
        if (existing) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const user = await dao.createUser(req.body);
        req.session["currentUser"] = user;
        res.json(user);
    });

    app.post("/api/users/signin", async (req, res) => {
        const user = await dao.findUserByCredentials(req.body.username, req.body.password);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        req.session["currentUser"] = user;
        res.json(user);
    });

    app.post("/api/users/signout", (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    });

    app.post("/api/users/profile", (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.sendStatus(401);
        }
        res.json(currentUser);
    });

    app.get("/api/users", async (req, res) => {
        const { role } = req.query;
        const users = role ? await dao.findUsersByRole(role) : await dao.findAllUsers();
        res.json(users);
    });

    // 🔒 Faculty-only test route
    app.get("/api/test-faculty-only", requireRole("FACULTY"), (req, res) => {
        res.json({ message: "You are a faculty member." });
    });

    app.get("/api/test-student-only", requireRole("STUDENT"), (req, res) => {
        res.json({ message: "You are a student." });
    });
}