const { QualificationModal, TeacherModal, DepartmentModal } = require("../Models")
const { RouterAsncErrorHandler } = require("../Midleware/ErrorHandlerMiddleware")
const { NotFoundError, CredentialError } = require("../Utility/CustomErrors")
const mongoose = require("mongoose")


exports.addQualification = RouterAsncErrorHandler(async (req, res, next) => {
    const { teacherId, description } = req.body
    const teacher = await TeacherModal.findById(teacherId)
    if (!teacher) throw new NotFoundError(teacherId, "teacher")

    const qualification = await QualificationModal.create({ description, teacher: teacher.id })

    if (!qualification) throw new Error()
    teacher.qualification.push(qualification.id)
    await teacher.save()

    if (!teacher.department) return res.json({ success: true })

    const department = await DepartmentModal.findById(teacher.department)
    department.unVerifiedQualifications.push(qualification.id)
    department.save()
    res.json({ id: qualification.id })

})





exports.validateQualificaiton = RouterAsncErrorHandler(async (req, res, next) => {
    const { qualificationId, option, departmentId } = req.body
    const qualification = await QualificationModal.findById(qualificationId)
    if (!qualification) throw new NotFoundError(qualificationId, "qualification")
    const department = await DepartmentModal.findById(departmentId)
    if (!department) throw new NotFoundError(departmentId, "department")


    qualification.verified = option
    qualification.rejected = !option
    await qualification.save()

    await department.updateOne({ $pull: { unVerifiedQualifications: qualification.id } })

    res.json({ success: true })
})





exports.addFileData = RouterAsncErrorHandler(async (req, res, next) => {
    const qualificationId = req.headers?.qualificationid
    if (!mongoose.isValidObjectId(qualificationId)) throw new CredentialError(qualificationId, "qualification")

    const qualification = await QualificationModal.findById(qualificationId)
    if (!qualification) throw new NotFoundError(qualificationId, "qualification")

    const teacher = await TeacherModal.findById(qualification.teacher)
    if (!teacher) throw new NotFoundError(qualificationId, "qualification")

    req.fileData = {
        path: `./file/teacher/${teacher.name}_${teacher.id}/qualification/${qualification.description}_${qualification.id}`,
        fileName: `${qualification.description}_${qualification.id}`
    }
    req.qualification = qualification
    return next()
})


exports.uploadImage = RouterAsncErrorHandler(async (req, res, next) => {
    const file = req.file
    req.qualification.document = `${file.destination}/${file.filename}`
    await req.qualification.save()
    res.json({ success: true })
})