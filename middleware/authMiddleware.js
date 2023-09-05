const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

const generateJwtToken = (username, privs = "victim") => {
	const date = new Date();
	const JWT_EXPIRATION_TIME =
		privs === "admin"
			? Math.floor(date.getTime() / 1000) + 60 * 10 // 10 minutes from now if admin
			: Math.floor(date.getTime() / 1000) + 60 * 20; // 20 minutes from now if victim

	const freshJwt = jwt.sign(
		{ username, exp: JWT_EXPIRATION_TIME, privs: privs },
		JWT_SECRET,
	);

	return freshJwt;
};

function generateRefreshToken(username, privs = "victim") {
	const date = new Date();
	const REFRESH_EXPIRATION_TIME = date.setMonth(date.getMonth() + 1); // 1 month from now

	const refreshToken = jwt.sign(
		{ username, exp: REFRESH_EXPIRATION_TIME, privs: privs },
		REFRESH_SECRET,
	);

	return refreshToken;
}

function verifyJWT(req, res, next) {
	// Get the user's username from the decoded token
	const username = req.body["username"];
	const token = req.body["jwt-key"];

	if (!token) {
		return res.status(401).send({ auth: false, message: "No token provided." });
	}
	// Verify the JWT and check that it is valid
	jwt.verify(token, JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(404).send({ auth: false, message: err.message });
		}
		if (decoded.exp < Date.now() / 1000) {
			return res.status(401).send("JWT has expired");
		}
		// If the JWT is valid, save the decoded user information in the request object
		// so that it is available for the next middleware function
		if (decoded.username != username) {
			return res.status(404).send({ auth: false, message: "Token mismatch" }); // Token is not this users, but another users
		}

		req.decoded = decoded;
		next();
	});
}

const fileUploadMiddleware = (req, res, next) => {
	const uploadkey = req.headers["uploadkey"];

	if (uploadkey == undefined) {
		return res.status(403).send("Unauthorized");
	}

	if (uploadkey !== process.env.UPLOADKEY) {
		return res.status(403).send("Unauthorized");
	}
	next();
};

module.exports = {
	fileUploadMiddleware,
	generateJwtToken,
	verifyJWT,
	generateRefreshToken,
};
