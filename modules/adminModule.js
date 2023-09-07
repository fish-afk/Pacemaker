const ip = require("ip");
const mongodb = require("../models/mongodb");
const helper = require("../helpers/common");
const authMiddleware = require("../middleware/authMiddleware");

function login(req, res) {}

function register(req, res) {}

const refresh = async (req, res) => {
	const refreshToken = req.body.refreshToken;
	const username = req.body.username;

	if (!refreshToken || refreshToken == undefined) {
		return res.send({ message: "No Token Provided!" });
	}
	await authMiddleware.verifyRefreshToken(refreshToken, username, res);
};

module.exports = {
	login,
	register,
	refresh,
};
