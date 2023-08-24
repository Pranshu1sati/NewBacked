const jwt = require("jsonwebtoken")
const { RouterAsncErrorHandler } = require("../Midleware/ErrorHandlerMiddleware")
const { TeacherModal } = require("../Models")
const { NotFoundError, AuthenticationError } = require("../Utility/CustomErrors")





exports.loginUser = RouterAsncErrorHandler(async (req, res, next) => {
    const { employeeId, password } = req.body
    let user
    user = await TeacherModal.findOne({ employeeId }).select(["+password"])

    if (!user) {
        //check for admin
    }
    if (!user) throw new NotFoundError(`user with email ${employeeId}`, "email")

    if (!await user.comparePassword(password)) throw new AuthenticationError("password")
    const token = jwt.sign(
        {
            id: user.id,
        },

        process.env.JWT,
        { expiresIn: '1d' }
    )
    return res.json({ token: "Bearer " + token })
})


exports.validateAuthenticationRequest = RouterAsncErrorHandler(async (req, res, next) => {
    res.json({ success: true })
})