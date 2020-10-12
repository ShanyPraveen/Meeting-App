const express = require('express')
const User = require('../models/users.model')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.user_signup = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length >= 1){
                return res.status(409).json({
                    message: 'User already Exists'
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            email: req.body.email,
                            password: hash
                        })
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'User created'
                                })
                            }).catch(err => {
                                res.status(500).json({
                                    error: err
                                })
                            })
                    } 
                })
            }
        })
}

exports.user_login = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length < 1 ){
                return res.status(401).json({
                    message: "User doesn't exist"
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err){
                    return res.status(401).json({
                        message: "Auth Failed"
                    })
                } if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    },process.env.JWT_KEY
                    );
                    return res.status(200).json({ //we can send the token in header as  .header('x-auth', token)
                    message: 'Auth successful',
                    token: token,
                    id: user[0]._id
                });
                }   res.status(401).json({
                    message: "Auth Failed"
                })
            })
        }) .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}