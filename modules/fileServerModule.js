const path = require('path');

function serveStaticFile(req, res) {
	const requestedPath = req.params.filename;
	const staticFolder = path.join(__dirname, "../servedFiles");
	const filePath = path.resolve(path.join(staticFolder, requestedPath));

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

module.exports = { serveStaticFile }
