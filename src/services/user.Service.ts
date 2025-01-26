import { PrismaClient, User } from "@prisma/client";
import { CreateUserDTO, LoginDTO } from "../interface/user";
import { AppError } from "../middleware";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { generateToken, verifyToken } from "../utils/jwt";
import { generateOTP } from "../utils/util";
import { sendOTPEmail } from "./email.Service";

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
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { phoneNumber }],
        },
      });

      if (existingUser) {
        throw new AppError(
          400,
          "This email or phone number is already registered with us"
        );
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
      const otp = generateOTP();
      const otpHash = await bcrypt.hash(otp, 10);
      const otpExpiresAt = new Date(Date.now() + 60 * 30 * 1000);

      // Create the user
      const result = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          phoneNumber,
          otpHash,
          otpExpiresAt,
          password: hashedPassword,
          roleId,
        },
      });

      await sendOTPEmail(result.email, otp);

      return {
        message:
          "User created successfully. Please check your email to verify Account",
      };
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
        // Increment failed login attempts
        await prisma.user.update({
          where: { email },
          data: {
            inCorrectAttempts: (existingUser.inCorrectAttempts || 0) + 1,
          },
        });

        throw new AppError(401, "Invalid credentials");
      }

      //check if verified

      if (!existingUser.isVerified) {
        const otp = generateOTP();
        const otpHash = await bcrypt.hash(otp, 10);
        const otpExpiresAt = new Date(Date.now() + 60 * 30 * 1000);

        await prisma.user.update({
          where: { email },
          data: {
            otpHash,
            otpExpiresAt,
          },
        });

        await sendOTPEmail(existingUser.email, otp);

        throw new AppError(
          401,
          "This account is not yet verified , check your email for an otp to verify your account "
        );
      }

      // Generate tokens
      const {
        accessToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
        refreshToken,
      } = generateToken(existingUser);

      // Reset failed attempts & store refresh token in DB
      await prisma.user.update({
        where: { email },
        data: {
          inCorrectAttempts: 0,
          refreshToken,
          refreshTokenExpiresAt,
        },
      });

      return {
        accessToken,
        accessTokenExpiresAt,
        refreshToken,
        refreshTokenExpiresAt,
        user: existingUser,
      };
    } catch (err: any) {
      throw new AppError(500, `Failed to login: ${err.message}`);
    }
  },
  verifyUser: async (verifyData: { email: string; otp: string }) => {
    if (!verifyData.email || !verifyData.otp) {
      throw new Error("Email and otp are required");
    }
    const existingUser = await prisma.user.findUnique({
      where: { email: verifyData.email },
    });

    if (!existingUser || !existingUser.otpHash) {
      throw new Error("User not found");
    }

    // Check if OTP is valid
    const isOTPValid = await bcrypt.compare(
      verifyData.otp,
      existingUser.otpHash
    );
    if (!isOTPValid) {
      throw new Error("Invalid OTP");
    }

    // Check if OTP has expired
    if (
      existingUser.otpExpiresAt &&
      new Date(existingUser.otpExpiresAt) < new Date()
    ) {
      throw new Error("OTP has expired");
    }

    // Generate authentication tokens
    const {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
    } = generateToken(existingUser);

    // Reset incorrect attempts & store refresh token in the database
    await prisma.user.update({
      where: { email: verifyData.email },
      data: {
        inCorrectAttempts: 0,
        refreshToken,
        refreshTokenExpiresAt,
        isVerified: true,
      },
    });

    return {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
      user: existingUser,
    };
  },
  refresh: async (id: string, refresh_token: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id, refreshToken: refresh_token },
      });

      if (!user) {
        throw new AppError(400, `No user found `);
      }
      const isValid = verifyToken(refresh_token, "refresh");

      if (!isValid) {
        throw new AppError(401, "Invalid refresh token ,Please log in");
      }

      // Generate tokens
      const {
        accessToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
        refreshToken,
      } = generateToken(user);

      // Reset failed attempts & store refresh token in DB
      await prisma.user.update({
        where: { email: user.email },
        data: {
          refreshToken,
          refreshTokenExpiresAt,
        },
      });

      return {
        accessToken,
        accessTokenExpiresAt,
        refreshToken,
        refreshTokenExpiresAt,
        user: user,
      };
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
        include: { role: true },
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
        include: { role: true },
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
        include: { role: true },
      });

      if (!user) {
        throw new AppError(404, "User not found");
      }

      return user;
    } catch (err: any) {
      throw new AppError(500, `Failed to retrieve user: ${err.message}`);
    }
  },
  isUserAdmin: async (email: string) => {
    const user = await prisma.user.findFirst({
      where: { email },
      include: { role: true },
    });
    if (
      user &&
      user.role &&
      (user.role.name === "SUDO" || user.role.name === "ADMIN")
    ) {
      return true;
    }

    return false;
  },
};
