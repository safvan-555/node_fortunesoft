var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var moviesSchema = new Schema({
    _id: ObjectId,
    backdrop: { type: String },
    cast: { type: Array },
    classification: { type: String },
    director: { type: Array },
    genres: { type: Array, },
    id: { type: String,index:true },
    imdb_rating: {type:Number},
    length: {type: String},
    overview: { type: String},
    poster: {type: String},
    released_on: { type: String },
    slug: {type: String},
    title: { type: String }
});

var movy_model = mongoose.model('movies', moviesSchema);

module.exports.listUpsert = (moviesjson) => {
    return movy_model.insertMany(moviesjson)
}
module.exports.getMovies = () => {
    return movy_model.find({})
}
module.exports.getMovies_by_generes = () => {
    return movy_model.aggregate([
        { $unwind: "$genres" },
        {
            $group: {
                _id: "$genres",
                genres:{$first:'$genres'},
                movies: { $push: "$$ROOT" }
            }
        },
        {
            $project: {
                _id: 0,
                genres:1,
                movies:1
            }
        },    

    ])
}
