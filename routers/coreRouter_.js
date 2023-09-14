const express = require("express");
const router = express.Router();
const Module = require("../modules/CoreModule");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/initialhandshake", Module.initialHandshake);
router.get("/getcmd", authMiddleware.verifyJWT, Module.getCmd);
router.post("/postresult", authMiddleware.verifyJWT, Module.postResult);
router.delete("/killswitch", authMiddleware.verifyJWT, Module.killSwitch);
router.get("/refresh", Module.refresh);

module.exports = router;
