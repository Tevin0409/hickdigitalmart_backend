import { PrismaClient } from "@prisma/client";
import { CreateUserDTO, LoginDTO } from "../interface/user";
import { AppError } from "../middleware";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

const prisma = new PrismaClient();

export const userService = {
  createUser: async (userData: CreateUserDTO) => {
    if (!userData) throw new AppError(400, "Please provide valid data");

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        throw new AppError(400, `This email is already registered with us`);
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const result = await prisma.user.create({
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          password: hashedPassword,
        },
      });

      return result;
    } catch (err: any) {
      throw new AppError(500, `Failed to create user: ${err.message}`);
    }
  },

  loginUser: async (loginData: LoginDTO) => {
    const { email, password } = loginData;

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (!existingUser) {
        throw new AppError(400, `No user found with email: ${email}`);
      }
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!isPasswordValid) {
        // Increment the failed login attempts here if tracking them
        throw new AppError(401, "Invalid credentials");
      }

      // Create JWT token
      const jwtData = {
        email: existingUser.email,
        firstName: existingUser.firstName,
        time: new Date(),
      };
      const token = jwt.sign(jwtData, JWT_SECRET, { expiresIn: "24h" });

      return { token, user: existingUser };
    } catch (err: any) {
      throw new AppError(500, `Failed to login: ${err.message}`);
    }
  },
};
