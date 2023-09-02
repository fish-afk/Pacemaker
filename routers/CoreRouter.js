const express = require("express");
const router = express.Router();
const Module = require("../modules/CoreModule");

router.get("/getCmd", Module.getCmd);
router.get("/postresult", Module.recieveResult);
router.get("/idied", Module.funeral);

module.exports = router;
