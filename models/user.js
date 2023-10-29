const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  company: { type: String },
  password: { type: String },
  type: { type: String }
})

module.exports = mongoose.model('User', UserSchema)
