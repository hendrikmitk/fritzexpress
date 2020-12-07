const tools = require("../tools");
const express = require("express");
const router = express.Router();

/////////////
// M A I N //
/////////////

router.get("/:area", (req, res) => {
	tools
		.validateArea(req.params.area)
		.then((validatedArea) => {
			if (!validatedArea) {
				res.status(404).send(JSON.stringify(tools.areas));
			} else {
				return validatedArea;
			}
		})
		.then((validArea) => tools.getOffers(validArea))
		.then((results) => {
			res.status(200).send(results);
		})
		.catch((err) => {
			console.log(err);
		});
});

module.exports = router;
