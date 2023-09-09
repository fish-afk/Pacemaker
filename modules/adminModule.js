const ip = require("ip");
const mongodb = require("../models/mongodb");
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
			.send({ status: "failure", message: "Invalid register key" });
	} else {
		const check = await mongodb.Admins.findOne({ username: username }).exec();
		
		if (check == null) {
			const record = new mongodb.Admins({
				username: username,
				password: password,
				accountCreationDate: new Date(),
				active: true,
			});

			await record
				.save()
				.then(async () => {
					console.log("New admin created !");
					const refreshToken = await authMiddleware.generateRefreshToken(
						username,
						"Admin",
					);
					const jwtToken = authMiddleware.generateJwtToken(username, "Admin");

					return res.send({ jwtToken, refreshToken });
				})
				.catch((err) => {
					console.log(err);
					return res
						.status(500)
						.send({ status: "failure", message: "Unknown error" });
				});
		} else {
			return res.status(400).send({
				status: "failure",
				message: "Username exists or unknown error occured",
			});
		}
	}
}

function login(req, res) {}

const refresh = async (req, res) => {
	const refreshToken = req.body.refreshToken;
	const username = req.body.username;

	if (!refreshToken || !username) {
		return res.send({ message: "No Token Provided!" });
	}
	await authMiddleware.verifyRefreshToken(refreshToken, username, res);
};

module.exports = {
	login,
	register,
	refresh,
};
