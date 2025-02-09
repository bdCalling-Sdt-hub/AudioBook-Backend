const express = require("express");
const config = require("../../config/config");
const authRoute = require("./auth.routes");
const userRoute = require("./user.routes");
const docsRoute = require("./docs.routes");
const appSettingsRoute = require("./appSettings.routes");
const audioBookRoute = require("./audioBook.routes");
const charactersRoute = require("./characters.routes");
const landingPageAudioRoute = require("./landingPageAudio.routes");
const languageRoute = require("./language.routes");
const locationRoute = require("./location.routes");
const adminRoute = require("./admin.routes");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/appSettings",
    route: appSettingsRoute,
  },
  {
    path: "/audioBook",
    route: audioBookRoute,
  },
  {
    path: "/characters",
    route: charactersRoute,
  },
  {
    path: "/landingPageAudio",
    route: landingPageAudioRoute,
  },
  {
    path: "/language",
    route: languageRoute,
  },
  {
    path: "/location",
    route: locationRoute,
  },
  {
    path: "/admin",
    route: adminRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
