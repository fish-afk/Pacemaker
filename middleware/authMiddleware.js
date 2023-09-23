const jwt = require("jsonwebtoken");
const mongodb = require("../models/mongodb");
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

// sl1de

const generateJwtToken = (username, privs = "victim") => {
	const date = new Date();
	const JWT_EXPIRATION_TIME =
		privs === "Admin"
			? Math.floor(date.getTime() / 1000) + 60 * 20 // 20 minutes from now if admin
			: Math.floor(date.getTime() / 1000) + 60 * 40; // 40 minutes from now if victim

	const freshJwt = jwt.sign(
		{ username, exp: JWT_EXPIRATION_TIME, privs: privs },
		JWT_SECRET,
	);

	return freshJwt;
};

async function generateRefreshToken(username, privs = "victim") {
	const date = new Date();
	const REFRESH_EXPIRATION_TIME = (privs == "victim"
		? date.setMonth(date.getMonth() + 6) // 6 months from now
		: date.setMonth(date.getMonth() + 1)); // 1 month from now

	const refreshToken = jwt.sign(
		{ username, exp: REFRESH_EXPIRATION_TIME, privs: privs },
		REFRESH_SECRET,
	);

	const update = {
		refreshToken: refreshToken,
		refreshTokenExpiry: REFRESH_EXPIRATION_TIME,
	};

	if (privs == "victim") {
		const filterVictim = { _id: username }; // desired filter criteria
		const updateq = await mongodb.Victims.findOneAndUpdate(
			filterVictim,
			update,
			{ new: true },
		).exec();
	}

	if (privs == "Admin") {
		const filterAdmin = { username: username }; // desired filter criteria
		const updateq = await mongodb.Admins.findOneAndUpdate(filterAdmin, update, {
			new: true,
		}).exec();

		console.log(updateq);
	}

	return refreshToken;
}

function verifyJWT(req, res, next) {
	// Get the user's username from the decoded token
	const username = req.body["username"];
	const token = req.body["jwt-key"];

	if (!token || !username) {
		return res
			.status(401)
			.send({ status: false, message: "Missing auth fields !" });
	}
	// Verify the JWT and check that it is valid
	jwt.verify(token, JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(404).send({ status: false, message: err.message });
		}
		if (decoded.exp < Date.now() / 1000) {
			return res.status(401).send("JWT has expired");
		}
		// If the JWT is valid, save the decoded user information in the request object
		// so that it is available for the next middleware function
		if (decoded.username != username) {
			return res.status(404).send({ status: false, message: "Token mismatch" }); // Token is not this users, but another users
		}

		req.decoded = decoded;
		next();
	});
}

const verifyRefreshToken = (token, username, res) => {
	try {
		// Verify the token and decode the payload
		const decoded = jwt.verify(token, REFRESH_SECRET);

		if (decoded.username !== username) {
			return res.status(404).send({ status: false, message: "Token mismatch" });
		}

		if (decoded.privs == "victim") {
			mongodb.Victims.findOne({ refreshToken: token }, (err, doc) => {
				if (err || !doc) {
					return res.status(401).send({
						status: false,
						message: "Invalid refresh token",
					});
				}
				// Check that the refresh token has not expired
				if (doc.expires < new Date()) {
					return res.status(401).send({
						status: false,
						message: "Refresh token has expired",
					});
				}
				// Generate a new JWT for the user with the ID stored in the refresh token
				const jwt = generateJwtToken(decoded.username, decoded.privs);
				// Send the new JWT to the client
				res.send({ status: true, freshJwt: jwt });
			});
		}
	} catch (err) {
		if (err.message == "jwt expired")
			return res.send({
				status: false,
				message: "Refresh token has expired",
			});
		return res.send({
			status: false,
			mesage: "Invalid refresh token",
		});
	}
};

const fileUploadMiddleware = (req, res, next) => {
	const uploadkey = req.headers["uploadkey"];

	if (uploadkey == undefined) {
		return res.status(403).send({ status: true, mesage: "Unauthorized" });
	}

	if (uploadkey !== process.env.UPLOADKEY) {
		return res.status(403).send({ status: true, message: "Unauthorized" });
	}
	next();
};

module.exports = {
	fileUploadMiddleware,
	generateJwtToken,
	verifyJWT,
	generateRefreshToken,
	verifyRefreshToken,
};

// sl1de
