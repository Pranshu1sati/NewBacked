const express = require("express")
const { check } = require("express-validator")
const { routeCredentialValidator } = require("../Midleware/CredintialsValidator")
const passport = require("passport")
const { createStudent, getAllStudents } = require("../Controller/StudentController")



const Router = express.Router()


Router.route("/create").post([
    check("name").exists().isLength({ min: 3 }),
    check("univ_rollno").exists().isNumeric(),
],
    routeCredentialValidator,
    createStudent)


Router.route("/info").get([
    check("page").optional().isNumeric(),
    check("limit").optional().isNumeric(),
], routeCredentialValidator, getAllStudents)


module.exports = Router