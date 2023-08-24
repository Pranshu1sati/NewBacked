const { StudentModal } = require("../Models")
const { RouterAsncErrorHandler } = require("../Midleware/ErrorHandlerMiddleware")
const { NotFoundError } = require("../Utility/CustomErrors")



exports.createStudent = RouterAsncErrorHandler(async (req, res, next) => {
    const { name, univ_rollno, placement_data, research_data, post_grad_data } = req.body


    const student = await StudentModal.create({
        name,
        univ_rollno,
        placement_data,
        post_grad_data
    })

    if (!student) throw new Error()

    res.json({
        id: student.id
    })

})


exports.getAllStudents = RouterAsncErrorHandler(async (req, res, next) => {


    const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 0
    const skip = Number(req.query.page) ? (Number(req.query.page) - 1) * limit : 0
    const student = await StudentModal.find().skip(skip).limit(limit)
    if (!student || student.length === 0) throw new NotFoundError("student data", "student")
    res.json(student)
})