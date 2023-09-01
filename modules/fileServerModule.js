const path = require('path');

function serveStaticFile(req, res) {
	const Filename = req.query.filename;
	if (Filename == undefined) {
		return res.send('Please specify a filename')
	}
	const staticFolder = path.join(__dirname, "../servedFiles");
	const filePath = path.resolve(path.join(staticFolder, Filename));

	if (!filePath.startsWith(staticFolder)) {
		res.status(403).send("Forbidden");
		return;
	}

	res.sendFile(filePath, (err) => {
		if (err) {
			res.status(404).send("File not found");
		}
	});
}

function uploadStaticFile(req, res) {
	if (!req.file) {
		res.status(400).send("No file uploaded.");
		return;
	}
	return res.status(200).send("File uploaded successfully.");
}

module.exports = { serveStaticFile, uploadStaticFile }
