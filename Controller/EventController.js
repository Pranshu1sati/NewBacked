const { EventModal } = require("../Models")
const { RouterAsncErrorHandler } = require("../Midleware/ErrorHandlerMiddleware")
const { NotFoundError } = require("../Utility/CustomErrors")
const { default: mongoose } = require("mongoose")
const { CredentialError } = require("../Utility/CustomErrors")

exports.addEvent = RouterAsncErrorHandler(async (req, res, next) => {
    const {
        name, date, department, attendence
    } = req.body

    const event = await EventModal.create({ name, date, attendence, department })

    if (!event) throw new Error()

    res.json({
        id: event.id
    })
})



exports.getAllEvent = RouterAsncErrorHandler(async (req, res, next) => {
    const { departmentId } = req.query

    const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 0
    const skip = Number(req.query.page) ? (Number(req.query.page) - 1) * limit : 0
    const filter = departmentId ? { department: new mongoose.Types.ObjectId(departmentId) } : {}
    const event = await EventModal.find(filter).skip(skip).limit(limit)
    if (!event || event.length === 0) throw new NotFoundError("event data", "event")
    res.json(event)
})


exports.getEventById = RouterAsncErrorHandler(async (req, res, next) => {
    const { id } = req.params
    const event = await EventModal.findById(id)
    if (!event) throw new NotFoundError(id, "evene")
    res.json(event)
})


exports.addFileData = RouterAsncErrorHandler(async (req, res, next) => {
    const eventId = req.headers?.eventid
    if (!mongoose.isValidObjectId(eventId)) throw new CredentialError(eventId, "eventId")
    const event = await EventModal.findById(eventId)
    if (!event) throw new NotFoundError(eventId, "event")
    req.fileData = {
        path: `./file/events/${event.name}_${event.id}`,
        fileName: `${event.name}_${event.id}`
    }
    req.event = event
    return next()
})


exports.uploadData = RouterAsncErrorHandler(async (req, res, next) => {
    req.event.images = req.files.eventImage.map((file) => ({ path: `${file.destination}/${file.filename}` }))
    await req.event.save()
    res.json({ success: true })
})