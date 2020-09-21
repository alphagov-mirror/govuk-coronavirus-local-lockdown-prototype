'use strict'

const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  delete req.session.data;

  res.render('start', {
    actions: {
      save: `${req.baseUrl}/results`
    }
  })
})

router.post('/results', (req, res) => {

  res.render('results', {
    actions: {
      back: `${req.baseUrl}/`
    }
  })
})

// --------------------------------------------------
// Add routes above this line
// --------------------------------------------------
module.exports = router
