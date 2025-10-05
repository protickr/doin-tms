import { Request, Response } from "express";

export default class UsersController {
  static async getUsers(req: Request, res: Response) {
    res.send("List of users");
  }
}
