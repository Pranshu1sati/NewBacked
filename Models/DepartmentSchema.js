const mongoose = require("mongoose");
const Schema = mongoose.Schema;
exports.DepartmentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    HOD: {
        type: mongoose.Types.ObjectId,
        ref: "Teacher"
    },
    teachers: [{
        type: mongoose.Types.ObjectId,
        ref: "Teacher"
    }],

    campus: {
        type: String,
        required: true,
        enum: ["GEU", "GEHU-dehradun", "GEHU-bheemtal", "GEMS"]
    },

    unVerifiedQualifications: [{
        type: mongoose.Types.ObjectId,
        ref: "Qualification"
    }]
}).index({ name: 1, campus: 1 }, { unique: true })

