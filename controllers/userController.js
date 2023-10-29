require('dotenv').config()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const { body, validationResult } = require('express-validator')
const googleOAuth = require('../utils/googleAuth')

exports.signup = async (req, res) => {
  try {
    const code = req.body.code
    const type = req.body.type

    const profile = await googleOAuth.getProfileInfo(code)

    if (profile?.email_verified) {
      firstName = profile.name
      email = profile.email
      company = profile.company

      User.findOne({ email: email }, (err, user) => {
        if (user) return res.json({ message: 'Username already exists.' })
        try {
          User.create(
            {
              firstName,
              lastName,
              email,
              company,
              // password,
              type
            },
            (err, user) => {
              const userObject = {
                _id: user._id,
                email: email
              }
              if (err) console.log(err)
              jwt.sign(
                userObject,
                'smile',
                { expiresIn: 3600 },
                (err, token) => {
                  if (err) console.log(err)
                  res.status(200).json({
                    token,
                    user: userObject,
                    message: 'Successfully signed up.'
                  })
                }
              )
            }
          )
        } catch (err) {
          res.status(500).send('Server error')
          return res.json(err)
        }
      })
    }
  } catch (e) {
    console.log(e)
  }
}

exports.login = async (req, res) => {
  try {
    const code = req.body.code
    const type = req.body.type
    const profile = await googleOAuth.getProfileInfo(code)

    if (profile?.email_verified) {
      console.log('profile', profile)

      User.findOne({ email: profile.email }, (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            message: 'User not found',
            user
          })
        }

        const userObject = {
          _id: user._id,
          email: profile.email
        }
        jwt.sign(userObject, 'smile', { expiresIn: 3600 }, (err, token) => {
          if (err) console.log(err)
          res.status(200).json({
            token,
            user: userObject,
            message: 'Successfully signed in.'
          })
        })
      })
    }
  } catch (e) {
    console.log(e)
    // res.status(401).send(e)
  }
}

// get all users
exports.getUsers = (req, res, next) => {
  User.find()
    .sort([['username', 'ascending']])
    .exec((err, users) => {
      if (err) return res.json(err)
      res.json(users)
    })
}

// get a single user
exports.getUser = (req, res, user) => {
  User.findById(req.params._id, (err, user) => {
    if (err) return res.json(err)
    res.json(user)
  })
}

// post sign up
exports.postSignUp = [
  // validate sign up form
  body('firstName', 'First Name cannot be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('lastName', 'Last Name cannot be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('email', 'Email cannot be empty.').trim().isLength({ min: 1 }).escape(),
  body('company', 'Company Name cannot be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('password', 'Password cannot be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('confirmPassword', 'Confirmed password cannot be empty.').custom(
    async (value, { req }) => {
      if (value !== req.body.password) {
        return res.json('Passwords must match!')
      }
      return true
    }
  ),

  // handle signup
  (req, res, next) => {
    const { firstName, lastName, email, company, password, type } = req.body

    User.findOne({ email: email }, (err, user) => {
      if (user) return res.json({ message: 'Username already exists.' })
      try {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) console.log(err)
          User.create(
            {
              firstName,
              lastName,
              email,
              company,
              password: hashedPassword,
              type
            },
            (err, user) => {
              const userObject = {
                _id: user._id,
                email: user.email
              }
              if (err) console.log(err)
              jwt.sign(
                userObject,
                'smile',
                { expiresIn: 3600 },
                (err, token) => {
                  if (err) console.log(err)
                  res.status(200).json({
                    token,
                    user: userObject,
                    message: 'Successfully signed up.'
                  })
                }
              )
            }
          )
        })
      } catch (err) {
        res.status(500).send('Server error')
        return res.json(err)
      }
    })
  }
]

exports.postLogin = [
  // validate sign in form
  body('email', 'Email cannot be empty.').trim().isLength({ min: 1 }).escape(),
  body('password', 'Password cannot be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // handle sign in
  (req, res, next) => {
    const { email, password } = req.body
    User.findOne({ email }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          message: 'User not found',
          user
        })
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (err || !result) {
          return res.status(400).json({
            message: 'Incorrect password',
            result
          })
        }
        const userObject = {
          _id: user._id,
          email: user.email
        }
        jwt.sign(userObject, 'smile', { expiresIn: 3600 }, (err, token) => {
          if (err) console.log(err)
          res.status(200).json({
            token,
            user: userObject,
            message: 'Successfully signed in.'
          })
        })
      })
    })
  }
]
