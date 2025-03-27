const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
const passport = require("passport");
const httpStatus = require("http-status");
const status = require("express-status-monitor");
const config = require("./config/config");
const morgan = require("./config/morgan");
const { jwtStrategy } = require("./config/passport");
const { authLimiter } = require("./middlewares/rateLimiter");
const routes = require("./routes/v1");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
const cron = require("node-cron");
const { AudioBook, Characters } = require("./models");

const app = express();

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// malter for file upload
app.use(express.static("public"));

// set security HTTP headers
app.use(helmet());

// parse json request body
// app.use(express.json());
app.use(express.json({ limit: '500mb' })); // { limit: "500mb" }

// // parse urlencoded request body
// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ limit: '500mb', extended: true })); // limit: "500mb",

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === "production") {
  app.use("/v1/auth", authLimiter);
}

// Express Monitor
app.use(status());

// v1 api routes
app.use("/v1", routes);

//testing API is alive
app.get("/test", (req, res) => {
  let userIP =
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress;
  res.send({ message: "This is Love Crew API", userIP });
});

// Schedule to run every hour (for `updateRunningEventStatus`)
cron.schedule("*/50 * * * *", async () => {
  const audioBooks = await AudioBook.find({ published: false });
  console.log("running a task every 1 minutes", audioBooks);

  audioBooks.forEach(async (audioBook) => {
    await AudioBook.findByIdAndDelete(audioBook._id);
  });
});

cron.schedule("*/50 * * * *", async () => {
  const characters = await Characters.find({ published: false });
  console.log("running a task every 5 minutes", characters);

  characters.forEach(async (character) => {
    await Characters.findByIdAndDelete(character._id);
  });
});

// app.use((req, res, next) => {
//   res.setTimeout(600000, () => { // Set to 10 minutes (in milliseconds)
//     console.log('Request timed out');
//     res.status(408).send('Request timed out');
//   });
//   next();
// });

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "This API Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
