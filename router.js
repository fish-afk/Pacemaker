const express = require('express')
const router = express.Router();
const Module = require('./module')

router.get('/getcmd', Module.GETCMD);
router.get('/postresult', Module.recieve_result);
router.get('/idied', Module.funeral);

module.exports = router;