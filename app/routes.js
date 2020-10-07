'use strict'

const express = require('express')
const router = express.Router()

const path = require('path')
// const fs = require('fs')

const fetch = require('node-fetch')

const Postcode = require('./models/postcode');

const csvtojson = require('csvtojson/v2');

function checkHasPostcode (req, res, next) {
  if (req.session.data.postcode === undefined || !req.session.data.postcode.length) {
    res.redirect(`${req.baseUrl}/`)
  } else {
    next()
  }
}

router.get('/', (req, res) => {
  delete req.session.data

  const postcodes = Postcode.find()
  console.log(postcodes)
  // console.log(req.db)

  // let postcode = new Postcode({
  //   postcode: 'AL5 1ND',
  //   in_use: false
  // })
  //
  // postcode
  //   .save()
  //   .then(doc => console.log(doc))
  //   .catch(err => console.log('ERROR 💥:', err))

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
  let url = `https://mapit.mysociety.org/postcode/${req.session.data.postcode}`

  if (process.env.MAPIT_API_KEY !== undefined && process.env.MAPIT_API_KEY.length) {
    url = `https://mapit.mysociety.org/postcode/${req.session.data.postcode}?api_key=${process.env.MAPIT_API_KEY}`
  }

  console.log(url)

  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data)
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
      res.render('results', {
        actions: {
          back: `${req.baseUrl}/`
        }
      })
    })
})

function sleep (milliseconds) {
  const date = Date.now()
  let currentDate = null
  do {
    currentDate = Date.now()
  } while (currentDate - date < milliseconds)
}

function paginate (array, page_size, page_number) {
  --page_number // because pages logically start with 1, but technically with 0
  return array.slice(page_number * page_size, (page_number + 1) * page_size)
}

router.get('/load', (req, res) => {
  const filePath = path.join(__dirname, './data/postcodes/AL-postcodes.csv')

  csvtojson()
    .fromFile(filePath)
    .then((data) => {
      // console.log(data)

      let loopCount = 0

      // Total number of items
      let count = data.length

      // console.log(count)

      // Prevent users putting in a limit not in the pre-defined set: 10, 25, 50, 100
      let limit = 2000
      // if ([10,25,50,100].indexOf(parseInt(req.query.limit)) !== -1) {
      //   limit = (req.query.limit) ? parseInt(req.query.limit) : 50;
      // }

      // Current page
      let page = (req.query.page) ? parseInt(req.query.page) : 1

      // Total number of pages
      let pageCount = Math.ceil(count / limit)

      // Calculate the previous and next pages
      let prevPage = (page - 1) ? (page - 1) : 1
      let nextPage = ((page + 1) > pageCount) ? pageCount : (page + 1)

      let dataArray = paginate(data, limit, page)

      dataArray.forEach((item, i) => {

        // let postcode = new Postcode({
        //   postcode: item.postcode,
        //   in_use: true,
        //   latitude: item.latitude,
        //   longitude: item.longitude,
        //   easting: item.easting,
        //   northing: item.northing,
        //   grid_ref: item.grid_ref,
        //   county: item.county,
        //   district: item.district,
        //   ward: item.ward,
        //   district_code: item.district_code,
        //   ward_code: item.ward_code,
        //   country: item.country,
        //   county_code: item.county_code,
        //   constituency: item.constituency,
        //   introduced: item.introduced,
        //   terminated: item.terminated,
        //   parish: item.parish,
        //   built_up_area: item.built_up_area,
        //   built_up_sub_division: item.built_up_sub_division,
        //   lower_layer_super_output_area: item.lower_layer_super_output_area,
        //   region: item.region,
        //   altitude: item.altitude,
        //   london_zone: item.london_zone,
        //   lsoa_code: item.lsoa_code,
        //   local_authority: item.local_authority,
        //   msoa_code: item.msoa_code,
        //   middle_layer_super_output_area: item.middle_layer_super_output_area,
        //   parish_code: item.parish_code,
        //   census_output_area: item.census_output_area,
        //   constituency_code: item.constituency_code,
        //   last_updated: item.last_updated,
        //   postcode_area: item.postcode_area,
        //   postcode_district: item.postcode_district,
        //   plus_code: item.plus_code
        // })
        //
        // postcode
        //   .save()
        //   .then(doc => console.log(doc))
        //   .catch(err => {
        //     console.log('ERROR 💥:', err)
        //   })

      })

      res.render('load', {
        counts: {
          total: dataArray.length
        },
        total_count: count,
        page_count: pageCount,
        page_number: page,
        actions: {
          next: '/load?page=' + nextPage,
          previous: '/load?page=' + prevPage
        }
      })

    })
})

router.get('/set', (req, res) => {

  Postcode
    .find({ postcode_area: 'M' })
    .then(doc => {
      // console.log(doc)

      let loopCount = 0

      doc.forEach((item, i) => {
        // console.log(item.postcode.replace(/ +?/g, ''))
        // console.log(item.postcode.split(' '))

        Postcode
          .updateOne(
            { postcode: item.postcode },
            { postcode_key: item.postcode.replace(/ +?/g, '') }
          )
          .then(doc => console.log(doc))
          .catch(err => {
            console.log('ERROR 💥:', err)
          })

        loopCount++

        if (loopCount === 2000) {
          sleep(10000)
        }

      })

    })
    .catch(err => {
      console.log('ERROR 💥:', err)
    })

  // Postcode
  //   .countDocuments({ country : "England" })
  //   .then(doc => console.log(doc))
  //   .catch(err => {
  //     console.log('ERROR 💥:', err)
  //   })

  // Postcode
  //   .updateMany(
  //     { postcode: 'AL5 1ND' },
  //     [
  //       { $set: { postcode_key: "$postcode" } }
  //     ]
  //   )
  //   .then(doc => console.log(doc))
  //   .catch(err => {
  //     console.log('ERROR 💥:', err)
  //   })

  // Postcode
  //   .updateMany(
  //     { country: 'England' },
  //     [
  //       { $set: ['postcode_key'] }
  //     ]
  //   )
  //   .then(doc => console.log(doc))
  //   .catch(err => {
  //     console.log('ERROR 💥:', err)
  //   })

  // Postcode
  //   .aggregate(
  //     [{ $updateOne: { input: "$postcode_key", find: ' ', replacement: '' } }]
  //   )
  //   .then(doc => console.log(doc))
  //   .catch(err => {
  //     console.log('ERROR 💥:', err)
  //   })

  // Postcode
  //   .updateMany(
  //     { postcode: 'AL5 1ND' },
  //     [
  //       { $unset: ['postcode_key'] }
  //     ]
  //   )
  //   .then(doc => console.log(doc))
  //   .catch(err => {
  //     console.log('ERROR 💥:', err)
  //   })

  // Postcode
  //   .find(
  //     { postcode: 'AL5 1ND' }
  //   )
  //   .then(doc => console.log(doc))
  //   .catch(err => {
  //     console.log('ERROR 💥:', err)
  //   })

    // .update({ postcode_area: 'B' }, { $unset: { national_park: 0 } })

    // ['national_park', 'population', 'households', 'index_of_multiple_deprivation', 'quality', 'user_type', 'nearest_station', 'distance_to_station', 'police_force', 'water_company', 'average_income', 'sewage_company', 'travel_to_work_area']

    // Postcode
    //   .deleteMany({country: 'Wales'})
    //   .catch(err => {
    //     console.log('ERROR 💥:', err)
    //   })

    res.render('blah', {

    })

  // console.log(req.db.collections);
})

// router.get('/load2', (req, res) => {
//   const filePath = path.join(__dirname, './data/postcodes/kw-postcodes.csv')
//
//   csvtojson()
//     .fromFile(filePath)
//     .then((data) => {
//
//       // Total number of items
//       let count = data.length
//
//       // console.log(count)
//
//       // Prevent users putting in a limit not in the pre-defined set: 10, 25, 50, 100
//       let limit = 1500
//
//       // Total number of pages
//       let pageCount = Math.ceil(count / limit)
//
//
//       for (let step = 1; step <= pageCount; step++) {
//
//         let dataArray = paginate(data, limit, step)
//
//         console.log(`Step: ${step}`)
//
//         dataArray.forEach((item, i) => {
//
//           let postcode = new Postcode({
//             postcode: item.postcode,
//             in_use: true,
//             latitude: item.latitude,
//             longitude: item.longitude,
//             easting: item.easting,
//             northing: item.northing,
//             grid_ref: item.grid_ref,
//             county: item.county,
//             district: item.district,
//             ward: item.ward,
//             district_code: item.district_code,
//             ward_code: item.ward_code,
//             country: item.country,
//             county_code: item.county_code,
//             constituency: item.constituency,
//             introduced: item.introduced,
//             terminated: item.terminated,
//             parish: item.parish,
//             national_park: item.national_park,
//             population: item.population,
//             households: item.households,
//             built_up_area: item.built_up_area,
//             built_up_sub_division: item.built_up_sub_division,
//             lower_layer_super_output_area: item.lower_layer_super_output_area,
//             rural_urban: item.rural_urban,
//             region: item.region,
//             altitude: item.altitude,
//             london_zone: item.london_zone,
//             lsoa_code: item.lsoa_code,
//             local_authority: item.local_authority,
//             msoa_code: item.msoa_code,
//             middle_layer_super_output_area: item.middle_layer_super_output_area,
//             parish_code: item.parish_code,
//             census_output_area: item.census_output_area,
//             constituency_code: item.constituency_code,
//             index_of_multiple_deprivation: item.index_of_multiple_deprivation,
//             quality: item.quality,
//             user_type: item.user_type,
//             last_updated: item.last_updated,
//             nearest_station: item.nearest_station,
//             distance_to_station: item.distance_to_station,
//             postcode_area: item.postcode_area,
//             postcode_district: item.postcode_district,
//             police_force: item.police_force,
//             water_company: item.water_company,
//             plus_code: item.plus_code,
//             average_income: item.average_income,
//             sewage_company: item.sewage_company,
//             travel_to_work_area: item.travel_to_work_area
//           })
//
//           postcode
//             .save()
//             .then(doc => console.log(doc))
//             .catch(err => {
//               console.log('ERROR 💥:', err)
//             })
//
//         })
//
//         if (step < pageCount) {
//           sleep(5000)
//         }
//
//       }
//
//       res.render('load', {
//         counts: {
//           total: count
//         }
//       })
//
//     })
// })

// --------------------------------------------------
// Add routes above this line
// --------------------------------------------------
module.exports = router
