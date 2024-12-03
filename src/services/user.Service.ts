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

    const { email, password, firstName, lastName, phoneNumber, roleId } =
      userData;
    if (!roleId) {
      throw new AppError(400, "Role ID is required to create a user");
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new AppError(400, "This email is already registered with us");
      }

      // Validate roleId exists in the Role table
      const existingRole = await prisma.role.findUnique({
        where: { id: roleId },
      });

      if (!existingRole) {
        throw new AppError(400, "Invalid role ID provided");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user
      const result = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          phoneNumber,
          password: hashedPassword,
          roleId,
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
  updateUser: async (id: string, updateData: Partial<CreateUserDTO>) => {
    if (!id) throw new AppError(400, "User ID is required for update");

    try {
      // Validate roleId if provided
      if (updateData.roleId) {
        const existingRole = await prisma.role.findUnique({
          where: { id: updateData.roleId },
        });
        if (!existingRole) {
          throw new AppError(400, "Invalid role ID provided");
        }
      }

      // Hash the password if it's being updated
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
      });

      return updatedUser;
    } catch (err: any) {
      throw new AppError(500, `Failed to update user: ${err.message}`);
    }
  },
  getAllUsers: async () => {
    try {
      const users = await prisma.user.findMany({
        include: { role: true }, // Include role information if needed
      });
      return users;
    } catch (err: any) {
      throw new AppError(500, `Failed to retrieve users: ${err.message}`);
    }
  },

  // Get a user by ID
  getUserById: async (id: string) => {
    if (!id) throw new AppError(400, "User ID is required");

    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: { role: true }, // Include role information if needed
      });

      if (!user) {
        throw new AppError(404, "User not found");
      }

      return user;
    } catch (err: any) {
      throw new AppError(500, `Failed to retrieve user: ${err.message}`);
    }
  },
  getUserByEmail: async (email: string) => {
    if (!email) throw new AppError(400, "Email is required");

    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { role: true }, // Include role information if needed
      });

      if (!user) {
        throw new AppError(404, "User not found");
      }

      return user;
    } catch (err: any) {
      throw new AppError(500, `Failed to retrieve user: ${err.message}`);
    }
  },
};
