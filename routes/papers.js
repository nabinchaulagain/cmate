const router = require("express").Router();
const { getPaper, getPapers } = require("../controllers/papers");
//GET =>/getPapers
router.get("/getPapers", getPapers);

//GET => /getPaper/:id
router.get("/getPaper/:id", getPaper);

module.exports = router;
