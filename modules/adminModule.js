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
		return res.send({status: false, message: "No Token Provided!" });
	}
	await authMiddleware.verifyRefreshToken(refreshToken, username, res);
};

module.exports = {
	login,
	register,
	refresh,
};
