

const { validationResult } = require('express-validator')
const { CredentialError } = require("../Utility/CustomErrors")


exports.routeCredentialValidator = (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
        const result = validationResult(req).errors[0]
        throw new CredentialError(result.value, result.path)

    } else return next()
}
