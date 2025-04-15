// ==== Kambaz/Users/dao.js ====
import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const createUser = (user) => model.create({ ...user, _id: uuidv4() });
export const findUserByUsername = (username) => model.findOne({ username });
export const findUserByCredentials = (username, password) => model.findOne({ username, password });
export const findUserById = (id) => model.findById(id);
export const updateUser = (id, updates) => model.updateOne({ _id: id }, { $set: updates });
export const deleteUser = (id) => model.deleteOne({ _id: id });
export const findUsersByRole = (role) => model.find({ role });