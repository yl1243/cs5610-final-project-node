/**
 * The schema file describes the constraints of the documents stored in a collection, such as the names of the properties, 
 * their data types, and the name of the collection where the documents will be stored.
 */

import mongoose from "mongoose";
const courseSchema = new mongoose.Schema({
   _id: String,
   name: String,
   number: String,
   credits: Number,
   description: String,
 },
 { collection: "courses" }
);
export default courseSchema;