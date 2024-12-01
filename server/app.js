import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./routes/userRout.js";
const app = express();
// Serve the uploaded images statically
app.use(express.static("uploads"));

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

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  res.status(statusCode).json({
    status,
    message: err.message,
  });
});

export default app;
