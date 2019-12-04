const {searchStudents} = require("../utils/results");

// controller for GET => /results/getSearchResult
const getSearchResult = (req, res) => {
  let searchQuery = req.query.keyword;
  if (!searchQuery) {
    return res.status(400).text("Keyword is needed");
  }
  const searchResults = searchStudents(searchQuery,6);
  res.json(searchResults);
};

// controller for GET => /results/getResults
const getResults = (req,res)=>{
  let searchQuery = req.query.keyword;
  if (!searchQuery) {
    return res.status(400).send("Keyword is needed");
  }
  const searchResults = searchStudents(searchQuery,null,"all")
  res.json(searchResults);
}

module.exports= {getSearchResult,getResults};
