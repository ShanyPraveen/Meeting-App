const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/checkauth')
const MeetingController = require('../controllers/meetings')

//Create Meeting

router.post('/create', checkAuth, MeetingController.create_meeting)

//Get all Meeting

router.get('/fetchall', checkAuth, MeetingController.meeting_fetchall)

//Get by Meeting ID

router.get('/:meetingId', checkAuth, MeetingController.meeting_get_byId)

//Get by any Condition

router.get('/', checkAuth, MeetingController.meeting_get_bycondition)

//Update Meeting

router.patch('/:meetingId', checkAuth, MeetingController.meeting_update)

//Delete Meeting

router.delete('/:meetingId', checkAuth, MeetingController.meeting_delete)


module.exports = router