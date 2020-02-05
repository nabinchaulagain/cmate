const fs = require("fs");
const FilePath = require("./filePaths");
const deletePics = (...pics) => {
  for (pic of pics) {
    if (pic) {
      const imageLocation = FilePath.imageFilePath(pic);
      fs.unlink(imageLocation, () => {});
    }
  }
};

module.exports = { deletePics };
