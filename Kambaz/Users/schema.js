// ==== Kambaz/Users/schema.js ====
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    _id: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["STUDENT", "FACULTY"],
        default: "STUDENT"
    }
}, { collection: "users" });
export default userSchema;