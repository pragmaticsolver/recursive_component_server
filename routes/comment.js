var express = require('express');
var router = express.Router();
const Comment = require('../models/comment')
const bodyParser = require('body-parser');
const cors = require('cors');
var moment = require('moment')
const Pusher = require('pusher');
const Datastore = require('nedb');
require('dotenv').config({ path: '.env' });

const app = express();


const db = new Datastore();
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    forceTLS: true,
});

router.get('/',async function (req, res)  {
        try {
          const comments = await Comment.find()
          res.json(comments)
        } catch (err) {
          res.status(500).json({ message: err.message })
      
        }
});

router.use(bodyParser.json());

app.get('/', (req, res) => {
    db.find({}, (err, data) => {
    if (err) return res.status(500).send(err);

    res.json(data);
    });
});

// get all comments by  argument id
router.get('/argument/:argument_id', async function (req, res, next) {
    let argument_id = req.params.argument_id;

    try {
        const comments = await Comment.find({argument_id : argument_id});
        res.json(comments)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});
// get all comments by  comment id
router.get('/comment/:comment_id', async function (req, res, next) {
    let comment_id = req.params.comment_id;

    try {
        const comments = await Comment.find({comment_id : comment_id});
        res.json(comments)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});


/* Post Comment */

// router.post('/', (req, res) => {
//     db.insert(Object.assign({}, req.body), (err, newComment) => {
//         if (err) {
//             return res.status(500).send(err);
//         }
//         console.log(newComment)

        


//         res.status(200).send('OK');
//     });
// });

router.post('/', async function (req, res, next) {
    let argument_id;
    if (req.body.argument_id) {
        argument_id = req.body.argument_id
    } else {
        argument_id = null;
    }
    const comment = new Comment({
        author_id: req.body.author_id,
        comment: req.body.comment,
        comment_id: req.body.comment_id,
        argument_id: argument_id,
        date: moment().format("MM-DD-YYYY")
    })

    try {
        const newComment = await comment.save();
        pusher.trigger('comments', 'new-comment', {
            comment: comment,
        });
        res.status(201).json(newComment)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});
//  Edit Comment
router.put('/', async function (req, res, next) {

    let filter = { _id: req.body.comment_id };
    let update = {
        comment: req.body.comment,

    }

    try {
        const newComment = await Comment.findOneAndUpdate(
            filter,
            update
        )
        res.status(201).json(newComment)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});


// Delete By ID
router.delete('/:comment_id', async function (req, res, next) {
    try {
        // const newComment = await Comment.findOneAndUpdate(
        //     filter,
        //     update
        // )
        try {
            const deleteComment = await Comment.deleteOne({ _id: req.params.comment_id })
            res.status(201).json(deleteComment)
        } catch (err) {
            res.status(400).json({ message: err.message })
        }


        res.status(201).json(deleteComment)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})



module.exports = router;