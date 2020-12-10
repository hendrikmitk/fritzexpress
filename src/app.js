const tools = require("../src/tools");
const express = require("express");
const app = express();
const Twitter = require("twitter-lite");
require("dotenv").config();

/////////////
// D A T A //
/////////////

const client = new Twitter({
	subdomain: "api", // "api" is the default (change for other subdomains)
	version: "1.1", // version "1.1" is the default (change for other subdomains)
	consumer_key: process.env.API_KEY, // from Twitter.
	consumer_secret: process.env.API_SECRET_KEY, // from Twitter.
	access_token_key: process.env.ACCESS_TOKEN, // from your User (oauth_token)
	access_token_secret: process.env.ACCESS_TOKEN_SECRET, // from your User (oauth_token_secret)
});

/////////////
// H E L P //
/////////////

const sendTweet = async (content) => {
	await client.post("statuses/update", { status: content }).catch((err) => console.log(err));
};

/////////////////
// R O U T E S //
/////////////////

app.get("/fritzexpress/:area/offers", (req, res) => {
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
			tools.handleNetworkError(err);
		});
});

app.get("/fritzexpress/:area/tweet", (req, res) => {
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
			const today = new Date();
			const date = today.getDate() + "." + (today.getMonth() + 1) + "." + today.getFullYear();
			const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
			const messageText = `Sonderangebote bei durstexpress.de am ${date} um ${time}:\n\n${results[0].itemName}, ${results[0].offer.offerPriceDisplay} statt ${results[0].regular.regularPriceDisplay} (${results[0].discountDisplay})\n${results[1].itemName}, ${results[1].offer.offerPriceDisplay} statt ${results[1].regular.regularPriceDisplay} (${results[1].discountDisplay})\n${results[2].itemName}, ${results[2].offer.offerPriceDisplay} statt ${results[2].regular.regularPriceDisplay} (${results[2].discountDisplay})\n\nProst!`;
			res.status(200).send(messageText);
			sendTweet(messageText);
		})
		.catch((err) => {
			tools.handleNetworkError(err);
		});
});

/////////////////
// L I S T E N //
/////////////////

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ..`));
