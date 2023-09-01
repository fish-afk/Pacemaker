const express = require("express");
const router = express.Router();
const Module = require("../modules/fileServerModule");
const multerMiddleware = require("../middleware/multer");

router.get("/getFile", Module.serveStaticFile);
router.post(
	"/uploadfile",
	multerMiddleware.upload.single("file"),
	Module.uploadStaticFile,
);

module.exports = router;
