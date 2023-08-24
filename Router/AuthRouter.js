const express = require("express")
const { check } = require("express-validator")
const { routeCredentialValidator } = require("../Midleware/CredintialsValidator")
const { loginUser, validateAuthenticationRequest } = require("../Controller/AuthController")
const passport = require("passport")

const Router = express.Router()


Router.route("/login").post([
    check("employeeId").exists().isLength({ min: 15, max: 15 }),
    check("password").exists().isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })
], routeCredentialValidator, loginUser)


Router.route("/authenticate").get(passport.authenticate(["jwt"], { session: false }), validateAuthenticationRequest)



module.exports = Router