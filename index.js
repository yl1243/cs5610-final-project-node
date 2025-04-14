import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import mongoose from "mongoose";
import quizRoutes from "./Kambaz/Quizzes/routes.js";
import questionRoutes from "./Kambaz/Questions/routes.js";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

// Session configuration
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};

// Configure cookies
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}

app.use(session(sessionOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectionString = process.env.MONGODB_URI;
mongoose
  .connect(connectionString)
  .then(() => {
    console.log(`Successfully connected to MongoDB at: ${connectionString}`);
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

quizRoutes(app);
questionRoutes(app);

//test
app.get("/", (req, res) => {
  res.send("Kambaz backend");
});

//test
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
