'use strict'

const express = require('express')
const router = express.Router()

const path = require('path')
const fs = require('fs')
const matter = require('gray-matter')
const marked = require('marked')

const Postcode = require('./models/postcode')
const Restrictions = require('./models/restrictions')

function checkHasSearchTerm (req, res, next) {
  if (req.session.data.search === undefined || !req.session.data.search.length) {
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

  if (!req.session.data.search.length) {
    const error = {}
    error.fieldName = 'postcode'
    error.href = '#postcode'
    error.text = 'Enter a postcode'
    errors.push(error)
  }
  // else if (!regex.test(req.session.data.postcode)) {
  //   const error = {}
  //   error.fieldName = 'postcode'
  //   error.href = '#postcode'
  //   error.text = 'Enter a valid postcode'
  //   errors.push(error)
  // }

  if (errors.length) {
    res.render('start', {
      errors: errors,
      actions: {
        save: `${req.baseUrl}/`
      }
    })
  } else {
    res.redirect(`${req.baseUrl}/places`)
  }
})

router.get('/places', checkHasSearchTerm, (req, res) => {
  // const regex = /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})$/
  // if(regex.test(req.session.data.search)) {
  //
  // } else {
  //
  // }
  const searchTerm = req.session.data.search
console.log(req.headers.referer);
  Postcode
    .aggregate([{
      $match: {
        $or: [
          {
            district: {
              $regex: searchTerm,
              $options: 'i'
            }
          },
          {
            postcode: {
              $regex: searchTerm.toUpperCase(),
              $options: 'i'
            }
          },
          {
            postcode_key: {
              $regex: searchTerm.replace(/ +?/g, '').toUpperCase(),
              $options: 'i'
            }
          }
        ]
      }
    }, {
      $group: {
        _id: '$district',
        name: { '$first': '$district' },
        code: { '$first': '$district_code' }
      }
    }, {
      $sort: {
        name: 1
      }
    }])
    .then(doc => {
      // console.log(doc)

      if (doc.length === 1) {

        res.redirect(`${req.baseUrl}/places/${doc[0].code}`)

      } else {

        res.render('places', {
          actions: {
            back: `${req.baseUrl}/`,
            place: `${req.baseUrl}/places`
          },
          locations: doc
        })

      }

    })
    .catch(err => {
      console.log('ERROR 💥:', err)
      res.render('error', {
        actions: {
          back: `${req.baseUrl}/`
        }
      })
    })

})

router.get('/places/:place', (req, res) => {
  if (req.params.place !== undefined) {
    Postcode
      .find({ district_code: req.params.place })
      .then(doc => {
        // console.log(doc)

        let restriction = {}
        if (doc.length) {
          const code = doc[0].district_code
          restriction = Restrictions.findById(code)
          // console.log(restriction)
        }

        res.render('place', {
          actions: {
            back: req.headers.referer
          },
          location: doc[0],
          restriction: restriction
        })
      })
      .catch(err => {
        console.log('ERROR 💥:', err)
        res.render('place', {
          actions: {
            back: `${req.baseUrl}/`
          }
        })
      })
  } else {
    res.redirect(`${req.baseUrl}/`)
  }
})

router.get('/results-OLD', checkHasSearchTerm, (req, res) => {
  const regex = /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})$/
  const searchTerm = req.session.data.search
  // .fuzzySearch({ query: req.session.data.search, minSize: 3, prefixOnly: true })
  Postcode
    .aggregate([{
      $match: {
        $or: [
          {
            district: {
              $regex: searchTerm,
              $options: 'i'
            }
          },
          {
            postcode: {
              $regex: searchTerm.toUpperCase(),
              $options: 'i'
            }
          },
          {
            postcode_key: {
              $regex: searchTerm.replace(/ +?/g, '').toUpperCase(),
              $options: 'i'
            }
          }
        ]
      }
    }, {
      $group: {
        _id: '$district',
        name: { '$first': '$district' },
        code: { '$first': '$district_code' }
      }
    }, {
      $sort: {
        name: 1
      }
    }])
    .then(doc => {
      console.log(doc)

      // let restriction = {}
      // if (doc.length) {
      //   const code = doc[0].district_code
      //   restriction = Restrictions.findById(code)
      //   // console.log(restriction)
      // }
      //
      // res.render('results', {
      //   actions: {
      //     back: `${req.baseUrl}/`
      //   },
      //   location: doc[0],
      //   restriction: restriction
      // })
    })
    .catch(err => {
      console.log('ERROR 💥:', err)
      // res.render('results', {
      //   actions: {
      //     back: `${req.baseUrl}/`
      //   }
      // })
    })
})

router.get('/:type/:document', (req, res) => {
  const file = fs.readFileSync(path.join(__dirname, 'data', req.params.document + '.md'), 'utf8')
  const doc = matter(file)
  const html = marked(doc.content)

  res.render(`${req.params.type}`, {
    actions: {
      back: `${req.baseUrl}/`
    },
    meta: doc.data,
    content: html
  })
})

// const updateFuzzy = async (Model, attrs) => {
//   for await (const doc of Model.find()) {
//     const obj = attrs.reduce((acc, attr) => ({ ...acc, [attr]: doc[attr] }), {})
//     await Model.findByIdAndUpdate(doc._id, obj)
//   }
// }
//
// const removeUnsedFuzzyElements = async (Model, attrs) => {
//   for await (const doc of Model.find()) {
//     const $unset = attrs.reduce((acc, attr) => ({...acc, [`${attr}_fuzzy`]: 1}), {})
//     await Model.findByIdAndUpdate(doc._id, { $unset }, { new: true, strict: false });
//   }
// }
//
// router.get('/fuzzy', async (req, res) => {
//
//   // usage
//   // await updateFuzzy(Postcode, ['postcode']);
//   await removeUnsedFuzzyElements(Postcode, ['postcode','district']);
//
//   res.render('start', {
//
//   })
//
// })

// router.get('/index', async (req, res) => {
//
//   Postcode.createIndex( { "postcode": 1, "postcode_key": 1, "district": 1 } )
//
//   res.render('start', {
//
//   })
//
// })

// --------------------------------------------------
// Add routes above this line
// --------------------------------------------------
module.exports = router
