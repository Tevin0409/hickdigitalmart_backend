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
      const users = await userService.getAllUsers();
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
      const user = await userService.managePermissions(userId, permissionsToAdd, permissionsToRemove);
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
};
