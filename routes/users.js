var express = require('express');
var router = express.Router();
const User = require('../models/user')
var moment = require('moment')
/* GET users listing. */

/* AXEL TO DO */

/* ----- GET ALL USERS */
router.get('/', async function (req, res, next) {
    try {
        const user = await User.find()
        res.json(user)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
});

/* ----- CREATE USER */
router.post('/signup', async function (req, res, next) {

    const user = new User({username: req.body.username, password: req.body.password, email: req.body.email})

    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
});

router.post('/login', async function (req, res, next) {

    console.log(req.body);
    try {

        const loginAuth = await User.findOne({username: req.body.username, password: req.body.password})
        res.status(201).json(loginAuth)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
});

/* ----- DELETE USER */
router.delete('/:user_id', async function (req, res, next) {
    try {
        // const newComment = await Comment.findOneAndUpdate(     filter,     update )
        try {
            const deleteUser = await User.deleteOne({_id: req.params.user_id})
            res.status(201).json({message : "success"})
        } catch (err) {
            res.status(400).json({message: err.message})
        }

        res.status(201).json(deleteUser)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

/* ----- EDIT USERNAME */
router.put('/:user_id', async function (req, res, next) {
    let filter = {
        _id: req.params.user_id
    };
    let update = {
        email: req.body.email
    }
    try {
        const newUser = await User.findOneAndUpdate(filter, update)
        res.status(201).json(newUser)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
});

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
