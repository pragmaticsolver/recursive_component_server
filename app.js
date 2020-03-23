const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const squabbleRouter = require('./routes/squabbles')
const commentRouter = require('./routes/comment')
const argumentRouter = require('./routes/argument')
const mongoose = require("mongoose")
const fs = require('fs')
// const Pusher = require('pusher');
const Datastore = require('nedb');

const app = express();

const db = new Datastore();

// const pusher = new Pusher({
//     appId: process.env.PUSHER_APP_ID,
//     key: process.env.PUSHER_APP_KEY,
//     secret: process.env.PUSHER_APP_SECRET,
//     cluster: process.env.PUSHER_APP_CLUSTER,
//     useTLS: true,
//     });

const server = require('http').createServer(app);
const io = require('socket.io')(server);
let oauthClient, token = null;


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // for parsing application/x-www-form-urlencoded

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
  if (req.method === 'OPTIONS') {
    return res.send(200);
  } else {
    return next();
  }
});



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/squabbles', squabbleRouter)
app.use('/comments', commentRouter)
app.use('/arguments', argumentRouter)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(bodyParser.json());

app.get('/', (req, res) => {
  db.find({}, (err, data) => {
    if (err) return res.status(500).send(err);

    res.json(data);
  });
});

/* Socket */

// io.of('/socket').on('connection',function(socket){
//   console.log('a user connected');
//   socket.on("newBooking", (data)=> {
//     console.log('New Booking', data);
//     io.of('/socket').emit('newBooking', {'message': 'booking added'})
//   })
//   socket.on("removeBooking",()=> {
//     io.of('/socket').emit('removeBooking', {'message': 'booking removed'})
//   })

//   socket.on('disconnect' , ()=> {
//     console.log("Someone has disconnected");
//   })
// })

// mongoose.connect('mongodb+srv://admin:sp3ncer8@cluster0-lx2rn.mongodb.net/axeldb?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb://localhost/jean', { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', function () {
  console.log("MongoDB database connection established successfully");
})
var port = process.env.PORT || 3000;
server.listen(port);
// http.listen(5000,() => {
//   console.log("socket on 5000")
// })

// Render some console log output
console.log("Listening on port " + port);
module.exports = app;
