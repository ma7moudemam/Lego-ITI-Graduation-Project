const { validationResult } = require("express-validator");
model.exports = function (request) {
	let errors = validationResult(request);
	let error = new Error();
	if (!errors.isEmpty()) {
		error.status = 422;
		error.message = error.array().reduce((current, object) => current + object.msg + " ", "");
		throw error;
	}
};
