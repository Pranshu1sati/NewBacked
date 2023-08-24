const { RouterAsncErrorHandler } = require("../Midleware/ErrorHandlerMiddleware")
const { DepartmentModal, TeacherModal } = require("../Models")
const { NotFoundError } = require("../Utility/CustomErrors")
const { default: mongoose } = require("mongoose")
const excelJs = require('exceljs');

const fs = require("fs-extra")



const removeHodDepartmentRelation = async (department) => {
    const teacher = department.HOD
    if (teacher) {
        const teacherUpdate = await TeacherModal.findById(teacher)
        await department.updateOne({ $unset: { HOD: 1 } })
        await teacherUpdate.updateOne({ isHod: false })
    }
}


exports.registerDepartment = RouterAsncErrorHandler(async (req, res, next) => {
    const { name, campus } = req.body
    const department = await DepartmentModal.create({ name: name.toUpperCase(), campus })
    if (!department) throw new Error()
    res.json({ id: department.id })
})



exports.addFileData = RouterAsncErrorHandler(async (req, res, next) => {
    req.fileData = {
        path: `./file/department/bulk`,
        fileName: `department_bulk_register`
    }
    await fs.remove(req.fileData.path)
    return next()
})

exports.bulkRegister = RouterAsncErrorHandler(async (req, res, next) => {
    const file = req.files.registerDepartment[0]

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
        const campus = row.getCell(2).value;
        if (name && campus) data.push({ name, campus })
        else responseData.failed++
    })



    if (data.length === 0) throw new Error("")

    // console.log(data);
    await Promise.all(data.map(async (dep) => {
        const val = new DepartmentModal(dep)
        await val.validate().catch(() => { responseData.failed++ })
        await DepartmentModal.create(dep).then(() => {
            responseData.created++
        }).catch(() => {
            responseData.failed++
        })
    })).catch(() => {
        throw new Error()
    })

    res.json(responseData)

    // res.send("ok")
})


exports.deleteDepartment = RouterAsncErrorHandler(async (req, res, next) => {

    res.json({ success: true })
})




exports.getDepartment = RouterAsncErrorHandler(async (req, res, next) => {
    const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 0
    const skip = Number(req.query.page) ? (Number(req.query.page) - 1) * limit : 0

    const department = await DepartmentModal.find().select(["-teachers"]).skip(skip).limit(limit).select(["-unVerifiedQualifications"]).populate({
        path: "HOD",
        select: ["id", "name"]

    })
    if (!department || department.length === 0) throw new NotFoundError("department data", "department")
    res.json(department)
})




exports.getDepartmentById = RouterAsncErrorHandler(async (req, res, next) => {
    const { id } = req.params
    const department = await DepartmentModal.findById(id).select(["-unVerifiedQualifications"]).populate({
        path: "teachers", select: ["name", "id"]
    }).populate({
        path: "HOD",
        select: ["id", "name"]

    })
    if (!department) throw new NotFoundError(id, "department")
    res.json(department)
})


exports.getTeachersByDepartmet = RouterAsncErrorHandler(async (req, res, next) => {
    const { departmentId } = req.body
    const department = await DepartmentModal.findById(departmentId).select(["teachers"]).populate({
        path: "teachers",
        select: ["name", "id", "isHod"]
    })
    if (!department) throw new NotFoundError(departmentId, "department")
    if (department.teachers.length === 0) throw new NotFoundError(departmentId, "teacher")
    res.json(department?.teachers)
})



exports.addTeacher = RouterAsncErrorHandler(async (req, res, next) => {
    const { teacherId, departmentId } = req.body
    const teacher = await TeacherModal.findById(teacherId)
    const department = await DepartmentModal.findById(departmentId)

    if (!teacher) throw new NotFoundError(teacherId, "teacherId")
    if (!department) throw new NotFoundError(departmentId, "departmentId")

    if (department.teachers.includes(teacher.id)) throw new DuplicateDataError(`${teacher.name}  in ${department.name} `, "addTeacher")

    teacher.department = department.id
    department.teachers.push(teacher.id)
    await department.save()
    await teacher.save()
    res.json({ success: true })
})

exports.removeTeacher = RouterAsncErrorHandler(async (req, res, next) => {
    const { teacherId, departmentId } = req.body
    const teacher = await TeacherModal.findById(teacherId)
    const department = await DepartmentModal.findById(departmentId)


    if (!teacher) throw new NotFoundError(teacherId, "teacherId")
    if (!department) throw new NotFoundError(departmentId, "departmentId")

    if (teacher.isHod) await removeHodDepartmentRelation(department)
    await teacher.updateOne({ $unset: { department: 1 } })
    await department.updateOne({ $pull: { teachers: teacher.id } })
    res.json({ success: true })
})

exports.addHod = RouterAsncErrorHandler(async (req, res, next) => {
    const { teacherId, departmentId } = req.body
    const teacher = await TeacherModal.findById(teacherId)
    const department = await DepartmentModal.findById(departmentId)

    if (!teacher) throw new NotFoundError(teacherId, "teacherId")
    if (!department) throw new NotFoundError(departmentId, "departmentId")

    if (!department.teachers.includes(teacher.id)) throw new Error() //change error here

    if (teacher.isHod) throw new Error("")
    if (!!department.HOD) await removeHodDepartmentRelation(department)

    teacher.isHod = true
    department.HOD = teacher.id
    await teacher.save()
    await department.save()
    res.json({ success: true })
})


exports.removeHod = RouterAsncErrorHandler(async (req, res, next) => {
    const { departmentId } = req.body
    const department = await DepartmentModal.findById(departmentId)
    if (!department) throw new NotFoundError(departmentId, "departmentId")
    await removeHodDepartmentRelation(department)
    res.json({ success: true })
})


exports.changeView = RouterAsncErrorHandler(async (req, res, next) => {
    const { teacherId } = req.body
    const user = await TeacherModal.findById(teacherId)
    if (!user) throw new NotFoundError(teacherId, "teacherId")
    user.view = !user.view
    await user.save()
    res.send({ success: true })
})

exports.getUnverifiedQualifications = RouterAsncErrorHandler(async (req, res, next) => {
    const { id: departmentId } = req.params
    const department = await DepartmentModal.findById(departmentId).select(["unVerifiedQualifications"]).populate({
        path: "unVerifiedQualifications",
        select: ["id", "teacher", "description"],
        populate: {
            path: "teacher",
            select: ["id", "name"]
        }
    })
    // console.log(department);
    if (!department || department.length === 0) throw new NotFoundError(departmentId, "departmentId")

    res.json(department?.unVerifiedQualifications)
})