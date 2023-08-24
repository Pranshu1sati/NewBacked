const express = require("express")
const { registerTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacherInfoById,
    getTeachersData,
    toggelAccountActivation,
    addFileData,
    uploadImage,
    addBulkFileData,
    bulkReister

} = require("../Controller/TeacherController")
const { check } = require("express-validator")
const { routeCredentialValidator } = require("../Midleware/CredintialsValidator")
const { upload } = require('../Utility/multerDiskStorage')



const Router = express.Router()

Router.route("/register").post([
    check("name").exists().isLength({ min: 3 }),
    check("employeeId").exists().isLength({ min: 15, max: 15 }),
    check("email").exists().isEmail(),
    check("password").optional().isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })
], routeCredentialValidator, registerTeacher)

Router.route("/bulk").post(
    addBulkFileData,
    upload.fields([{ name: "registerTeacher", maxCount: 1 }]),
    bulkReister
)

Router.route("/update/:id").post([
    check("id").exists().isMongoId()
], updateTeacher)


Router.route("/delete/:id").get([
    check("id").exists().isMongoId()
], deleteTeacher)

Router.route("/info/:id").get([
    check("id").exists().isMongoId()
], routeCredentialValidator, getTeacherInfoById)


Router.route("/info").get([
    check("page").optional().isNumeric(),
    check("limit").optional().isNumeric()
], routeCredentialValidator, getTeachersData)


Router.route("/activate").post([
    check("teacherId").exists().isMongoId(),
    check("option").exists().isBoolean()

], routeCredentialValidator, toggelAccountActivation)

Router.route("/upload").post(
    addFileData,
    upload.single("teacherImage"),
    uploadImage
)

module.exports = Router