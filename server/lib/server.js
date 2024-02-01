"use strict";

// import express from "express";
// import 'dotenv/config';
require("dotenv").config();
var express = require("express");
var teacherRoutes = require("./routes/api/teacher");
var studentRoutes = require("./routes/api/student");
var loginRoutes = require("./routes/api/login");
var cors = require("cors");

//express app
var app = express();
app.use(cors({
  origin: "http://localhost:3000"
}));

//middleware to intercept request and response
app.use(express.json());
app.use(function (req, res, next) {
  next();
});
app.use("/api/teacher", teacherRoutes);
app.use("/api/user", studentRoutes);
app.use("/api/login", loginRoutes);
//listen to port number
app.listen(process.env.API_Port, function () {
  console.log("listening on port", process.env.API_Port);
});