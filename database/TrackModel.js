const mongoose = require("mongoose");
const { isStringValidUrl } = require("./validators");

const TrackSchema = new mongoose.Schema(
  {
    event: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
    },
    url: {
      type: String,
      validate: {
        validator: isStringValidUrl,
        msg: "Provided value must be valid url",
      },
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    ts: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Track = mongoose.model("Track", TrackSchema);

module.exports = Track;
