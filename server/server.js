// import express from "express";
// import 'dotenv/config';
require("dotenv").config();
const express = require("express");
const teacherRoutes = require("./routes/api/teacher");
const studentRoutes = require("./routes/api/student");
const loginRoutes = require("./routes/api/login");
const cors = require("cors");

//express app
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

//middleware to intercept request and response
app.use(express.json());
app.use((req, res, next) => {
  next();
});

app.use("/api/teacher", teacherRoutes);
app.use("/api/user", studentRoutes);
app.use("/api/login", loginRoutes);
//listen to port number
app.listen(process.env.API_Port, () => {
  console.log("listening on port", process.env.API_Port);
});
