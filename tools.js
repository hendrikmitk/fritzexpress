const axios = require("axios");
const cheerio = require("cheerio");

/////////////
// D A T A //
/////////////

const url = "https://www.durstexpress.de/";

/////////////
// H E L P //
/////////////

const getOffers = async (area) => {
	try {
		const response = await axios.get(url + area);

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

module.exports = { getOffers };
