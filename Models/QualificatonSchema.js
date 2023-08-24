const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
QualificaitonSchema = new Schema({
    teacher: {
        type: mongoose.Types.ObjectId,
        ref: "Teacher",
        req: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    rejected: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    },
    document: {
        type: String
    }
})

module.exports = { QualificaitonSchema }