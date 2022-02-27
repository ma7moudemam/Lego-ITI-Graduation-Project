require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const body_parser = require("body-parser");
<<<<<<< HEAD
// Routes
=======
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: (request, file, callback) => {
		callback(null, path.join(__dirname, "images"));
	},
	filename: (req, file, callback) => {
		callback(null, new Date().toLocaleDateString().replace(/\//g, "-") + "-" + file.originalname);
	},
});
const limits = { fileSize: 838861 };
const fileFilter = (request, file, callback) => {
	if (file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/png")
		callback(null, true);
};

>>>>>>> 9eb6275fe3ee5520c71ed0d88a3da0ad79857477
const authenticationRouter = require("./Routers/authenticationRouter");
const homeRouter = require('./Routers/homeRouter')
const accountRouter = require('./Routers/accountRouter')

const app = express();

const shopRouter = require("./Routers/shopRouter");
mongoose
	.connect(process.env.DB_URL)
	.then(() => {
		app.listen(process.env.PORT || 8080, () => {
			console.log(process.env.NODE_MODE);
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
// calling multer and giving static path for images
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(multer({ storage, limits, fileFilter }).single("image"));

///////  Router
app.use(authenticationRouter);
<<<<<<< HEAD
app.use('/account', accountRouter)
app.use('/home', homeRouter)
=======
app.use(shopRouter);
>>>>>>> 9eb6275fe3ee5520c71ed0d88a3da0ad79857477
////////

// Not Found MW
app.use((request, response, next) => {
	response.status(404).json({ data: "Not Found" });
});

// // Error MW
app.use((error, request, response, next) => {
	let status = error.status || 500;
	response.status(status).json({ Error: error + "" });
});
