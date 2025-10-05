import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UsersService from "./usersService";

const JWT_SECRET: string = process.env.JWT_SECRET as string;

export default class UsersController {
  static async getUsers(req: Request, res: Response) {
    res.send("List of users");
  }

  static async signUp(req: Request, res: Response) {
    const { email, name, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await UsersService.createUser({
      email,
      name,
      password: hashedPassword,
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    let userResponse;
    if (createdUser) {
      const { password, createdAt, updatedAt, ...rest } = createdUser;
      userResponse = rest;
    }

    return res.status(201).json({
      ...userResponse,
      token,
    });
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    try {
      const user = await UsersService.findUserByEmail(email);
      if (!user)
        return res.status(401).json({ message: "Invalid credentials" });

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid)
        return res.status(401).json({ message: "Invalid credentials" });

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      return res.json({ name: user.name, email: user.email, token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
