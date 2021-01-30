const express = require("express");
const app = express();
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const TOURS_PATH = "/api/v1/tours";
const USERS_PATH = "/api/v1/users";

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(TOURS_PATH, tourRouter);
app.use(USERS_PATH, userRouter);

module.exports = app;
