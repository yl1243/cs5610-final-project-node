// implements various CRUD operations for handling the users array in the Database

// import db from "../Database/index.js";
import model from "./model.js";
import { v4 as uuidv4 } from "uuid";
// let { users } = db;


export const createUser = (user) => {
    delete user._id;
    return model.create(user);
};




export const findAllUsers = () => model.find(); // select * from users

export const findUsersByPartialName = (partialName) => {
    const regex = new RegExp(partialName, "i");
    return model.find({
        $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    });
};

// find user by role
export const findUsersByRole = (role) => model.find({ role: role });

export const findUserById = (userId) => model.findById(userId);

export const findUserByUsername = (username) => model.findOne({ username: username });

export const findUserByCredentials = (username, password) => model.findOne({ username: username, password: password });

export const updateUser = (userId, user) => model.updateOne({ _id: userId }, { $set: user });

export const deleteUser = (userId) => model.deleteOne({ _id: userId });


export const updateEmail = (userId, email) => model.updateOne({ _id: userId }, { email: email });



export const updateRole = (userId, role) => model.updateOne({ _id: userId }, { role: role });

export const updateDob = (userId, dob) => model.updateOne({ _id: userId }, { dob: dob });