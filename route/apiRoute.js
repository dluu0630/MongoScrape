var path = require('path');
var request = require("request");
var express = require("express");
var app = express.Router();
//scraping tools
var request = require("request");
var cheerio = require("cheerio");
//models 
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

// Routes

// Notes Begin
// Save new note
app.delete("/api/notes/:id", function(req, res) {
  Note.findByIdAndRemove(req.params.id, function(error, doc){
    // Log error
    if (error) {
      console.log(error);
    }
    else {
      // Send the doc to the browser
      res.send(doc);
    }
});

});
app.post("/api/notes", function(req, res){
  // Create new note and pass req.body to entry
  var newNote = new Note(req.body);
    // save new note to db
    newNote.save(function(error, doc) {
      // Log errors
      if (error) {
        console.log(error);
      }
      else {
        // Use article id to find and update note
        Article.findOneAndUpdate({ "_id": req.body.id }, {$push: {"notes": doc._id}},
        {safe: true, upsert: true})
        // Execute above query
        .exec(function(err, doc) {
          if (err) {
            console.log(err);
          }
          else {
            res.send(doc);
          }
        });
      }
    });

});

//  Seach notes by article id
app.get("/api/notes/:id", function(req, res){
    // Use id passed in the id parameter, prepare query that finds matching one in our db
    Article.findOne({ "_id": req.params.id })
    // populate notes
    .populate("notes")
    // execute query
    .exec(function(error, doc) {
      if (error) {
        console.log(error);
      }
      // send doc to browser as json obj
      else {
        res.json(doc);
      }
    });
});
// Notes End


// Begin Headline
app.post("/api/saveAllArticles", function(req, res){
  var result = JSON.parse(req.body.articles);
  for(i=0; i<result.length; i++){
      // Using Article model, create new entry
      // Passes result object entry
        var entry = new Article(result[i]);
        // saves entry to db
        entry.save(function(err, doc) {
          if (err) {
            console.log(err);
          }
          else {
            console.log(doc);
          }
        });

  }

});
app.delete("/api/headlines/:id", function(req, res){
  Article.findByIdAndRemove(req.params.id, function(error, doc){
      if (error) {
        console.log(error);
      }
      else {
        res.send(doc);
      }
  })
}

)

// Render Save Articles
app.get("/api/renderSaved", function(req, res) {
  Article.find({}, function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});

// Save Article when user clicks save
app.post("/api/headlines", function(req, res) {
  var result = req.body;

  var entry = new Article(result);
        entry.save(function(err, doc) {
          if (err) {
            console.log(err);
          }
          else {
            console.log(doc);
          }
        });

});

// Get all headlines
app.get("/api/headlines", function(req, res) {

    // Grab the body of html using request
    request("http://www.nytimes.com/pages/todayspaper/index.html", function(error, response, html) {
            // If request successful
          if (!error && response.statusCode === 200) {
            // Load into cheerio and save to $ for shorthand selector
            var $ = cheerio.load(html);
            // Grab every h2 within article tag
            // Save empty result object
                var result = {
                    articles: []
                };
            $(".story").each(function(i, element) {
              var article = {

              }
              // Add text and href of every link, and save them as properties of result object
              article.title = $(this).children("h3").text();
              article.link = $(this).children("h3").children("a").attr("href");
              article.summary = $(this).children("p").text();
              article.saved = false;
              article.id = i;
              result.articles.push(article);
     
            });

          
            res.json(result);



          }   
      })
         
});

// End Headline

  module.exports = app;