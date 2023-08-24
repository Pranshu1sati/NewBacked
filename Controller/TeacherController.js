const { TeacherModal } = require("../Models")
const { RouterAsncErrorHandler } = require("../Midleware/ErrorHandlerMiddleware")
const mongoose = require("mongoose")
const { NotFoundError, CredentialError } = require("../Utility/CustomErrors")
const fs = require("fs-extra")
const excelJs = require('exceljs');


exports.registerTeacher = RouterAsncErrorHandler(async (req, res, next) => {
    const { name, employeeId, password, email } = req.body
    const teacher = await TeacherModal.create({ name, employeeId, password, email })
    if (!teacher) throw new Error()
    res.json({ id: teacher.id })
})

exports.addBulkFileData = RouterAsncErrorHandler(async (req, res, next) => {
    req.fileData = {
        path: `./file/teachers/bulk`,
        fileName: `teachers_bulk_register`
    }
    await fs.remove(req.fileData.path)
    return next()
})

exports.bulkReister = RouterAsncErrorHandler(async (req, res, next) => {

    const file = req.files.registerTeacher[0]
    const responseData = {
        created: 0,
        failed: 0
    }
    if (!file) throw new Error("file not found")
    const workbook = new excelJs.Workbook()
    const data = []
    await workbook.xlsx.readFile(file.path)
    const worksheet = workbook.getWorksheet(1)
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber == 1) return
        const name = row.getCell(1).value;
        const employeeId = row.getCell(2).value;
        const email = row.getCell(4).value

        if (name && employeeId && email) data.push({
            name,
            employeeId,
            email,
            password: "Moodle@123"
        })
        else responseData.failed++
    })
    if (data.length === 0) throw new Error("")



    await Promise.all(data.map(async (teacher) => {

        const val = new TeacherModal(teacher)
        await val.validate().catch(() => { responseData.failed++ })
        await TeacherModal.create(teacher).then(() => {
            responseData.created++
        }).catch(() => {
            responseData.failed++
        })
    })).catch(() => {
        throw new Error()
    })
    res.json(responseData)
})


exports.deleteTeacher = RouterAsncErrorHandler(async (req, res, next) => {
    res.json({ success: true })
})

exports.updateTeacher = RouterAsncErrorHandler(async (req, res, next) => {
    res.json({ success: true })
})


exports.getTeacherInfoById = RouterAsncErrorHandler(async (req, res, next) => {
    const { id } = req.params
    const teacher = await TeacherModal.findById(id).select(["-password"]).populate({
        path: "department",
        select: ["name", "id"]
    }).populate({
        path: "qualification",
    })
    if (!teacher) throw new NotFoundError(id, "teacher")
    res.json(teacher)
})

exports.getTeachersData = RouterAsncErrorHandler(async (req, res, next) => {
    const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 0

    const skip =
        Number(req.query.page) ? (Number(req.query.page) - 1) * limit : 0

    const teachers = await TeacherModal.find().skip(skip).limit(limit).select(["-qualification", "-password"]).populate({
        path: "department", select: ["name", "id"]
    })
    if (!teachers || teachers.length === 0) throw new NotFoundError("teacher data ", "teacher")
    res.json(teachers)
})

exports.toggelAccountActivation = RouterAsncErrorHandler(async (req, res, next) => {
    const { teacherId, option } = req.body
    const teacher = await TeacherModal.findById(teacherId)
    if (!teacher) throw new NotFoundError("teacher data ", "teacher")
    teacher.active = option
    await teacher.save()
    res.json({ success: true })
})

exports.addFileData = RouterAsncErrorHandler(async (req, res, next) => {
    const teacherId = req.headers?.teacherid
    if (!mongoose.isValidObjectId(teacherId)) throw new CredentialError(teacherId, "teacherId")
    const teacher = await TeacherModal.findById(teacherId)
    if (!teacher) throw new NotFoundError(teacherId, "teacher")
    req.fileData = {
        path: `./file/teacher/${teacher.name}_${teacher.id}`,
        fileName: `${teacher.name}_${teacher.id}`
    }
    await fs.remove(req.fileData.path)
    req.teacher = teacher
    return next()
})


exports.uploadImage = RouterAsncErrorHandler(async (req, res, next) => {
    const file = req.file
    req.teacher.photo_url = `${file.destination}/${file.filename}`
    await req.teacher.save()
    res.json({ success: true })
})