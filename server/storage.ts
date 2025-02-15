import { users, classes, enrollments, assignments, grades, attendance } from "@shared/schema";
import type { User, InsertUser, Class, Assignment, Grade, Attendance } from "@shared/schema";
import session from "express-session";
import { db } from "./db";
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;

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

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createClass(classData: Partial<Class>): Promise<Class> {
    const [newClass] = await db.insert(classes).values(classData).returning();
    return newClass;
  }

  async getClasses(): Promise<Class[]> {
    return await db.select().from(classes);
  }

  async getClassById(id: number): Promise<Class | undefined> {
    const [class_] = await db.select().from(classes).where(eq(classes.id, id));
    return class_;
  }

  async createAssignment(assignment: Partial<Assignment>): Promise<Assignment> {
    const [newAssignment] = await db.insert(assignments).values(assignment).returning();
    return newAssignment;
  }

  async getAssignmentsByClass(classId: number): Promise<Assignment[]> {
    return await db.select().from(assignments).where(eq(assignments.classId, classId));
  }

  async addGrade(grade: Partial<Grade>): Promise<Grade> {
    const [newGrade] = await db.insert(grades).values(grade).returning();
    return newGrade;
  }

  async getGradesByStudent(studentId: number): Promise<Grade[]> {
    return await db.select().from(grades).where(eq(grades.studentId, studentId));
  }

  async markAttendance(attendanceData: Partial<Attendance>): Promise<Attendance> {
    const [newAttendance] = await db.insert(attendance).values(attendanceData).returning();
    return newAttendance;
  }

  async getAttendanceByClass(classId: number): Promise<Attendance[]> {
    return await db.select().from(attendance).where(eq(attendance.classId, classId));
  }
}

export const storage = new DatabaseStorage();