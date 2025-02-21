const express = require("express");
const body_parser = require("body-parser");
const userRouter = require("./routers/user_router.js");

const app = express();

// CORS middleware
app.options("*", (req, res) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://cyhba-backone.onrender.com"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

app.use(body_parser.json());

app.use("/", userRouter);

module.exports = app;
