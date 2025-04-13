// const express = require('express')
import express from 'express';
import Hello from "./Hello.js"
import Lab5 from "./Lab5/index.js";
import cors from "cors";

import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentsRoutes from "./Kambaz/Enrollments/routes.js";



import "dotenv/config";
import session from "express-session";


const app = express()

// Configure CORS to support cookies and restrict network access
// app.use(
//     cors({
//         credentials: true,
//         origin: process.env.NETLIFY_URL || "http://localhost:5173",
//     })
// );

//手动了 manually configure CORS
const allowedOrigins = [
    "http://localhost:5173",
    "https://gloria-react-web-app-cs5610-sp25.netlify.app",
    "https://a5--gloria-react-web-app-cs5610-sp25.netlify.app"
];

app.use(
    cors({
        credentials: true,
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        }
    })
);


//  Configuring Server Sessions
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
};

if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
        // domain: process.env.NODE_SERVER_DOMAIN,
    };
}

app.use(session(sessionOptions));

app.use(express.json())


// Lab5
Lab5(app);
Hello(app)

// Kambaz
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentsRoutes(app);



app.listen(process.env.PORT || 4000)