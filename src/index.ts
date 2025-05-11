import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import fileUpload from "express-fileupload";
import path from "path";

import {
  requestLogger,
  errorLogger,
  errorResponder,
  invalidPathHandler,
  setupCors,
} from "./middleware";
import router from "./routes";
import "./utils/cron";

const app = express();

app.use(setupCors());
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(requestLogger);

app.get("/", (req, res) => {
  res.send(
    'You should not be here. Go to <a href="https://iannjoroge.netlify.app/">contact</a>'
  );
});

app.use("/api", router);

app.use(errorLogger);

app.use(errorResponder);

app.use(invalidPathHandler);

const port = process.env.PORT || 4500;

const server = app.listen(port, () => {
  console.log(`🚀 Server ready at: http://localhost:${port}`);
});
