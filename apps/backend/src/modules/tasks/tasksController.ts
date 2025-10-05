import { Request, Response } from "express";
import TasksService from "./tasksService";

function mapStatus(status?: string) {
  if (!status) return undefined;
  const s = status.toString().trim();
  const upper = s.toUpperCase().replace(/\s+/g, "_");
  if (["PENDING", "IN_PROGRESS", "COMPLETED"].includes(upper)) return upper;

  // Accept human-friendly strings
  if (s.toLowerCase() === "pending") return "PENDING";
  if (s.toLowerCase() === "in progress" || s.toLowerCase() === "in_progress")
    return "IN_PROGRESS";
  if (s.toLowerCase() === "completed") return "COMPLETED";

  return status;
}

export default class TasksController {
  static async getAll(req: Request, res: Response) {
    try {
      // already past the jwt authentication middleware
      const userId = req.user?.userId as unknown as string;

      const tasks = await TasksService.getAll(userId);
      return res.json(tasks);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      // already past the jwt authentication middleware
      const userId = req.user?.userId as unknown as string;

      const task = await TasksService.getById(id, userId);
      if (!task) return res.status(404).json({ message: "Task not found" });
      return res.json(task);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async create(req: Request, res: Response) {
    const { title, description, status, assignedUserId, dueDate } = req.body;
    try {
      const data: any = {
        title,
        description: description ?? null,
        assignedUserId: assignedUserId ?? null,
      };

      const mapped = mapStatus(status);
      if (mapped) data.status = mapped;

      if (dueDate) data.dueDate = new Date(dueDate);

      const created = await TasksService.create(data);
      return res.status(201).json(created);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async update(req: Request, res: Response) {
    // already past the jwt authentication middleware
    const userId = req.user?.userId as unknown as string;

    const { id } = req.params;
    const { title, description, status, assignedUserId, dueDate } = req.body;
    try {
      const existing = await TasksService.getById(id, userId);
      if (!existing) return res.status(404).json({ message: "Task not found" });

      const data: any = {};
      if (title !== undefined) data.title = title;
      if (description !== undefined) data.description = description;
      if (assignedUserId !== undefined) data.assignedUserId = assignedUserId;

      if (status !== undefined) {
        const mapped = mapStatus(status);
        if (mapped) data.status = mapped;
      }

      if (dueDate !== undefined) {
        data.dueDate = dueDate ? new Date(dueDate) : null;
      }

      const updated = await TasksService.update(id, data);
      return res.json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async delete(req: Request, res: Response) {
    // already past the jwt authentication middleware
    const userId = req.user?.userId as unknown as string;
    const { id } = req.params;

    try {
      const existing = await TasksService.getById(id, userId);
      if (!existing) return res.status(404).json({ message: "Task not found" });

      await TasksService.delete(id);
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
