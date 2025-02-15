import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Classes
  app.get("/api/classes", async (req, res) => {
    const classes = await storage.getClasses();
    res.json(classes);
  });

  app.post("/api/classes", async (req, res) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).send("Only admins can create classes");
    }
    const newClass = await storage.createClass(req.body);
    res.status(201).json(newClass);
  });

  // Assignments
  app.get("/api/classes/:classId/assignments", async (req, res) => {
    const assignments = await storage.getAssignmentsByClass(Number(req.params.classId));
    res.json(assignments);
  });

  app.post("/api/classes/:classId/assignments", async (req, res) => {
    if (!req.user || req.user.role !== "teacher") {
      return res.status(403).send("Only teachers can create assignments");
    }
    const assignment = await storage.createAssignment({
      ...req.body,
      classId: Number(req.params.classId),
    });
    res.status(201).json(assignment);
  });

  // Grades
  app.post("/api/assignments/:assignmentId/grades", async (req, res) => {
    if (!req.user || req.user.role !== "teacher") {
      return res.status(403).send("Only teachers can add grades");
    }
    const grade = await storage.addGrade({
      ...req.body,
      assignmentId: Number(req.params.assignmentId),
    });
    res.status(201).json(grade);
  });

  app.get("/api/students/:studentId/grades", async (req, res) => {
    const grades = await storage.getGradesByStudent(Number(req.params.studentId));
    res.json(grades);
  });

  // Attendance
  app.post("/api/classes/:classId/attendance", async (req, res) => {
    if (!req.user || req.user.role !== "teacher") {
      return res.status(403).send("Only teachers can mark attendance");
    }
    const attendance = await storage.markAttendance({
      ...req.body,
      classId: Number(req.params.classId),
    });
    res.status(201).json(attendance);
  });

  app.get("/api/classes/:classId/attendance", async (req, res) => {
    const attendance = await storage.getAttendanceByClass(Number(req.params.classId));
    res.json(attendance);
  });

  const httpServer = createServer(app);
  return httpServer;
}
