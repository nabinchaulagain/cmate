const fs = require("fs");
const path = require("path");
const deleteAllPicsInQuestion = (...pics) => {
  for (pic of pics) {
    if (pic) {
      const imageLocation = path.join(
        process.cwd(),
        "resources",
        "images",
        pic
      );
      fs.unlink(imageLocation, () => {});
    }
  }
};

module.exports = { deleteAllPicsInQuestion };
