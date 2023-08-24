const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
StudentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    univ_rollno: {
        type: Number,
        required: true,
        unique: true
    },
    placement_data: {
        type: String,
    },
    research_data: {
        type: String
    },
    post_grad_data: {
        type: String
    }

})

module.exports = { StudentSchema }