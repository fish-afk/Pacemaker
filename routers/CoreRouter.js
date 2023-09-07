const express = require("express");
const router = express.Router();
const Module = require("../modules/CoreModule");
const authMiddleware = require('../middleware/authMiddleware')

router.get('/initialhandshake', Module.initialHandshake)
router.get("/getcmd",authMiddleware.verifyJWT, Module.getCmd);
router.post("/postresult", Module.postResult);
router.delete("/killswitch", Module.killSwitch);
router.get('/refresh', Module.refresh)

module.exports = router;
