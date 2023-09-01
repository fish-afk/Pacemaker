const express = require("express");
const router = express.Router();
const Module = require("../modules/fileServerModule");
const Multermiddleware = require("../middleware/multer");

router.get('/getFile', Module.serveStaticFile)
router.post('/uploadfile', Multermiddleware.upload.single('file'), Module.uploadStaticFile)

module.exports = router;
