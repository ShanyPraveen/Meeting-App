const mongoose = require('mongoose')
const Schema = mongoose.Schema

const meetingSchema = new Schema({
    title: {type: String, required: true},
    date: {type: String, required: true},
    time: {type: String, required: true},
    organiser: {type: String, required: true},
    attendies: [],
    timestamp: Date
})

module.exports = mongoose.model('Meeting', meetingSchema)