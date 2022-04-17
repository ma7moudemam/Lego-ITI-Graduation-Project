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
const webhook = require("./api/weebhook");
const jwt = require("jsonwebtoken");
let refreshTokens = require("./refreshTokens");

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

function createAccessToken(email, role) {
	let token = jwt.sign(
		{
			email: email,
			role: role,
		},
		process.env.SECRET_KEY,
		{ expiresIn: "15m" }
	);
	return token;
}
function createRefreshToken(email, role) {
	let token = jwt.sign(
		{
			email: email,
			role: role,
		},
		process.env.REFRESH_SECRET_KEY
	);
	return token;
}

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

app.use(
	express.json({
		verify: (req, res, buf, encoding) => (req["rawBody"] = buf),
	})
);
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
app.post("/webhook", webhook);
app.post("/logout", (request, response) => {
	const refreshToken = request.body.token;
	refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
	response.status(200).json("You Logged out successfully");
});
app.post("/refresh", (request, response) => {
	const refreshToken = request.body.token;
	if (!refreshToken) return response.status(401).json("You are not authenticated");
	if (!refreshTokens.includes(refreshToken)) {
		return response.status(403).json("Refresh token is not valid");
	}
	jwt.decode(refreshToken);
	jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (error, user) => {
		error && console.log(error);
		refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
		const newAccessToken = createAccessToken(user.email, user.role);
		const newRefreshToken = createRefreshToken(user.email, user.role);
		refreshTokens.push(newRefreshToken);
		response.status(200).json({ token: newAccessToken, refreshToken: newRefreshToken });
	});
});
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
