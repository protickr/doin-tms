import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class UsersService {
  static async createUser(data: any) {
    // Logic to create a user in the database
    const user = await prisma.user.create({
      data,
    });
    return user;
  }

  static async findUserByEmail(email: string) {
    // Logic to find a user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }
}
