const axios = require('axios');
const cheerio = require('cheerio');

/////////////
// D A T A //
/////////////

const url = 'https://www.durstexpress.de/';

const areas = [
	{ name: 'hamburg' },
	{ name: 'hamburg2' },
	{ name: 'hannover' },
	{ name: 'bochum' },
	{ name: 'wiesbaden' },
	{ name: 'berlin2' },
	{ name: 'leipzig' },
	{ name: 'dresden' },
	{ name: 'nuernberg' },
	{ name: 'augsburg' },
	{ name: 'muenchen' },
];

/////////////
// H E L P //
/////////////

const getOffers = async area => {
	try {
		const response = await axios.get(url + area);

		const $ = await cheerio.load(response.data); // CREATE CHEERIO OBJECT FROM URL

		const offerItemsMap = $('div.products-list-sale div.product-item-details') // PARSE NAMES AND PRICES OF ITEMS
			.map(async (i, elem) => {
				let itemName = $(elem).children().first().children().text().replace('\n', '').replace(' l ', ' l');
				let offerPrice = parseFloat($(elem).children().first().next().children().first().find($('.price-wrapper')).attr('data-price-amount'));
				let offerPriceDisplay = $(elem).children().first().next().children().first().children().children().next().text();
				let regularPrice = parseFloat($(elem).children().first().next().children().last().find($('.price-wrapper')).attr('data-price-amount'));
				let regularPriceDisplay = $(elem).children().first().next().children().last().children().children().next().text();
				let discount = parseInt($(elem).parent().before().find($('.prozent-ersparnis')).text().replace(' %', ''));
				let discountDisplay = $(elem).parent().before().find($('.prozent-ersparnis')).text();

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

const isItemOnSale = async (saleItems, itemToLookFor) => {
	return saleItems.some(item => item.itemName.includes(itemToLookFor));
};

const validateArea = async area => {
	if (areas.some(i => i.name.includes(area))) {
		return area;
	}
};

const beautifyAreaName = str => {
	const beautified = str.replace('ue', 'ü').replace('ae', 'ä').replace('oe', 'ö').replace(/[0-9]/g, ''); // REPLACE UMLAUTS AND REMOVE NUMBERS
	const capitalized = beautified[0].toUpperCase() + beautified.slice(1);
	return capitalized;
};

const createErrorObject = param => {
	const areasArray = [];
	areas.forEach(area => {
		areasArray.push(area.name);
	});
	const errorObject = [
		{
			code: 409,
			text: 'Conflict',
			description: 'Invalid route parameter',
			data: {
				requested: param,
				available: areasArray,
			},
		},
	];
	return errorObject;
};

const handleNetworkError = error => {
	if (error.response) {
		console.error(error.response.status);
	} else if (error.request) {
		console.error(error.request);
	} else {
		console.error('Error', error.message);
	}
};

module.exports = { getOffers, isItemOnSale, validateArea, beautifyAreaName, createErrorObject, handleNetworkError };
