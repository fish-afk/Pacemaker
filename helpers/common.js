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
    getCurrentDate,
    reverser
}