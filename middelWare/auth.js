const jwt = require("jsonwebtoken");
const UserModel = require("./../Models/userModel");

const auth = async (req, res, next) => {

	const token = String(req.get("Authorization")).split(" ")[1];
	try {
		const decoded = jwt.verify(token, process.env.SECRET_KEY);

		if (decoded.role == "user") {
			try {
				const user = await UserModel.findOne({ email: decoded.user.email });
				if (!user) {
					throw new Error();
				}
				req.user = user;
				req.role = decoded.role;
				next();
			} catch (e) {
				res.status(401).send({ error: "Please authenticate" });
			}
		} else if (decoded.role == ("admin" || "shipper")) {
			req.email = decoded.email;
			req.role = decoded.role;
			next();
		}
	} catch (err) {
		res.status(401).send({ error: "Please authenticate" });
	}

};

module.exports = auth;
