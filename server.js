require("dotenv").config();
const express = require("express");

const app = express();

const port = process.env.PORT || 3000;

const CoreRouter = require("./routers/CoreRouter");
const FileServerRouter = require("./routers/fileServerRouter");

app.use("/core", CoreRouter);
app.use("/files", FileServerRouter);

app.listen(port, () => {
	console.log("App is listening on " + port);
});
