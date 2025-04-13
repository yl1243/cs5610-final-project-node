import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";


export function enrollUserInCourse(userId, courseId) {
    const { enrollments } = Database;
    enrollments.push({ _id: uuidv4(), user: userId, course: courseId });
}

export function findAllEnrollments() {
    return Database.enrollments;
}

// UPDATE!!!
export async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments.map((enrollment) => enrollment.user);
}

export async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
}


// Unenrollment!! UPDATE!!!
export function unenrollUserFromCourse(user, course) {
    return model.deleteOne({ user, course });
}


// export function findEnrollmentsForCourse(courseId) {
//     const { enrollments } = Database;
//     return enrollments.filter((enrollment) => enrollment.course === courseId);
// }

// export function deleteEnrollment(enrollmentId) {
//     const { enrollments } = Database;
//     Database.enrollments = enrollments.filter(
//         (enrollment) => enrollment._id !== enrollmentId
//     );
// }