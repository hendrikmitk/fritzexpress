const express = require("express");
const app = express();
app.use(express.json());

/////////////////
// R O U T E S //
/////////////////

const offers = require("./routes/offers");
app.use("/fritzexpress/offers", offers);

/////////////////
// L I S T E N //
/////////////////

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ..`));
