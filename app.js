var express = require("express"),
    app = express(),
    bodyParser = require('body-parser');


switch (process.env.NODE_ENV) {
    case 'local':
    case 'preproduction':
    case 'production':
        process.env.PORT = process.env.PORT || 22000;
        break;
}

//iniciamos las librerias
var common = require('./common');

//cargamos routes
var audiosV1 = require('./routes/audios');
var imagesV1 = require('./routes/images');

//init app

var app = express();

//parser
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//CORS
app.use(function(req, res, next) {
    if (process.env.NODE_ENV !== 'production') {
        res.set({
            'Access-Control-Allow-Origin': req.headers.origin,
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
            'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type'
        });
    }
    next();
});

//Routes
app.use('/v1.0/audio', audiosV1);
app.use('/v1.0/image', imagesV1);



/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    console.log('404');
    var err = new Error('Not Found');
    err.status = 404;
    res.sendStatus(404);
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log('dev 500');
        console.log(err);
        // res.sendStatus(err.status || 500);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    console.log('!dev 500');
    console.log(err);
    //res.sendStatus(err.status || 500);
});

module.exports = app;