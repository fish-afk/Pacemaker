const path = require('path');

function serveStaticFile(req, res) {
	const Filename = req.query.filename;
	if (Filename == undefined) {
		return res.status(400).send({ status: false, message: 'Please specify a filename' })
	}
	const staticFolder = path.join(__dirname, "../servedFiles");
	const filePath = path.resolve(path.join(staticFolder, Filename));

	if (!filePath.startsWith(staticFolder)) {
		res.status(403).send({status: false, message: "Forbidden"});
		return;
	}

	res.sendFile(filePath, (err) => {
		if (err) {
			res.status(404).send({ status: false, message: "File not found" });
		}
	});
}

function uploadStaticFile(req, res) {
	if (!req.file) {
		res.status(400).send({ status: false, message: "No file uploaded." });
		return;
	}
	return res.status(200).send({ status: true, message: "File uploaded successfully." });
}

module.exports = { serveStaticFile, uploadStaticFile }
