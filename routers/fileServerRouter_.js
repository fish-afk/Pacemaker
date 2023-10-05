const express = require("express");
const router = express.Router();
const Module = require("../modules/fileServerModule");
const multerMiddleware = require("../middleware/multer");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/getFile", authMiddleware.fileUploadMiddleware, Module.serveStaticFile);
router.put(
	"/uploadfile",
	authMiddleware.fileUploadMiddleware,
	multerMiddleware.upload.single("file"),
	Module.uploadStaticFile,
);

module.exports = router;
