const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const { TeacherModal } = require("../Models")
exports.enablePassportJwtStrategy = (passport) => {
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT,
    }

    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            let user
            const teacher = await TeacherModal.findById(jwt_payload.id)
            //later add admin authentication

            if (teacher) {
                user = teacher
                if (!!user.isHod) user.role = "HOD"
                else user.role = "TEACHER"
            } else {
                console.log("here");
            }
            if (user) return done(null, user)
            return done(null, false)
        })
    )
}
