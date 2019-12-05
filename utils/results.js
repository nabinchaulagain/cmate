const path = require("path");
const fs = require("fs");
const searchStudents = (searchQuery, max = null, infoScope = "name") => {
  searchQuery = searchQuery.toLowerCase();
  const resultFilePath = path.join(process.cwd(), "resources", "result.json");
  //get array of results
  const resultData = JSON.parse(fs.readFileSync(resultFilePath).toString());
  const searchResults = [];
  for (singleStudRes of resultData) {
    const studentName = singleStudRes.name;
    //1st priority search results if student name starts with search keyword
    if (studentName.toLowerCase().startsWith(searchQuery)) {
      searchResults.push(infoScope === "name" ? {name:studentName,rollNo:singleStudRes.rollNo} : singleStudRes);
      if (max && searchResults.length === max) {
        return searchResults;
      }
    }
  }
  for (singleStudRes of resultData) {
    const studentName = singleStudRes.name;
    //2nd priority search results if student name contains search keyword
    if (
      studentName.toLowerCase().indexOf(searchQuery) !== 0 &&
      studentName.toLowerCase().indexOf(searchQuery) !== -1
    ) {
      searchResults.push(infoScope === "name" ? {name:studentName,rollNo:singleStudRes.rollNo} : singleStudRes);
      if (max && searchResults.length === max) {
        return searchResults;
      }
    }
  }
  return searchResults;
};
module.exports = { searchStudents };
