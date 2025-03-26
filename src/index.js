const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");
const process = require('process');

// My Local IP Address
const myIp = process.env.BACKEND_IP;

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info("Connected to MongoDB");
  server = app.listen(config.port, myIp, () => {
    // logger.info(`Listening to port ${config.port}`);
    logger.info(`Listening to ip http://${myIp}:${config.port}`);
  });

  //initializing socket io
  const socketIo = require("socket.io");
  const socketIO = require("./utils/socketIO");
  const io = socketIo(server, {
    // cors: {
    //   origin: "*",
    // },
    cors: {
      origin: (origin, callback) => {
        // Allow all origins (wildcard) and give special permission to your domain
        if (origin === "https://nimur3000.sobhoy.com" || !origin) {
          callback(null, true); // Allow request
        } else {
          callback(null, true); // Allow all origins, including this one
        }
      },
      methods: ["GET", "POST"],  // Optional: Specify the methods if needed
      allowedHeaders: ["Content-Type"], // Optional: Define the allowed headers if required
    },
  });

  socketIO(io);

  global.io = io;
  server.listen(config.port, process.env.BACKEND_IP, () => {
    logger.info(`Socket IO listening to port ${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
