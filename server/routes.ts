import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Users (Admin only)
  app.get("/api/users", async (req, res) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).send("Only admins can view all users");
    }
    const users = await storage.getUsers();
    res.json(users);
  });

  app.post("/api/users", async (req, res) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).send("Only admins can create users");
    }
    const user = await storage.createUser(req.body);
    res.status(201).json(user);
  });

  app.post("/api/users/bulk", async (req, res) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).send("Only admins can create users");
    }

    // Validate that we received an array of users
    if (!Array.isArray(req.body)) {
      return res.status(400).send("Expected an array of users");
    }

    try {
      const users = await storage.createBulkUsers(req.body);
      res.status(201).json(users);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Analytics endpoints
  app.get("/api/analytics/summary", async (req, res) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).send("Only admins can view analytics");
    }
    const summary = await storage.getAnalyticsSummary();
    res.json(summary);
  });

  app.get("/api/analytics/trends", async (req, res) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).send("Only admins can view analytics");
    }
    const { timeRange = "month" } = req.query;
    const trends = await storage.getAnalyticsTrends(timeRange as string);
    res.json(trends);
  });

  // Classes
  app.get("/api/classes", async (req, res) => {
    const classes = await storage.getClasses();
    res.json(classes);
  });

  app.post("/api/classes", async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Authentication required");
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