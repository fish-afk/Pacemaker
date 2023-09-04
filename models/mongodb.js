const mongoose = require("mongoose");

const DBURI = process.env.DBURI;

mongoose.connect(DBURI);

const Cat = mongoose.model("Cat", { name: String });

module.exports = {
	Cat,
};
