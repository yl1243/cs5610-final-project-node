// ==== index.js ====
import express from "express";
import cors from "cors";
import session from "express-session";
import mongoose from "mongoose";

import UserRoutes from "./Kambaz/Users/routes.js";
import QuizRoutes from "./Kambaz/Quizzes/routes.js";

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(session({
    secret: "kambaz-secret",
    resave: false,
    saveUninitialized: false,
}));

mongoose.connect("mongodb://127.0.0.1:27017/demo-data-final-project");

UserRoutes(app);
QuizRoutes(app);

app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});