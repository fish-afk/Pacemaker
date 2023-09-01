const express = require("express");
const router = express.Router();
const Module = require("../modules/fileServerModule");

router.get('/getFile', Module.serveStaticFile)

module.exports = router;
