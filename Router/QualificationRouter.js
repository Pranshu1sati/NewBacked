const express = require("express")
const { check } = require("express-validator")
const { routeCredentialValidator } = require("../Midleware/CredintialsValidator")
const {
    addQualification,
    validateQualificaiton,
    addFileData,
    uploadImage
} = require("../Controller/QualificationController")

const { upload } = require('../Utility/multerDiskStorage')

const Router = express.Router()

Router.route("/add").post([
    check("teacherId").exists().isMongoId(),
    check("description").exists()
], routeCredentialValidator, addQualification)

Router.route("/validate").post([
    check("qualificationId").exists().isMongoId(),
    check("departmentId").exists().isMongoId(),
    check("option").exists().isBoolean()
],
    routeCredentialValidator, validateQualificaiton)



Router.route("/upload").post(
    addFileData,
    upload.single("qualification"),
    uploadImage
)
module.exports = Router