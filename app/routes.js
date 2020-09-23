'use strict'

const express = require('express')
const router = express.Router()

const fetch = require('node-fetch')

function checkHasPostcode (req, res, next) {
  if (req.session.data.postcode === undefined || !req.session.data.postcode.length) {
    res.redirect(`${req.baseUrl}/`)
  } else {
    next()
  }
}

router.get('/', (req, res) => {
  delete req.session.data;

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

  const url = `https://mapit.mysociety.org/postcode/${req.session.data.postcode}`

  console.log(url)

  fetch(url)
    .then(res => res.json())
    .then(data => {
      // console.log('Outside', data)
      res.render('results', {
        actions: {
          back: `${req.baseUrl}/`
        },
        content: data
      })
    })
    .catch(error => {
      console.log(error)
      // render an error page, or the results page with an error state
    })
})

// --------------------------------------------------
// Add routes above this line
// --------------------------------------------------
module.exports = router
