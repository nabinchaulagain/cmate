const fs = require("fs");

const getCorrectCollegeName = (collegeNameInObj, collegeNames) => {
  for (collegeName of collegeNames) {
    if (
      collegeName.raw.substring(0, 20) === collegeNameInObj.substring(0, 20)
    ) {
      return collegeName.real;
    }
  }
};

(async () => {
  const colleges = JSON.parse(
    fs.readFileSync("./resources/colleges.json").toString()
  );
  const results = JSON.parse(
    fs.readFileSync("./resources/result.json").toString()
  );
  const collegeNames = [];
  const newResults = [];
  colleges.forEach(college => {
    collegeNames.push({
      real: college,
      raw: college.replace(/[^a-z]/gi, "").toLowerCase()
    });
  });
  results.forEach(singleResult => {
    let collegeNameInObj = singleResult.campus;
    collegeNameInObj = collegeNameInObj.replace(/[^a-z]/gi, "").toLowerCase();
    const correctCollegeName = getCorrectCollegeName(
      collegeNameInObj,
      collegeNames
    );
    if (correctCollegeName) {
      newResults.push({ ...singleResult, campus: correctCollegeName });
    } else {
      newResults.push(singleResult);
    }
  });
  fs.writeFile(
    "./resources/result2.json",
    JSON.stringify(newResults),
    err => {}
  );
})();
