exports.CustomError = class extends Error {
    constructor(message, path, type) {
        super(message)
        this.type = type
        this.path = path
        this.status = 450
    }
}


exports.CredentialError = class extends exports.CustomError {
    constructor(message, path) {
        super(`${message} is invalid`, path, "CredentialError")
    }
}

exports.NotFoundError = class extends exports.CustomError {
    constructor(message, path) {
        super(`${message} not found`, path, "NotFoundError")
    }
}

exports.AuthenticationError = class extends exports.CustomError {
    constructor(path) {
        super(`you are unauthorized`, path, "AuthenticationError")
    }
}

exports.DuplicateDataError = class extends exports.CustomError {
    constructor(message, path) {
        super(`${message} already exists.`, path, "DuplicateDataError")
    }
}