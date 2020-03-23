var express = require('express');
var router = express.Router();
const Argument = require('../models/argument')
var moment = require('moment')
const Pusher = require('pusher');
const Datastore = require('nedb');
require('dotenv').config({path: '.env'});

const db = new Datastore();
const pusher = new Pusher({appId: process.env.PUSHER_APP_ID, key: process.env.PUSHER_APP_KEY, secret: process.env.PUSHER_APP_SECRET, cluster: process.env.PUSHER_APP_CLUSTER, forceTLS: true});

router.get('/', async function (req, res, next) {
    try {
        const argument = await Argument.find()
        res.json(argument)
    } catch (err) {
        res.status(500).json({message: err.message})

    }
});

//get Prime Arguments by squabble id

router.get('/squabble/:squabble_id', async function (req, res, next) {
    let squabble_id = req.params.squabble_id;
    try {
        const arguments = await Argument.find({squabble_id: squabble_id})
        res.json(arguments)
    } catch (err) {
        res.status(500).json({message: err.message})

    }
});

// get arguments by squabble and author
router.get('/squabble/:squabble_id/:author_id', async function (req, res, next) {
    let squabble_id = req.params.squabble_id;
    let author_id = req.params.author_id;
    try {
        const argument = await Argument.find({squabble_id: squabble_id, author_id: author_id})
        res.status(200).json(argument)
    } catch (err) {
        res.status(500).json({message: err.message})

    }
});

/* Post Argument */

router.post('/', async function (req, res, next) {
    const argument = new Argument({
        // thesis: req.body.thesis, author_id: req.body.author, date:
        // moment().format("MM-DD-YYYY"), anti_thesis: null, challenger_id: null,
        // status: "Open", thesis_img: "url", anti_thesis_img: "anti-url",
        // expiration_date: moment(req.body.expiration_date).format("MM-DD-YYYY")

        squabble_id: req.body.squabble_id,
        author_id: req.body.author_id,
        argument: req.body.argument,
        date: moment().format("MM-DD-YYYY")
    })
    console.log(argument)

    try {
        const newArgument = await argument.save()
        pusher.trigger('arguments', 'new-argument', {argument: argument});
        res.status(201).json(newArgument)
    } catch (err) {
        res.status(400).json({message: err.message})
    }

});

/* ARGS CANT BE DELETED AT THIS JUNCTURE */

// router.delete('/:id',function(req,res,next){    console.log(req.params.id)
// res.send('deleting this hoe ') })

module.exports = router;
