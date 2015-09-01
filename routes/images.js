var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    path = require('path'),
    glob = require('glob'),
    async = require('../bower_components/async'),
    gmTransforms = require('../gmTransforms'),
    common = require('../common'),
    gmErrorRegExp = new RegExp('@ error'),
    totalRequests = 0,
    pendingRequests = 0,
    completedRequests = 0,
    failedRequests = 0,
    requestsQueue = [];

var processRequest = function(req, res, originFilePath, storePath, transformFunction, data) {

    totalRequests++;
    pendingRequests++;
    if (!fs.existsSync(storePath)) {
        console.log('No existe, la genero');
        if (pendingRequests >= 10) {
            requestsQueue.push(common.wrapFunction(transformFunction, this, [originFilePath, storePath, returnFunction(req, res, storePath), data]));
        } else {
            transformFunction(originFilePath, storePath, returnFunction(req, res, storePath), data);
        }

    } else {
        console.log('Existe, la devuelvo');
        res.sendFile(storePath);
        pendingRequests--;
        completedRequests++;
    }
};

var returnFunction = function(req, res, storePath) {
    return function(err, stdout, stderr, command) {
        pendingRequests--;
        if (requestsQueue.length > 0) {
            (requestsQueue.shift())();
        }

        //miramos el stderr, ya que a veces da error, pero es por un warning
        if ((err || stderr) && gmErrorRegExp.test(stderr)) {
            console.log('err');
            console.log(err);
            console.log('stderr');
            console.log(stderr);
            console.log('command');
            console.log(command);
            console.log('Error :( - Width: ' + req.params.width + ', Height:' + req.params.height + ', x:' + req.params.x + ', y:' + req.params.y + ', imagen: ' + req.params.imagen);
            failedRequests++;
            res.sendStatus(404);
        } else {
            console.log('Creada, la mando - Width: ' + req.params.width + ', Height:' + req.params.height + ', x:' + req.params.x + ', y:' + req.params.y + ', imagen: ' + req.params.imagen);
            completedRequests++;
            res.sendFile(storePath);
        }

        console.log('Resumen');
        console.log('Totales: ' + totalRequests + ', Completadas: ' + completedRequests + ', Falladas: ' + failedRequests + ', Pendientes:' + pendingRequests);
    };
};

// var deleteImages = function(path, callback) {
        //     console.log('delete: ' + path);
        //     glob(path, {
        //         mark: true
        //     }, function(err, files) {

        //         if (!err) {
        //             console.log(files);
        //             for (var i = 0; i < files.length; i++) {
        //                 fs.unlink(files[i], console.log('err: ' + err));
        //             }
        //         }
        //         callback(err);
        //     });
        // };

var refreshImage = function(imageName, foldersPath, callback) {
    console.log('Se buscan y eliminan los derivados: ' + imageName);
    async.parallel([
            function(done) {
                console.log('width');
                glob(foldersPath + '/width/*_' + imageName, {
                    mark: true
                }, function(err, files) {

                    if (!err) {
                        console.log(files);
                        for (var i = 0; i < files.length; i++) {
                            fs.unlink(files[i], console.log('err: ' + err));
                        }
                    }
                    done(err);
                });
            },
            function(done) {
                console.log('height');
                glob(foldersPath + '/height/*_' + imageName, {
                    mark: true
                }, function(err, files) {

                    if (!err) {
                        console.log(files);
                        for (var i = 0; i < files.length; i++) {
                            fs.unlink(files[i], console.log('err: ' + err));
                        }
                    }
                    done(err);
                });
            },
            function(done) {
                console.log('fit');
                glob(foldersPath + '/fit/*_' + imageName, {
                    mark: true
                }, function(err, files) {

                    if (!err) {
                        console.log(files);
                        for (var i = 0; i < files.length; i++) {
                            fs.unlink(files[i], console.log('err: ' + err));
                        }
                    }
                    done(err);
                });
            },
            function(done) {
                console.log('widthcrop');
                glob(foldersPath + '/widthcrop/*_' + imageName, {
                    mark: true
                }, function(err, files) {

                    if (!err) {
                        console.log(files);
                        for (var i = 0; i < files.length; i++) {
                            fs.unlink(files[i], console.log('err: ' + err));
                        }
                    }
                    done(err);
                });
            },
            function(done) {
                console.log('heightcrop');
                glob(foldersPath + '/heightcrop/*_' + imageName, {
                    mark: true
                }, function(err, files) {

                    if (!err) {
                        console.log(files);
                        for (var i = 0; i < files.length; i++) {
                            fs.unlink(files[i], console.log('err: ' + err));
                        }
                    }
                    done(err);
                });
            },
            function(done) {
                console.log('widthcropfill');
                glob(foldersPath + '/widthcropfill/*_' + imageName, {
                    mark: true
                }, function(err, files) {

                    if (!err) {
                        console.log(files);
                        for (var i = 0; i < files.length; i++) {
                            fs.unlink(files[i], console.log('err: ' + err));
                        }
                    }
                    done(err);
                });
            },
            function(done) {
                console.log('heightcropfill');
                glob(foldersPath + '/heightcropfill/*_' + imageName, {
                    mark: true
                }, function(err, files) {

                    if (!err) {
                        console.log(files);
                        for (var i = 0; i < files.length; i++) {
                            fs.unlink(files[i], console.log('err: ' + err));
                        }
                    }
                    done(err);
                });
            }
        ],
        callback
    );
};


//devuelve las imagenes ajustadas segun el ancho, alto o fit (fit distorsiona)

router.get('/w/:width/:imagen', function(req, res) {
    var originFilePath = path.join(__dirname, '..', 'images', 'baseimages', req.params.imagen);
    var storePath = path.join(__dirname, '..', 'images', 'width', req.params.width + '_' + req.params.imagen);

    console.log('resizeWidth ' + storePath);

    processRequest(req, res, originFilePath, storePath, gmTransforms.resizeWidth, {
        width: req.params.width
    });
});


router.get('/h/:height/:imagen', function(req, res) {
    var originFilePath = path.join(__dirname, '..', 'images', 'baseimages', req.params.imagen);
    var storePath = path.join(__dirname, '..', 'images', 'height', req.params.height + '_' + req.params.imagen);

    console.log('resizeheight ' + storePath);

    processRequest(req, res, originFilePath, storePath, gmTransforms.resizeHeight, {
        height: req.params.height
    });
});

//fit
router.get('/f/:width/:height/:imagen', function(req, res) {
    var originFilePath = path.join(__dirname, '..', 'images', 'baseimages', req.params.imagen);
    var storePath = path.join(__dirname, '..', 'images', 'fit', req.params.width + 'x' + req.params.height + '_' + req.params.imagen);

    console.log('fit ' + storePath);

    processRequest(req, res, originFilePath, storePath, gmTransforms.fit, {
        width: req.params.width,
        height: req.params.height
    });
});


//se ajusta a un parametro y recorta del otro centrado
router.get('/wc/:width/:height/:imagen', function(req, res) {
    var paramsPath = '';

    for (var item in req.query) {
        paramsPath += '--' + item + '-' + req.query[item];
    }
    console.log(paramsPath);

    var originFilePath = path.join(__dirname, '..', 'images', 'baseimages', req.params.imagen);
    var storePath = path.join(__dirname, '..', 'images', 'widthcrop', req.params.width + 'x' + req.params.height + paramsPath + '_' + req.params.imagen);

    console.log('resizeWidthCrop ' + storePath);

    var params = {
        width: req.params.width,
        height: req.params.height,
        gravity: req.query.gravity
    };

    processRequest(req, res, originFilePath, storePath, gmTransforms.resizeWidthCrop, params);
});


router.get('/hc/:width/:height/:imagen', function(req, res) {
    var paramsPath = '';

    for (var item in req.query) {
        paramsPath += '--' + item + '-' + req.query[item];
    }
    console.log(paramsPath);

    var originFilePath = path.join(__dirname, '..', 'images', 'baseimages', req.params.imagen);
    var storePath = path.join(__dirname, '..', 'images', 'heightcrop', req.params.width + 'x' + req.params.height + paramsPath + '_' + req.params.imagen);

    console.log('resizeHeightCrop ' + storePath);

    var params = {
        width: req.params.width,
        height: req.params.height,
        gravity: req.query.gravity
    };

    processRequest(req, res, originFilePath, storePath, gmTransforms.resizeHeightCrop, params);
});

//igual pero rellena si falta imagen de negro

router.get('/fwc/:width/:height/:imagen', function(req, res) {
    var originFilePath = path.join(__dirname, '..', 'images', 'baseimages', req.params.imagen);
    var storePath = path.join(__dirname, '..', 'images', 'widthcropfill', req.params.width + 'x' + req.params.height + '_' + req.params.imagen);

    console.log('fillResizeWidthCrop ' + storePath);

    processRequest(req, res, originFilePath, storePath, gmTransforms.fillResizeWidthCrop, {
        width: req.params.width,
        height: req.params.height
    });
});

//globales
router.get('/fhc/:width/:height/:imagen', function(req, res) {
    var originFilePath = path.join(__dirname, '..', 'images', 'baseimages', req.params.imagen);
    var storePath = path.join(__dirname, '..', 'images', 'heightcropfill', req.params.width + 'x' + req.params.height + '_' + req.params.imagen);

    console.log('fillResizeHeightCrop ' + storePath);

    processRequest(req, res, originFilePath, storePath, gmTransforms.fillResizeHeightCrop, {
        width: req.params.width,
        height: req.params.height
    });
});


//Crops de la imagen en raw y depositar en base
router.get('/rc/:width/:height/:x/:y/:imagen', function(req, res) {
    var originFilePath = path.join(__dirname, '..', 'images', 'raw', req.params.imagen);
    var storePath = path.join(__dirname, '..', 'images', 'baseimages', req.params.width + 'x' + req.params.height + '_' + req.params.imagen);

    console.log('fillResizeHeightCrop ' + storePath);

    processRequest(req, res, originFilePath, storePath, gmTransforms.crop, {
        width: req.params.width,
        height: req.params.height,
        x: req.params.x,
        y: req.params.y
    });
});

//Refresh de la imagen, borramos toda las generadas
router.get('/refresh/:imagen', function(req, res) {
    refreshImage(req.params.imagen, path.join(__dirname, '..', 'images'), function(err, results) {
        if (err) {
            console.log(err);
            res.status(err.errorCode || 500).send(err);
        } else {
            res.sendStatus(200);
        }
    });
});

module.exports = router;