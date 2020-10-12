const express = require('express')
const Meeting = require('../models/meetings.model')
const router = express.Router()
const checkAuth = require('../middleware/checkauth')
var querystring = require('querystring')


exports.create_meeting = (req, res, next) => {
    const meeting = new Meeting({
     title: req.body.title,
     date: req.body.date,
     time: req.body.time,
     organiser: req.body.organiser,
     attendies: req.body.attendies,
     timestamp: new Date()
    })
    meeting.save().then(result => {
             res.status(201).json({
             message: 'Created Meeting successfully',
             createdMeeting: {
                 Title: result.title,
                 Date: result.date,
                 _id: result._id,
                 request: {
                     type: 'GET',
                     url: "http://localhost:3000/meeting/" + result._id
                 }
             }
         })
     })
     .catch(err => {
          console.log(err)
          res.status(500).json({
            error: err
          })
     })   
}

exports.meeting_fetchall = (req, res, next) => {
    Meeting.find()
    .select('title date _id time')
    .exec()
    .then(docs => {
        //console.log(docs)
        const response ={
            count: docs.length,
            Meetings: docs.map(doc => {
                return {
                    title: doc.title,
                    date: doc.date,
                    time: doc.time,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/meeting/' + doc._id
                    }
                }
            })
        }
            res.status(200).json(response);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
}

exports.meeting_get_byId = (req, res, next) => {
    const id = req.params.meetingId
    Meeting.findById(id)
        .select('-__v')
        .exec()
        .then(meeting => {
            if(meeting){
                res.status(200).json({
                    Meeting : meeting,
                    request:{
                        type: 'GET',
                        desc: 'GET all Meeting Details',
                        url: 'http://localhost:3000/meeting/fetchall'
                    }
                })
            } else {
                res.status(404).json({
                    message: "Meeting not Found"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.meeting_get_bycondition = (req, res, next) => {
    var query = req.query
    Meeting.find(query)
    .select('-__v')
    .exec().then(meeting => {
        if(meeting.length >= 1){
            res.status(200).json({
                meeting: meeting
            })
        } else {
            res.status(404).json({
                error: 'Meeting Not found'
            })
        }
    })
}

exports.meeting_update = (req, res, next) => {
    const id = req.params.meetingId
    const updateOps = {};
    for ( const ops of req.body) {   //For Updating the body needs to be an Array with propName and value
        updateOps[ops.propName] = ops.value
    }
    Meeting.findByIdAndUpdate({_id: id}, { $set: updateOps })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Meeting Updated',
            request:{
                type: 'GET',
           /////// Another way to get URL ///////
                url: req.get('host')+'/meeting/' + id
            }
        })
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
}

exports.meeting_delete = (req, res, next) => {
    const id = req.params.meetingId
    Meeting.findById({ _id: id})
    .exec()
    .then(meeting => {
        if (meeting) {
            Meeting.remove({ _id: id })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Meeting Deleted'
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
        } else {
            res.status(500).json({
                message: "Meeting not found"
            })
        }
    })
           
}
