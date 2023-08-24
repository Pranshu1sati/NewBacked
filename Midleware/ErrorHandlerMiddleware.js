exports.RouterAsncErrorHandler = (middleware) => (req, res, next) => Promise.resolve(middleware(req, res, next)).catch(next)   //resolve controller async errors .

exports.ErrorHandlerMiddleware = (error, req, res, next) => {
    let type = "InternalServerError"
    let message = "Try again."
    let path = "unknown"

    if (error.status === 450) {
        message = error.message
        type = error.type
        path = error.path
    }

    if (error.code === 11000) {
        type = "DuplicateDataError"
        message = `${Object.values(error.keyValue)[0]} already exists.`
        path = Object.keys(error.keyPattern)[0]
    }
    console.log(error);
    return res.status(400).json({
        type,
        message,
        path
    })
}