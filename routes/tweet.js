const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();
const Twitter = require("twitter-lite");

/////////////
// D A T A //
/////////////

const url = "https://www.durstexpress.de/hamburg/";

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

const getOffers = async () => {
	try {
		const response = await axios.get(url);

		const $ = await cheerio.load(response.data); // CREATE CHEERIO OBJECT FROM URL

		const offerItemsMap = $("div.products-list-sale div.product-item-details") // PARSE NAMES AND PRICES OF ITEMS
			.map(async (i, elem) => {
				let itemName = $(elem).children().first().children().text().replace("\n", "").replace(" l ", " l");
				let offerPrice = parseFloat($(elem).children().first().next().children().first().find($(".price-wrapper")).attr("data-price-amount"));
				let offerPriceDisplay = $(elem).children().first().next().children().first().children().children().next().text();
				let regularPrice = parseFloat($(elem).children().first().next().children().last().find($(".price-wrapper")).attr("data-price-amount"));
				let regularPriceDisplay = $(elem).children().first().next().children().last().children().children().next().text();
				let discount = parseInt($(elem).parent().before().find($(".prozent-ersparnis")).text().replace(" %", ""));
				let discountDisplay = $(elem).parent().before().find($(".prozent-ersparnis")).text();

				return {
					itemName,
					offer: {
						offerPrice,
						offerPriceDisplay,
					},
					regular: {
						regularPrice,
						regularPriceDisplay,
					},
					discount,
					discountDisplay,
				};
			})
			.get();

		return Promise.all(offerItemsMap);
	} catch (err) {
		throw err;
	}
};

async function sendTweet(content) {
	await client.post("statuses/update", { status: content }).catch((err) => console.log(err));
}

/////////////
// M A I N //
/////////////

module.exports = async (req, res) => {
	getOffers()
		.then((results) => {
			const today = new Date();
			const date = today.getDate() + "." + (today.getMonth() + 1) + "." + today.getFullYear();
			const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
			const messageText = `Sonderangebote bei durstexpress.de am ${date} um ${time}:\n\n${results[0].itemName}, ${results[0].offer.offerPriceDisplay} statt ${results[0].regular.regularPriceDisplay} (${results[0].discountDisplay})\n${results[1].itemName}, ${results[1].offer.offerPriceDisplay} statt ${results[1].regular.regularPriceDisplay} (${results[1].discountDisplay})\n${results[2].itemName}, ${results[2].offer.offerPriceDisplay} statt ${results[2].regular.regularPriceDisplay} (${results[2].discountDisplay})\n\nProst!`;
			res.send(messageText);
			sendTweet(messageText);
		})
		.catch((err) => {
			console.log(err);
		});
};
