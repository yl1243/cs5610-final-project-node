import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function createAssignment(assignment) {
    // ✅ Debug 输出
    console.log("🔍 [DEBUG] Database.assignments 类型:", typeof Database.assignments);
    console.log("🔍 [DEBUG] Database.assignments 是数组吗？", Array.isArray(Database.assignments));
    console.log("🔍 [DEBUG] 当前 assignments 内容:", Database.assignments);

    const newAssignment = { ...assignment, _id: uuidv4() };
    Database.assignments = [...Database.assignments, newAssignment];
    return newAssignment;
}

export function findAllAssignments() {
    return Database.assignments;
}

export function findAssignmentById(assignmentId) {
    return Database.assignments.find(
        (assignment) => assignment._id === assignmentId
    );
}

export function findAssignmentsForCourse(courseId) {
    return Database.assignments.filter(
        (assignment) => assignment.course === courseId
    );
}

export function updateAssignment(assignmentId, assignmentUpdates) {
    const index = Database.assignments.findIndex(
        (assignment) => assignment._id === assignmentId
    );
    if (index !== -1) {
        Database.assignments[index] = {
            ...Database.assignments[index],
            ...assignmentUpdates,
        };
        return Database.assignments[index];
    }
    return null;
}

export function deleteAssignment(assignmentId) {
    const index = Database.assignments.findIndex(
        (assignment) => assignment._id === assignmentId
    );
    if (index !== -1) {
        Database.assignments.splice(index, 1);
        return true;
    }
    return false;
}

// // HW5 旧的
// import Database from "../Database/index.js";
// import { v4 as uuidv4 } from "uuid";

// export function findAssignmentsForCourse(courseId) {
//     const { assignments } = Database;
//     return assignments.filter((assignment) => assignment.course === courseId);
// }

// export function createAssignment(assignment) {
//     // ✅ Debug 输出
//     console.log("🔍 [DEBUG] Database.assignments 类型:", typeof Database.assignments);
//     console.log("🔍 [DEBUG] Database.assignments 是数组吗？", Array.isArray(Database.assignments));
//     console.log("🔍 [DEBUG] 当前 assignments 内容:", Database.assignments);


//     const newAssignment = { ...assignment, _id: uuidv4().toString() };
//     Database.assignments = [...Database.assignments, newAssignment];
//     return newAssignment;
// }

// export function deleteAssignment(assignmentId) {
//     const { assignments } = Database;
//     Database.assignments = assignments.filter(
//         (assignment) => assignment._id !== assignmentId
//     );
// }

// export function updateAssignment(assignmentId, assignmentUpdates) {
//     const { assignments } = Database;
//     const assignment = assignments.find((a) => a._id === assignmentId);
//     Object.assign(assignment, assignmentUpdates);
//     return assignment;
// }
