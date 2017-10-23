// Require mongoose
var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

// Create the Note schema
var NoteSchema = new Schema({
  title: {
    type: String
  },
  noteText: {
    type: String
  }
});

// Create Note model with NoteSchema
var Note = mongoose.model("Note", NoteSchema);

// Export Note model
module.exports = Note;