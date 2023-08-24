const express = require("express")
const { check } = require("express-validator")
const { routeCredentialValidator } = require("../Midleware/CredintialsValidator")
const {
    registerDepartment,
    deleteDepartment,
    getDepartmentById,
    getDepartment,
    addTeacher,
    removeTeacher,
    addHod,
    removeHod,
    changeView,
    getTeachersByDepartmet,
    getUnverifiedQualifications,
    bulkRegister,
    addFileData
} = require("../Controller/DepartmentController")
const { upload } = require('../Utility/multerDiskStorage')



const Router = express.Router()

Router.route("/register").post([
    check("name").exists().isLength({ min: 3 }),
    check("campus").exists().isIn(["GEU", "GEHU-dehradun", "GEHU-bheemtal", "GEMS"])

], routeCredentialValidator, registerDepartment)



Router.route("/bulk").post(
    addFileData,
    upload.fields([{ name: "registerDepartment", maxCount: 1 }]),
    bulkRegister)

Router.route("/delete/:id").get([check("id").exists().isMongoId()], routeCredentialValidator, deleteDepartment)

Router.route("/info/:id").get([check("id").exists().isMongoId()], routeCredentialValidator, getDepartmentById)

Router.route("/info").get([
    check("page").optional().isNumeric(),
    check("limit").optional().isNumeric()
], routeCredentialValidator, getDepartment)

Router.route("/addteacher").post([
    check("departmentId").exists().isMongoId(),
    check("teacherId").exists().isMongoId()
], routeCredentialValidator,
    addTeacher)

Router.route("/removeteacher").post([
    check("departmentId").exists().isMongoId(),
    check("teacherId").exists().isMongoId(),
    routeCredentialValidator,
], removeTeacher)


Router.route("/addhod").post([
    check("departmentId").exists().isMongoId(),
    check("teacherId").exists().isMongoId(),
], routeCredentialValidator,
    addHod)

Router.route("/removehod").post([
    check("departmentId").exists().isMongoId()
], routeCredentialValidator, removeHod)


Router.route("/changeview").post([
    check("teacherId").exists().isMongoId()
], routeCredentialValidator, changeView)


Router.route("/teachers").post([
    check("departmentId").exists().isMongoId()
], routeCredentialValidator, getTeachersByDepartmet)


Router.route("/unverified/qualification/:id").get([
    check("id").exists().isMongoId()
], routeCredentialValidator, getUnverifiedQualifications)
module.exports = Router