var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    common = require('../common'),
    ffmpegTransforms = require('../ffmpegTransforms'),
    path = require("path"),
    totalRequests = 0,
    pendingRequests = 0,
    completedRequests = 0,
    failedRequests = 0,
    requestsQueue = [];

var processRequest = function(req, res, filePath, baseFilePath, transformFunction, data) {

    totalRequests++;
    pendingRequests++;
    if (!fs.existsSync(filePath)) {
        console.log('No existe, la genero');
        console.log(requestsQueue.length);
        console.log(pendingRequests);
        if (pendingRequests >= 10) {
            requestsQueue.push(common.wrapFunction(transformFunction, this, [filePath, baseFilePath, returnFunction(req, res, filePath), data]));
        } else {
            console.log(transformFunction);
            transformFunction(filePath, baseFilePath, returnFunction(req, res, filePath), data);
        }

    } else {
        console.log('Existe, la devuelvo');
        res.sendFile(filePath);
        pendingRequests--;
        completedRequests++;
    }
};

var returnFunction = function(req, res, filePath) {
    return function(err, stdout, stderr) {
        pendingRequests--;
        if (requestsQueue.length > 0) {
            (requestsQueue.shift())();
        }

        //miramos el stderr, ya que a veces da error, pero es por un warning
        if (err) {
            console.log('err');
            console.log(err);
            console.log('stderr');
            console.log(stderr);

            failedRequests++;
            res.sendStatus(404);
        } else {
            console.log('Creado, lo mando');
            completedRequests++;
            res.sendFile(filePath);
        }

        console.log('Resumen AUDIO');
        console.log('Totales: ' + totalRequests + ', Completadas: ' + completedRequests + ', Falladas: ' + failedRequests + ', Pendientes:' + pendingRequests);
    };
};


router.get('/:outputFormat/:userId/:audioId', function(req, res) {

    var originUrl = path.join(__dirname, '../', 'audios/', req.params.userId, req.params.audioId);
    var destinationUrl = path.join(__dirname, '../', 'audios/', req.params.userId, req.params.audioId + '.' + req.params.outputFormat);
    console.log('get audio ' + originUrl);
    console.log('set audio ' + destinationUrl);

    processRequest(req, res, destinationUrl, originUrl, ffmpegTransforms.convert);

});

router.get('/:userId/:audioId', function(req, res) {

    var url = path.join(__dirname, '../', 'audios/', req.params.userId, req.params.audioId);
    console.log('get audio ' + url);

    if (fs.existsSync(url)) {
        res.sendFile(url);
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;