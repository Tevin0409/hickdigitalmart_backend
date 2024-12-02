import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";



import { requestLogger, errorLogger, errorResponder, invalidPathHandler } from './middleware'
import { userRouter } from "./routes";
import { roleRouter } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.get("/", (req,res) => { res.json("Hello there")});

app.use("/auth", userRouter);

app.use("/role", roleRouter);

app.use(errorLogger)

app.use(errorResponder)

app.use(invalidPathHandler)

const port = process.env.PORT || 4500;

const server = app.listen(port, () => {
  console.log(`🚀 Server ready at: http://localhost:${port}`);
});