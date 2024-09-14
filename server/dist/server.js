"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const express = require("express");
const app = express();
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
(0, db_1.connects)();
