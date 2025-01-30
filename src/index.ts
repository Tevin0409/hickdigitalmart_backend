import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import path from "path";

import {
  requestLogger,
  errorLogger,
  errorResponder,
  invalidPathHandler,
} from "./middleware";
import router from "./routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(requestLogger);

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/templates/warning.html`));
});

app.use("/api", router);

app.use(errorLogger);

app.use(errorResponder);

app.use(invalidPathHandler);

const port = process.env.PORT || 4500;

const server = app.listen(port, () => {
  console.log(`🚀 Server ready at: http://localhost:${port}`);
});
