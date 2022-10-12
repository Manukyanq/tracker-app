const URL = require("url").URL;

module.exports = {
  isStringValidUrl: string => {
    try {
      const url = new URL(string);

      return ["http:", "https:"].some(protocol => protocol === url.protocol);
    } catch (err) {
      return false;
    }
  },
};
