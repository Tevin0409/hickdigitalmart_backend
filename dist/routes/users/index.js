import express from "express";
import { userRouter } from "./user.route";
import { userProductRouter } from "./product.route";
const usersRoute = express.Router();
usersRoute.use("/user/", userRouter);
usersRoute.use("/product/", userProductRouter);
export default usersRoute;
