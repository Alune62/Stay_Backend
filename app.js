require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('./models/connection');

var app = express();
const cors = require('cors');
const fileUpload = require('express-fileupload');
app.use(fileUpload());

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var reservationRouter = require('./routes/reservation');
var accommodationRouter = require('./routes/accommodation');
var messageRouter = require('./routes/messages');
var prestationRouter = require('./routes/prestations')

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/accommodation', accommodationRouter);
app.use('/reservation', reservationRouter);
app.use('/messages', messageRouter);
app.use('/prestations', prestationRouter);
module.exports = app;
