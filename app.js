require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const body_parser = require("body-parser");
const cors = require("cors");
// Routes
const multer = require("multer");
const path = require("path");
const authenticationRouter = require("./Routers/authenticationRouter");
const homeRouter = require("./Routers/homeRouter");
const accountRouter = require("./Routers/accountRouter");
const dashboardRouter = require("./Routers/dashboardRoute");
const wishlistRouter = require("./Routers/wishListRoute");
const orderRouter = require("./Routers/orderRouter");
const shopRouter = require("./Routers/shopRouter");
const cartRouter = require("./Routers/cartRouter");
const blacklistRouter = require("./Routers/blacklistRouter");
const createCheckoutSession = require("./api/checkout");

const app = express();
const storage = multer.diskStorage({
	destination: (request, file, callback) => {
		callback(null, path.join(__dirname, "images"));
	},
	filename: (req, file, callback) => {
		console.log("file", file);
		callback(null, new Date().toLocaleDateString().replace(/\//g, "-") + "-" + file.originalname);
	},
});
const limits = { fileSize: 838861 };
const fileFilter = (request, file, callback) => {
	if (file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/png")
		callback(null, true);
};

mongoose
	.connect(process.env.DB_URL)
	.then(() => {
		app.listen(process.env.PORT || 8080, () => {
			console.log(process.env.NODE_MODE);
		});
	})
	.catch((error) => console.log("ERROR IN DATABASE!!"));

app.use(morgan(":method :url"));

app.use(cors({ origin: true }));

// calling multer and giving static path for images
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(multer({ storage, limits, fileFilter }).single("images"));

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

///////  Router
app.use(authenticationRouter);
app.use("/account", accountRouter);
app.use("/home", homeRouter);
app.use(orderRouter);
app.use(shopRouter);
app.use(cartRouter);
app.use(dashboardRouter);
app.use(wishlistRouter);
app.use(blacklistRouter);
app.post("/create-checkout-session", createCheckoutSession);
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
