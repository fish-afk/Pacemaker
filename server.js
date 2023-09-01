const express = require('express');

const app = express();

const port = 3000 || process.env.PORT;

const CoreRouter = require('./routers/CoreRouter')
const FileServerRouter = require('./routers/fileServerRouter')

app.use('/core', CoreRouter);
app.use('/files', FileServerRouter)

app.listen(port, () => {
    console.log("App is listening on " + port)
})
