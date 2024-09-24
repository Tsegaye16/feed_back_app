import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./routes/userRout.js";
const app = express();
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(cors());
// Routes
app.use("/user", router);

export default app;
