const express = require("express");
const router = express.Router();
const Module = require("../modules/CoreModule");
const authMiddleware = require("../middleware/authMiddleware");

router.put("/initialhandshake", Module.initialHandshake);
router.post("/getcmd", authMiddleware.verifyJWT, Module.getCmd);
router.put("/postresult", authMiddleware.verifyJWT, Module.postResult);
router.patch("/killswitch", authMiddleware.verifyJWT, Module.killSwitch);
router.post("/refresh", Module.refresh);

module.exports = router;
