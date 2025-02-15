import { users, classes, enrollments, assignments, grades, attendance } from "@shared/schema";
import type { User, InsertUser, Class, Assignment, Grade, Attendance } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Class operations
  createClass(classData: Partial<Class>): Promise<Class>;
  getClasses(): Promise<Class[]>;
  getClassById(id: number): Promise<Class | undefined>;
  
  // Assignment operations
  createAssignment(assignment: Partial<Assignment>): Promise<Assignment>;
  getAssignmentsByClass(classId: number): Promise<Assignment[]>;
  
  // Grade operations
  addGrade(grade: Partial<Grade>): Promise<Grade>;
  getGradesByStudent(studentId: number): Promise<Grade[]>;
  
  // Attendance operations
  markAttendance(attendance: Partial<Attendance>): Promise<Attendance>;
  getAttendanceByClass(classId: number): Promise<Attendance[]>;

  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private classes: Map<number, Class>;
  private assignments: Map<number, Assignment>;
  private grades: Map<number, Grade>;
  private attendance: Map<number, Attendance>;
  sessionStore: session.Store;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.classes = new Map();
    this.assignments = new Map();
    this.grades = new Map();
    this.attendance = new Map();
    this.currentId = {
      users: 1,
      classes: 1,
      assignments: 1,
      grades: 1,
      attendance: 1,
    };
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createClass(classData: Partial<Class>): Promise<Class> {
    const id = this.currentId.classes++;
    const newClass = { ...classData, id } as Class;
    this.classes.set(id, newClass);
    return newClass;
  }

  async getClasses(): Promise<Class[]> {
    return Array.from(this.classes.values());
  }

  async getClassById(id: number): Promise<Class | undefined> {
    return this.classes.get(id);
  }

  async createAssignment(assignment: Partial<Assignment>): Promise<Assignment> {
    const id = this.currentId.assignments++;
    const newAssignment = { ...assignment, id } as Assignment;
    this.assignments.set(id, newAssignment);
    return newAssignment;
  }

  async getAssignmentsByClass(classId: number): Promise<Assignment[]> {
    return Array.from(this.assignments.values()).filter(
      (assignment) => assignment.classId === classId
    );
  }

  async addGrade(grade: Partial<Grade>): Promise<Grade> {
    const id = this.currentId.grades++;
    const newGrade = { ...grade, id } as Grade;
    this.grades.set(id, newGrade);
    return newGrade;
  }

  async getGradesByStudent(studentId: number): Promise<Grade[]> {
    return Array.from(this.grades.values()).filter(
      (grade) => grade.studentId === studentId
    );
  }

  async markAttendance(attendanceData: Partial<Attendance>): Promise<Attendance> {
    const id = this.currentId.attendance++;
    const newAttendance = { ...attendanceData, id } as Attendance;
    this.attendance.set(id, newAttendance);
    return newAttendance;
  }

  async getAttendanceByClass(classId: number): Promise<Attendance[]> {
    return Array.from(this.attendance.values()).filter(
      (record) => record.classId === classId
    );
  }
}

export const storage = new MemStorage();
