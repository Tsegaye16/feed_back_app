import express from "express";
import cors from "cors";
import router from "./routes/userRout.js";
const app = express();
app.use(express.json());
app.use(cors());
// Routes
app.use("/user", router);

export default app;
