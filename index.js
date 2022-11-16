var express = require('express')
var app= express()
var movies = require('./controllers/movies')
var mongoose = require('mongoose');

var uristring = "mongodb://localhost:27017/MOVIES";
mongoose.connect(
  uristring,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, res) {
    if (err) {
      console.log("ERROR connecting to: " + uristring + ". " + err);
    } else {
      console.log("Succeeded connected to: " + uristring);
    }
  }
);

app.use('/movies', movies)

app.listen(5000,"0.0.0.0",()=>{console.log('connect to port number 5000')})