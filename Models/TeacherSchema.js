const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
TeacherSchema = new Schema({
    employeeId: {
        type: String,
        unique: true,
        required: true

    },
    name: {
        type: String,
        required: true,
    },
    photo_url: {
        type: String,
        // required: true,
    },
    dateOfJoining: {
        type: Date,
        // required: true,
    },
    designation: {
        type: String,
        enum: ["Assistant Professor", "Associate Professor", "Professor"],
        default: "Assistant Professor"
    },

    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },

    isHod: {
        type: Boolean,
        default: false
    },
    view: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: false
    },
    department: {
        type: mongoose.Types.ObjectId,
        ref: "Department"
    },
    qualification: [{
        type: mongoose.Types.ObjectId,
        ref: "Qualification"
    }]
})


TeacherSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
})

TeacherSchema.methods.comparePassword = async function (password) {

    return await bcrypt.compare(password, this.password);

}

module.exports = { TeacherSchema }