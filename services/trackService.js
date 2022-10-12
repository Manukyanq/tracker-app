const mongoose = require("mongoose");

const TrackModel = mongoose.model("Track");

module.exports = {
  createTrackRecords: data =>
    TrackModel.insertMany(data.trackEvents, {
      ordered: false,
    }),
};
