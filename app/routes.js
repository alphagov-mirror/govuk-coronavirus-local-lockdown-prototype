'use strict'

const express = require('express')
const router = express.Router()

// const https = require('https')
// const fetch = require('node-fetch')
//
// const MapIt = require('./models/mapit')

// function checkHasAnswers (req, res, next) {
//   if (req.session.data.postcode === undefined) {
//     res.redirect(`${req.baseUrl}/`)
//   } else {
//     next()
//   }
// }

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
  const regex = /^([A-PR-UWYZ0-9][A-HK-Y0-9][AEHMNPRTVXY0-9]?[ABEHMNPRVWXY0-9]? {1,2}[0-9][ABD-HJLN-UW-Z]{2}|GIR 0AA)$/

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

router.post('/results', (req, res) => {
  if (req.session.data.postcode.length) {

    // let data = {}
    //
    // fetch(`https://mapit.mysociety.org/postcode/${req.session.data.postcode}`)
    //   .then(res => res.json()) // expecting a json response
    //   .then(data => {
    //     console.log(data);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   })

    // let url = `https://mapit.mysociety.org/postcode/${req.session.data.postcode}`
    //
    // const getData = async url => {
    //   try {
    //     const response = await fetch(url)
    //     const json = await response.json()
    //     console.log(json)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // console.log('data', getData(url));

    // res.render('results', {
    //   actions: {
    //     back: `${req.baseUrl}/`
    //   },
    //   area: MapIt.getArea(req.session.data.postcode, 'council_county')
    // })

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
