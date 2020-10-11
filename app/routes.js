'use strict'

const express = require('express')
const router = express.Router()

const Postcode = require('./models/postcode')
const Restrictions = require('./models/restrictions')

function checkHasPostcode (req, res, next) {
  if (req.session.data.postcode === undefined || !req.session.data.postcode.length) {
    res.redirect(`${req.baseUrl}/`)
  } else {
    next()
  }
}

router.get('/', (req, res) => {
  delete req.session.data

  res.render('start', {
    actions: {
      save: `${req.baseUrl}/`
    }
  })
})

router.post('/', (req, res) => {
  const errors = []
  const regex = /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})$/

  if (!req.session.data.postcode.length) {
    const error = {}
    error.fieldName = 'postcode'
    error.href = '#postcode'
    error.text = 'Enter a postcode'
    errors.push(error)
  } else if (!regex.test(req.session.data.postcode)) {
    const error = {}
    error.fieldName = 'postcode'
    error.href = '#postcode'
    error.text = 'Enter a valid postcode'
    errors.push(error)
  }

  if (errors.length) {
    res.render('start', {
      errors: errors,
      actions: {
        save: `${req.baseUrl}/`
      }
    })
  } else {
    res.redirect(`${req.baseUrl}/results`)
  }
})

router.get('/results', checkHasPostcode, (req, res) => {
  const postcode = req.session.data.postcode.replace(/ +?/g, '').toUpperCase()
  Postcode
    .find({ postcode_key: postcode })
    .then(doc => {
      // console.log(doc)

      let restriction = {}
      if (doc.length) {
        const code = doc[0].district_code
        restriction = Restrictions.findById(code)
        // console.log(restriction)
      }

      res.render('results', {
        actions: {
          back: `${req.baseUrl}/`
        },
        location: doc[0],
        restriction: restriction
      })
    })
    .catch(err => {
      console.log('ERROR 💥:', err)
      res.render('results', {
        actions: {
          back: `${req.baseUrl}/`
        }
      })
    })
})

// --------------------------------------------------
// Add routes above this line
// --------------------------------------------------
module.exports = router
