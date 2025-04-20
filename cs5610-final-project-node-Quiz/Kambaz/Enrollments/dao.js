import model from "./model.js";
export async function findCoursesForUser(userId) {
  // given a user find all course she enrolled in
 const enrollments = await model.find({ user: userId }).populate("course");
 const courses = enrollments.map((enrollment) => enrollment.course);
 // console.log(`all enrollments: ${await model.find()}`);
 return courses;
}
export async function findUsersForCourse(courseId) {
  // given a course find all enrolled users
 const enrollments = await model.find({ course: courseId }).populate("user");
 return enrollments.map((enrollment) => enrollment.user);
}
export function enrollUserInCourse(user, course) {
 return model.create({ user, course, _id: `${user}-${course}` });
}
export function unenrollUserFromCourse(user, course) {
 return model.deleteOne({ user, course });
}
