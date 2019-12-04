const fs = require("fs");
const colleges = {};
const oldFileData = JSON.parse(
  fs.readFileSync("./resources/result.json").toString()
);
for(singleRes of oldFileData){
  if(!colleges[singleRes.campus]){
    colleges[singleRes.campus] = "right here";
  }
}
