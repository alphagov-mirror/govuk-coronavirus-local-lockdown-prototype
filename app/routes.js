'use strict'

const express = require('express')
const router = express.Router()

const https = require('https')

const MapIt = require('./models/mapit')

function checkHasAnswers (req, res, next) {
  if (req.session.data.postcode === undefined) {
    res.redirect(`${req.baseUrl}/`)
  } else {
    next()
  }
}

router.get('/', (req, res) => {
  delete req.session.data;

  res.render('start', {
    actions: {
      save: `${req.baseUrl}/results`
    }
  })
})

router.post('/results', (req, res) => {
  if (req.session.data.postcode.length) {
    res.render('results', {
      actions: {
        back: `${req.baseUrl}/`
      },
      area: MapIt.getArea(req.session.data.postcode, 'council_county')
    })
  } else {
    res.redirect(`${req.baseUrl}/`);
  }

})

// --------------------------------------------------
// Add routes above this line
// --------------------------------------------------
module.exports = router
