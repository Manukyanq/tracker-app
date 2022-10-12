const mongoose = require("mongoose");

require("./TrackModel");

if (process.env.NODE_ENV === "development") {
  mongoose.set("debug", true);
}

const options = {};
module.exports.initMongo = connectionString =>
  mongoose
    .connect(connectionString, {
      useNewUrlParser: true,
    })
    .then(() => console.log("Successfully connected to DB ✅"))
    .catch(err => console.error("Error connecting to database:", err.message));

module.exports.disposeMongo = () =>
  mongoose.disconnect().then(() => console.log("Disconnected from DB 😴"));
