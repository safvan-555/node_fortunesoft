var express = require('express')
var router = express.Router()
var auth = require('../midilewares/authentication')
var moviesModel = require('../models/movies')

var multer = require('multer');
var fs = require('fs');
var mongoose = require('mongoose');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./files/import/");
    },
    filename: function (req, file, cb) {

        if (!file.originalname.match(/\.(json)$/)) {
            var err = new Error();
            err.code = 'filetype';
            return cb(err);
        } else {
            cb(null, file.originalname + "-" + Date.now() + ".json");
        }
    }
});

var upload = multer({
    storage: storage,
    limits: 10 * 1000 * 1000,
}).single('file_url');


router.get('/get_movies', auth.authorise(), function (req, res) {
    moviesModel
    .getMovies()
    .then((data) => {
        res.json(data);
    })
    .catch((error) => {
        console.log(error);
        return;
    });
})

router.get('/get_moviesby_generes', auth.authorise(), function (req, res) {
    moviesModel
    .getMovies_by_generes()
    .then((data) => {
        res.json(data);
    })
    .catch((error) => {
        console.log(error);
        return;
    });
})

router.post('/import', auth.authorise(), function (req, res) {

    upload(req, res, function (err) {

        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.json({ error: 'invalid_details', error_description: "File size is limitted to 10MB ." })
                return
            } else if (err.code === 'filetype') {
                res.json({ error: 'invalid_details', error_description: "Must be valid file extension only json." })
                return
            } else {
                res.json({ error: 'system_error', error_description: err.message })
                return
            }
        }

        if (!req.file) {
            res.json({ error: 'invalid_details', error_description: 'File is required.' });
            return;
        }
        let rawdata = fs.readFileSync(req.file.path);
        let movs = JSON.parse(rawdata);


        let dat = [];
        for (let i = 0; i < movs.length; i++) {
            let da = {
                _id:mongoose.Types.ObjectId(movs[i]._id.$oid),
                backdrop: movs[i].backdrop,
                cast: movs[i].cast,
                classification: movs[i].classification,
                director: movs[i].director,
                genres: movs[i].genres,
                id: movs[i].id,
                imdb_rating: movs[i].imdb_rating,
                length: movs[i].length,
                overview: movs[i].overview,
                poster: movs[i].poster,
                released_on: movs[i].released_on,
                slug: movs[i].slug,
                title: movs[i].title,
            }
            dat.push(da)
        }
       
        moviesModel
            .listUpsert(dat)
            .then((data) => {
                res.json({status:true, message: 'Imported successfully'});
            })
            .catch((error) => {
                console.log(error);
                return;
            });

    })

})

module.exports = router
