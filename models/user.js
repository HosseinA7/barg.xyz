var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username: { type: String,  required: [true, 'username must be provided'] },

	password: { type: String , required: [true,  'Password cannot be left blank']}
	
});

userSchema.methods.validPassword = function( password ) {
  // EXAMPLE CODE!
  return ( this.password === password );
};

module.exports = mongoose.model('User', userSchema , 'user');