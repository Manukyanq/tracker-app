require("dotenv").config();
const { initMongo, disposeMongo } = require("./database/mongoose");
const express = require("express");
const jsonParser = require("body-parser").json({ limit: "500kb" });
const cors = require("cors");

const { createTrackRecords } = require("./services/trackService");
initMongo(process.env.MONGO_CONNECTION_STRING);

const [backendPort, templatesPort] = [
  process.env.BACKEND_PORT,
  process.env.TEMPLATES_PORT,
];

const templates = express();
const backendApp = express();

backendApp.use(jsonParser);
backendApp.use(cors());

templates.get(["/", "/1.html", "/2.html"], (_, res) => {
  res.sendFile("view/home.html", { root: __dirname });
});

backendApp.post("/track", async (req, res, next) => {
  try {
    createTrackRecords(req.body);
    res.status(200).send({});
  } catch (err) {
    next(err);
  }
});

backendApp.get("/", async (_, res, next) => {
  try {
    res.sendFile("view/tracker.js", { root: __dirname });
  } catch (err) {
    next(err);
  }
});

backendApp.listen(backendPort, () => {
  console.log(`Backend App listening on port ${backendPort}`);
});

templates.listen(templatesPort, () => {
  console.log(
    `Templates App launched successfully.\n\n${
      process.env.NODE_ENV === "development"
        ? `Visit home page: http://localhost:${templatesPort} \n`
        : ""
    }`
  );
});

const gracefulShutdown = async () => {
  console.log("Process exited");
  await disposeMongo();
  process.exit(0);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
