import express from "express";
import { CreateUserDTO } from "../interface/user";
import { userService } from "../services";
import { IUserRequest } from "../middleware";

export const userController = {
  // Create a new user
  createUser: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const data: CreateUserDTO = req.body;
      const user = await userService.createUser(data);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },

  // User login
  login: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const data = req.body;
      const user = await userService.loginUser(data);
      if (user.refreshToken) {
        res.cookie("refreshToken", user.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
  verify: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const data = req.body;
      const user = await userService.verifyUser(data);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
  // User login
  refresh: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const user = await userService.refresh(
        req.body.id,
        req.body.refreshToken
      );
      if (user.refreshToken) {
        res.cookie("refreshToken", user.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  // Update an existing user
  updateUser: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedUser = await userService.updateUser(id, updateData);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  },

  // Get all users
  getAllUsers: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      // Extract query parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const searchTerm = req.query.searchTerm as string | undefined;
      const roleId = req.query.roleId as string | undefined;

      // Call userService with the extracted parameters
      const users = await userService.getAllUsers(
        page,
        limit,
        searchTerm,
        roleId
      );

      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },

  // Get user by ID
  getUserById: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
  getUser: async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const user = await userService.getUserByEmail(req.user.email);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  // Get user by email
  getUserByEmail: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { email } = req.params;
      const user = await userService.getUserByEmail(email);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
  managePermissions: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { userId } = req.params;
      const { permissionsToAdd, permissionsToRemove } = req.body;
      const user = await userService.managePermissions(
        userId,
        permissionsToAdd,
        permissionsToRemove
      );
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
  addTechnicianQuestionnaire: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const user = await userService.addTechnicianQuestionnaire(req.body);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
  addShopOwnersQuestionnaire: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const user = await userService.addShopOwnersQuestionnaire(req.body);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
  getTechnicianRequest: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const searchTerm = req.query.searchTerm as string | undefined;

      const response = await userService.getTechnicianRequest(
        page,
        limit,
        searchTerm
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
  getShopOwnwersRequest: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const searchTerm = req.query.searchTerm as string | undefined;

      const response = await userService.getShopOwnersRequest(
        page,
        limit,
        searchTerm
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
  approveTechnician: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = req.params.id as string;

      const response = await userService.approveTechnician(userId);

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
  approveShopOwner: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = req.params.id as string;

      const response = await userService.approveShopOwner(userId);

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
  ChangePassword: async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const email = req.user.email;
      const user = await userService.changePassword(email, req.body);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
  forgotPassword: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const user = await userService.forgotPassword(req.body.email);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
  resetPassword: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const user = await userService.resetPassword(req.body);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
};
