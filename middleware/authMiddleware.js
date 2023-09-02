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

module.exports = { fileUploadMiddleware };
