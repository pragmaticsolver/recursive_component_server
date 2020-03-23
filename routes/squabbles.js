var express = require('express');
var router = express.Router();
const Squabble = require('../models/squabble')
var moment = require('moment')
const Pusher = require('pusher');
const bodyParser = require('body-parser');
const cors = require('cors');
const Datastore = require('nedb');
require('dotenv').config({path: '.env'});

const app = express();

const db = new Datastore();
const pusher = new Pusher({appId: "958466", key: "ba5702deb6bdb064a71d", secret: "801f8daa8c54f7eb7572", cluster: "us2", forceTLS: true});

/* GET all squabbles listing. */
router.get('/', async function (req, res, next) {
    try {
        const squabbles = await Squabble.find()
        res.json(squabbles)
    } catch (err) {
        res
            .status(500)
            .json({message: err.message})

    }
});

/* Post squabble */

router.post('/', async function (req, res, next) {

    const squabble = new Squabble({
        thesis: req.body.thesis,
        author_id: req.body.author_id,
        date: moment().format("MM-DD-YYYY"),
        anti_thesis: null,
        challenger_id: null,
        status: "Open",
        thesis_img: "url",
        anti_thesis_img: "anti-url",
        expiration_date: moment(req.body.expiration_date).format("MM-DD-YYYY")

    })

    try {
        const newSquabble = await squabble.save()
        res
            .status(201)
            .json(newSquabble)
    } catch (err) {
        res
            .status(400)
            .json({message: err.message})
    }
});
/* Challenge Squabble */
/* put request to edit a squabble - need an id (SQUABBLES CANT BE EDITED!!!)


//
/* changes anti_thesis, challenger_id, status, anti_thesis_img columns

*/
router.put('/challenge', async function (req, res, next) {

    let filter = {
        _id: req.body.squabble_id
    };
    let update = {
        challenger_id: req.body.challenger_id,
        anti_thesis: req.body.anti_thesis,
        anti_thesis_img: req.body.anti_thesis_img,
        status: 'In-Progress'
    }
    console.log(filter)
    console.log(update)

    Squabble.findOneAndUpdate(filter, update)
        .then(originDoc => {
            Squabble.findOne(filter).then(updatedDoc => {
                console.log('updatedDoc : ', updatedDoc)
                res.status(201).json(updatedDoc);
            })
        })
        .catch(err => {
                res.status(400).json({message: err.message})
            }
        );
});

router.post('/vote', (req, res) => {
    const {id, vote} = req.body;
    db.findOne({
        _id: id
    }, function (err, doc) {
        if (err) {
            return res
                .status(500)
                .send(err);
        }

        db.update({
            _id: id
        }, {
            $set: {
                votes: doc.votes + vote
            }
        }, {
            returnUpdatedDocs: true
        }, (err, num, updatedDoc) => {
            if (err) 
                return res.status(500).send(err);
            
            pusher.trigger('squabbles', 'votes', {squabble: updatedDoc});
        });
    });
});

//Get Squabble by ID

router.get('/:squabble_id', async function (req, res, next) {
    let squabble_id = req.params.squabble_id;
    try {
        const squabblebyID = await Squabble.find({_id: squabble_id})
        res.json(squabblebyID)
    } catch (err) {
        res
            .status(500)
            .json({message: err.message})

    }
});

/* delete squabble */
router.delete('/:squabble_id', async function (req, res, next) {
    try {
        // const newComment = await Comment.findOneAndUpdate(     filter,     update )
        try {
            const deleteSquabble = await Squabble.deleteOne({_id: req.params.squabble_id})
            res
                .status(201)
                .json(deleteSquabble)
        } catch (err) {
            res
                .status(400)
                .json({message: err.message})
        }

        res
            .status(201)
            .json(deleteSquabble)
    } catch (err) {
        res
            .status(400)
            .json({message: err.message})
    }
})

// router.delete('/:id', function (req, res, next) {  console.log(req.params.id)
//  res.send('deleting this hoe ') })

module.exports = router;
