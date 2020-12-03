# fritzexpress

A service checking special offers on [durstexpress.de](https://www.durstexpress.de/hamburg/).

## Description

fritzexpress is a Node.js app that parse and exposes the special offers on durstexpress.de, a German online beverage delivery service using web scraping.

fritzexpress is one of my first Node.js projects. Besides providing a REST API with Express, I wanted to use this project to learn how to work with web scraping. Unfortunately it does not work on Production as it turned out that durstexpress.de uses a DDoS protection which I did not manage to bypass yet.

## Roadmap

I want fritzexpress to automatically check the offers every week and store them in a database. The offers should then be displayed on a web application and distributed via a Twitter bot.

### ToDo

-   [x] provide an API endpoint and expose parsed data
-   [ ] create request params for all business area cities
-   [ ] add custom `fritzKolaOnSale` property (boolean)
-   [ ] solve JavaScript challenge and bypass DDoS protection

## Inspirations

-   n/a

## Dependencies

-   **[axios](https://www.npmjs.com/package/hooman)** - Promise based HTTP client for the browser and Node.js
-   **[Cheerio](https://www.npmjs.com/package/cheerio)** - Cheerio makes it easy to select, edit, and view DOM elements
-   **[Express](https://www.npmjs.com/package/express)** - Fast, unopinionated, minimalist web framework for Node.js

## Changelog

### 2020-12-03

-   set up project, initialize git repository
