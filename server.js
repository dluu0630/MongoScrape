// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requirine Note and Article models
var Note = require("./server/models/Note.js");
var Article = require("./server/models/Article.js");
// Scraping tools
var request = require("request");
var cheerio = require("cheerio");
var apiRoutes = require("./server/routing/apiRoutes")
var htmlRoutes = require("./server/routing/htmlRoutes")
var methodOverride = require("method-override");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Use morgan and body parser
app.use(logger("dev"));
app.use(methodOverride("_method"));
app.use(bodyParser.json()) // For ajax
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://heroku_gtsdzkp0:4gp3e8ugip8krcim41skr8h4dd@ds227525.mlab.com:27525/heroku_gtsdzkp0");
var db = mongoose.connection;

// Show mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Log message if succesfully logged in to db through mongoose
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

  app.use(apiRoutes);
  app.use(htmlRoutes);



// Listen on port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log("App running on port 3000!");
});