const express = require("express");
const router = express.Router();
const Module = require("../modules/CoreModule");

router.get("/getcmd", Module.getCmd);
router.post("/postresult", Module.postResult);
router.delete("/killswitch", Module.killSwitch);

module.exports = router;
