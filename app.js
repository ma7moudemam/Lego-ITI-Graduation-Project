const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const body_parser = require("body-parser");

const app = express();
mongoose
	.connect(process.env.DB_URL || 27017)
	.then(() => {
		app.listen(process.env.PORT || 8080, () => {
			console.log("I am Listenining .......");
		});
	})
	.catch((error) => console.log("ERROR IN DATABASE!!"));

app.use(morgan(":method :url"));

app.use((request, response, next) => {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
	response.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
	next();
});

app.use(body_parser.json());

///////  Router

////////

// Not Found MW
app.use((request, response, next) => {
	response.status(404).json({ data: "Not Found" });
});

// Error MW
app.use((error, request, response, next) => {
	let status = error.status || 500;
	response.status(status).json({ Error: error + "" });
});
