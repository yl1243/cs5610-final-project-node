/**
 * implements various CRUD operations for handling the users array in the Database.
 */
// import db from "../Database/index.js";
import model from "./model.js";
import { v4 as uuidv4 } from "uuid";
// let { users } = db;
export const createUser = (user) => {
 const newUser = { ...user, _id: uuidv4() };
 // users = [...users, newUser];
 // return newUser;
 return model.create(newUser); // insert new user into the database
};
// export const createUser = (user) => (users = [...users, { ...user, _id: uuidv4() }]);
export const findAllUsers = () => model.find();
/**
 * model.findById() is a common database operation to retrieve documents by primary key.
 */
export const findUserById = (userId) => model.findById(userId);
/**
 * "findUserByUsername()"function is called to check if a user with specified
 * username already exists. 
 * */ 
export const findUserByUsername = (username) => model.findOne({ username: username });
export const findUserByCredentials = (username, password) => model.findOne({ username, password });
/**
 * Mongoose updateOne() function updates a single document by identifying it by primary key
 * and then update the matching fields.
 */
export const updateUser = (userId, user) => model.updateOne({ _id: userId }, { $set: user });
/**
 * model.deleteOne() removes 1 single user document from the database based on primary key.
 */
export const deleteUser = (userId) => model.deleteOne({ _id: userId });
/**
 * Mongoose model's find function takes as argument a JSON object used to 
 * pattern match documents in the collection.
 * The {role:role} object means that documents will be filtered by their role
 * property that matches the value "role"
 */
export const findUsersByRole = (role) => model.find({ role: role });
export const findUsersByPartialName = (partialName) => {
  /**
   * filtering users by their first or last name by creating a regular expression
   * used to pattern match the firstName or lastName fields of the documents
   * in the users collection.
   */
  const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
  return model.find({
    $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
  });
};
