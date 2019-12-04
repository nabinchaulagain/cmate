const router = require('express').Router();
const { getSearchResult,getResults } = require("../controllers/results");

router.get("/getSearchResult",getSearchResult);

router.get("/getResults",getResults)

module.exports = router;
