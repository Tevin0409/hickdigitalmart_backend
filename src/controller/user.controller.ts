import express from "express";
import { CreateUserDTO } from "../interface/user";
import { userService } from "../services";

export const userController = {
  createUser: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const data: CreateUserDTO = req.body;
      const user = await userService.createUser(data);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

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
};
