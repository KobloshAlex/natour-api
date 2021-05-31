const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

const TOURS_PATH = "/api/v1/tours";
const USERS_PATH = "/api/v1/users";

//development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in hour",
});
app.use("/api", limiter);

app.use(helmet());

//body parser
app.use(express.json({ limit: "10kb" }));

//data sanitization against NoSQL
app.use(mongoSanitize());

//data sanitization against XSS
app.use(xss());

//prevent param pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficult",
      "price",
    ],
  })
);

//serving static files
app.use(express.static(`${__dirname}/public`));

//Testing MW
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(TOURS_PATH, tourRouter);
app.use(USERS_PATH, userRouter);

// Handle Unhandled URLs
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find rout for URL: ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
