const express = require("express");
const router = express.Router();
const Module = require("../modules/fileServerModule");
const multerMiddleware = require("../middleware/multer");
const authMiddleware = require("../middleware/authMiddleware")

router.get("/getFile", Module.serveStaticFile);
router.post(
	"/uploadfile",
	authMiddleware.fileUploadMiddleware,
	multerMiddleware.upload.single("file"),
	Module.uploadStaticFile,
);

module.exports = router;
