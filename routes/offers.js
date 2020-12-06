const tools = require("../tools");

/////////////
// M A I N //
/////////////

module.exports = async (req, res) => {
	tools
		.getOffers("hamburg")
		.then((results) => {
			res.send(results);
		})
		.catch((err) => {
			console.log(err);
		});
};
