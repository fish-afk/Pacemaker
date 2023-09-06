const ip = require("ip");
const mongodb = require('../models/mongodb')
const helper = require('../helpers/common')

function initialHandshake(req, res) {
	const ipv4 = ip.address();
	const currentDate = helper.getCurrentDate()
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

module.exports = {
	initialHandshake,
	getCmd,
	postResult,
	killSwitch,
};
