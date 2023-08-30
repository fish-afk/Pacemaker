const express = require('express');

const app = express();

const port = 3000 || process.env.PORT;

const router_main = require('./router')

app.use('/main', router_main);

app.listen(port, () => {
    console.log("App is listening on " + port)
})
