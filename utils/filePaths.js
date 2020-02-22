const path = require("path");
class FilePath {
  static imageFilePath(imgName) {
    return path.join(this.basePath, "images", imgName);
  }
  static questionPaperPath(paperId) {
    return path.join(this.basePath, "questionPapers", `${paperId}.json`);
  }
  static clientQuestionPath(paperId) {
    return path.join(
      this.basePath,
      "questionPapers",
      "client",
      `${paperId}.question.json`
    );
  }
  static clientAnswerPath(paperId) {
    return path.join(
      this.basePath,
      "questionPapers",
      "client",
      `${paperId}.answer.json`
    );
  }
  static resultPath() {
    return path.join(this.basePath, "result.json");
  }
  static clientBuildPath() {
    return path.join(this.basePath, "client", "build", "index.html");
  }
}
FilePath.basePath = path.join(process.cwd(), "resources");

module.exports = FilePath;
