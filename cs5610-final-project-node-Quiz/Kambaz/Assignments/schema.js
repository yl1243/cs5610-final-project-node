import mongoose from "mongoose";
const assignmentSchema = new mongoose.Schema(
 {
   _id: String,
   course: { type: String, ref: "CourseModel" },
   title: String,
   availableFromDate: String,
   dueDate: String,
   availableTilDate: String,
   description: String,
   points: Number
 },
 { collection: "assignments" }
);
export default assignmentSchema;