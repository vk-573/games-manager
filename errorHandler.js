class AppError extends Error {
	constructor(statusCode, message, dynamicMessage = "") {
		super(message);
		this.statusCode = statusCode;
		this.message = message;
        this.name = this.constructor.name;
        this.dynamicMessage = dynamicMessage; // message for logger context, must not be visible to the front
        // TODO add errorCodes for this generic class since it might be needed in front translations
	}
}

const errorHandler = (err, req, res, next) => {
	if (err.name == 'AppError') { // Expected error
        console.log("AppError", err)
		const { statusCode, message } = err;
		res.status(statusCode).json({
			statusCode,
			message,
		});
	} else { // Unexpected errors || Technical errors
        console.log("UnexpectedError", err)
		res.status(500).json({
			statusCode: 500,
			message: "Internal server error",
		});
	}
};

module.exports = {
	AppError,
	errorHandler,
};