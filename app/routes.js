'use strict'

const express = require('express')
const router = express.Router()

// const fetch = require('node-fetch')

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
// .find({ postcode: req.session.data.postcode })
// .aggregate([ { $search: { 'text': { 'query': req.session.data.postcode, 'path': 'postcode' } } }, { $limit: 1 }, { $project: { 'postcode': 1 } } ])
  Postcode
    .find({ postcode: req.session.data.postcode })
    .then(data => {
      console.log(data)
      console.log(data[0].district_code)

      const code = data[0].district_code

      const restriction = Restrictions.findById(code)

      console.log(restriction)

      res.render('results', {
        actions: {
          back: `${req.baseUrl}/`
        },
        location: data[0],
        restriction: restriction
      })

    })
    .catch(err => {
      console.log('ERROR 💥:', err)
    })



  // const data = MapIt.find(req.session.data.postcode)
  //
  // res.render('results', {
  //   actions: {
  //     back: `${req.baseUrl}/`
  //   },
  //   content: data
  // })

  // let url = `https://mapit.mysociety.org/postcode/${req.session.data.postcode}`
  //
  // if (process.env.MAPIT_API_KEY !== undefined && process.env.MAPIT_API_KEY.length) {
  //   url = `https://mapit.mysociety.org/postcode/${req.session.data.postcode}?api_key=${process.env.MAPIT_API_KEY}`
  // }
  //
  // console.log(url)
  //
  // fetch(url)
  //   .then(res => res.json())
  //   .then(data => {
  //     console.log(data)
  //     const restrictions = Restrictions.find()
  //     const locations = []
  //     const lockdowns = []
  //
  //     if (data.areas !== undefined) {
  //       // loop over the area data pulling out the Government Statistical Service (GSS) code for the area
  //       for (const property in data.areas) {
  //         if (data.areas[property].codes.gss !== undefined) {
  //           locations.push(data.areas[property].codes.gss)
  //         }
  //       }
  //
  //       console.log(locations)
  //
  //       // loop over the GSS location codes to find the restriction for an area
  //       locations.forEach(location => {
  //         if (restrictions[location] !== undefined) {
  //           lockdowns.push(restrictions[location])
  //           console.log(restrictions[location])
  //         } else {
  //           // no restrictions
  //           console.log(location + ' not found')
  //         }
  //       })
  //
  //       console.log(lockdowns)
  //     }
  //
  //
  //     res.render('results', {
  //       actions: {
  //         back: `${req.baseUrl}/`
  //       },
  //       content: lockdowns[0]
  //     })
  //   })
  //   .catch(error => {
  //     console.log(error)
  //     // render an error page, or the results page with an error state
  //     res.render('results', {
  //       actions: {
  //         back: `${req.baseUrl}/`
  //       }
  //     })
  //   })
})

// --------------------------------------------------
// Add routes above this line
// --------------------------------------------------
module.exports = router
