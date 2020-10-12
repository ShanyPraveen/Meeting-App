const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const UserRoutes = require('./routes/users.routes')
const MeetingRoutes = require('./routes/meetings.routes')

mongoose.connect('mongodb://localhost/MeetingDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
            return res.status(200).json({})
        }
        next()
})

app.use(morgan('dev')); // To log requests
app.use('/uploads',express.static('uploads')) // To use it as public
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/user', UserRoutes)
app.use('/meeting', MeetingRoutes)

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app