const ip = require("ip");
const mongodb = require('../models/mongodb')
const helper = require('../helpers/common')
const authMiddleware = require("../middleware/authMiddleware");

function initialHandshake(req, res) {
	const ipv4 = ip.address();
	const currentDate = helper.getCurrentDate()
	const victim_hostname = req.body['hostname'];
}

function getCmd(req, res) {
	const username = req.username;
}

function postResult(req, res) {
	const username = req.username;
}

function killSwitch(req, res) {
	const username = req.username;
}

const refresh = async (req, res) => {
	const refreshToken = req.body.refreshToken;
	const username = req.body.username;

	if (!refreshToken || refreshToken == undefined) {
		return res.send({ message: "No Token Provided!" });
	}
	await authMiddleware.verifyRefreshToken(refreshToken, username, res);
};

module.exports = {
	initialHandshake,
	getCmd,
	postResult,
	killSwitch,
	refresh
};
