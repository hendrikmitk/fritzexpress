const tools = require("../tools");
const express = require("express");
const router = express.Router();

/////////////
// M A I N //
/////////////

router.get("/:area", (req, res) => {
	tools
		.getOffers(req.params.area)
		.then((results) => {
			res.status(200).send(results);
		})
		.catch((err) => {
			console.log(err);
		});
});

module.exports = router;
