const express = require("express");
const router = express.Router();
const Module = require("../modules/adminModule");
const authMiddleware = require("../middleware/authMiddleware");

router.post('/login', Module.login)
router.post('/register', Module.register)
router.post('/refresh', Module.refresh)

module.exports = router;