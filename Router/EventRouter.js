const express = require("express")
const { check } = require("express-validator")
const { routeCredentialValidator } = require("../Midleware/CredintialsValidator")
const {
    addEvent,
    getAllEvent,
    getEventById,
    uploadData,
    addFileData } = require("../Controller/EventController")
const { upload } = require('../Utility/multerDiskStorage')

const Router = express.Router()


Router.route("/add").post([
    check("name").exists().isLength({ min: 3 }),
    check("date").exists().isISO8601().toDate(),
    check("department").exists().isMongoId(),
    check("attendence").exists().isNumeric()
], routeCredentialValidator, addEvent)

Router.route("/info/:id").get([
    check("id").exists().isMongoId()
], routeCredentialValidator, getEventById)


Router.route("/info").get([
    check("page").optional().isNumeric(),
    check("limit").optional().isNumeric(),
    check("departmentId").optional().isMongoId()
], routeCredentialValidator, getAllEvent)


Router.route("/upload").post(
    addFileData,
    upload.fields([{ name: "eventImage", maxCount: 5 }]),
    uploadData)

module.exports = Router