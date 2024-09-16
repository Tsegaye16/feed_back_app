import express from "express";
import { sequelize } from "./db.js";

import app from "./app.js";

//DB connectivity

sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((error) => console.error("Unable to connect to the database:", error));

sequelize
  .sync({ force: false })
  .then(() => console.log("Tables created successfully"))
  .catch((err) => console.log("Error creating tables:", err));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
