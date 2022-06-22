const express = require("express");

const router = express();
const { signin, signup } = require("../controllers/auth.js");

router.post("/signin", signin);
router.post("/signup", signup);

module.exports = router;
