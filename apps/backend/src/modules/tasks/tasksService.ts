import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class TasksService {
  static async getAll(userId: string) {
    return prisma.task.findMany({
      //? note: user can only see their own tasks, for now
      where: { assignedUserId: userId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getById(id: string, userId?: string) {
    return prisma.task.findUnique({ where: { id, assignedUserId: userId } });
  }

  static async create(data: any) {
    return prisma.task.create({ data });
  }

  static async update(id: string, data: any) {
    return prisma.task.update({ where: { id }, data });
  }

  static async delete(id: string, userId?: string) {
    return prisma.task.delete({ where: { id, assignedUserId: userId } });
  }
}
