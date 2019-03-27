var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username must be provided']
  },

  content: {
    type: String,
    required: [true, 'Post should not be empty']
  },

  title: {
    type: String
  },

  category: {
    type: String
  },

  tags: {
    type: String
  },
  Image: {
    type: String
  },

  url: {
    unique: true,
    type: String
  },

  created_at: Date

});

postSchema.pre('save', function (next) {
  var currentDate = new Date()
  if (!this.created_at) {
    this.created_at = currentDate
  }
  next()
})

module.exports = mongoose.model('post', postSchema, 'post');