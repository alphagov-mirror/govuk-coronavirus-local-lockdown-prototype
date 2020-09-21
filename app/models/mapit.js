'use strict'

const https = require('https')
const fetch = require('node-fetch')

exports.find = (postcode) => {
  let parsedData = {}

  https.get(`https://mapit.mysociety.org/postcode/${postcode}`, (res) => {
    const { statusCode } = res
    const contentType = res.headers['content-type']

    let error
    // Any 2xx status code signals a successful response but
    // here we're only checking for 200.
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`)
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
                        `Expected application/json but received ${contentType}`)
    }
    if (error) {
      console.error(error.message)
      // Consume response data to free up memory
      res.resume()
      return
    }

    res.setEncoding('utf8')
    let rawData = ''
    res.on('data', (chunk) => { rawData += chunk; })
    res.on('end', () => {
      try {
        parsedData = JSON.parse(rawData)
        console.log(parsedData)
      } catch (e) {
        console.error(e.message)
      }
    })
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`)
  })

  return parsedData
}

// exports.find = (postcode) => {
//   const url = `https://mapit.mysociety.org/postcode/${postcode}`
//
//   const getData = async url => {
//     try {
//       const response = await fetch(url)
//       const json = await response.json()
//       console.log(json)
//     } catch (error) {
//       console.log(error)
//     }
//   }
//
//   return getData(url)
// }

exports.getArea = (postcode, type = 'council_county') => {
  // const data = this.find(postcode)
  let data = {
    wgs84_lat: 51.514451996043015,
    coordsyst: 'G',
    shortcuts: { WMC: 65853, ward: 144375, council: 2506 },
    wgs84_lon: -0.07299920492316776,
    postcode: 'E1 8QS',
    easting: 533811,
    areas: {
      '2247': {
        parent_area: null,
        generation_high: 40,
        all_names: {},
        id: 2247,
        codes: [Object],
        name: 'Greater London Authority',
        country: 'E',
        type_name: 'Greater London Authority',
        generation_low: 1,
        country_name: 'England',
        type: 'GLA'
      },
      '2506': {
        parent_area: null,
        generation_high: 40,
        all_names: {},
        id: 2506,
        codes: [Object],
        name: 'Tower Hamlets Borough Council',
        country: 'E',
        type_name: 'London borough',
        generation_low: 1,
        country_name: 'England',
        type: 'LBO'
      },
      '11806': {
        parent_area: null,
        generation_high: 40,
        all_names: {},
        id: 11806,
        codes: [Object],
        name: 'London',
        country: 'E',
        type_name: 'European region',
        generation_low: 1,
        country_name: 'England',
        type: 'EUR'
      },
      '11826': {
        parent_area: 2247,
        generation_high: 40,
        all_names: {},
        id: 11826,
        codes: [Object],
        name: 'City and East',
        country: 'E',
        type_name: 'London Assembly constituency',
        generation_low: 1,
        country_name: 'England',
        type: 'LAC'
      },
      '34763': {
        parent_area: null,
        generation_high: 40,
        all_names: {},
        id: 34763,
        codes: [Object],
        name: 'Tower Hamlets 021',
        country: 'E',
        type_name: 'Middle Layer Super Output Area (Full)',
        generation_low: 13,
        country_name: 'England',
        type: 'OMF'
      },
      '65853': {
        parent_area: null,
        generation_high: 40,
        all_names: {},
        id: 65853,
        codes: [Object],
        name: 'Bethnal Green and Bow',
        country: 'E',
        type_name: 'UK Parliament constituency',
        generation_low: 13,
        country_name: 'England',
        type: 'WMC'
      },
      '144375': {
        parent_area: 2506,
        generation_high: 40,
        all_names: {},
        id: 144375,
        codes: [Object],
        name: 'Whitechapel',
        country: 'E',
        type_name: 'London borough ward',
        generation_low: 22,
        country_name: 'England',
        type: 'LBW'
      },
      '154207': {
        parent_area: null,
        generation_high: 40,
        all_names: {},
        id: 154207,
        codes: [Object],
        name: 'Tower Hamlets 021F',
        country: 'E',
        type_name: 'Lower Layer Super Output Area (Full)',
        generation_low: 38,
        country_name: 'England',
        type: 'OLF'
      },
      '163653': {
        parent_area: null,
        generation_high: 40,
        all_names: {},
        id: 163653,
        codes: [Object],
        name: 'London',
        country: 'E',
        type_name: 'Travel to Work Areas',
        generation_low: 38,
        country_name: 'England',
        type: 'TTW'
      },
      '163929': {
        parent_area: null,
        generation_high: 40,
        all_names: {},
        id: 163929,
        codes: [Object],
        name: 'NHS Tower Hamlets CCG',
        country: 'E',
        type_name: 'Clinical Commissioning Group',
        generation_low: 40,
        country_name: 'England',
        type: 'CCG'
      },
      '900000': {
        parent_area: null,
        generation_high: 19,
        all_names: {},
        id: 900000,
        codes: {},
        name: 'House of Commons',
        country: '',
        type_name: 'UK Parliament',
        generation_low: 1,
        country_name: '-',
        type: 'WMP'
      },
      '900001': {
        parent_area: null,
        generation_high: 37,
        all_names: {},
        id: 900001,
        codes: {},
        name: 'European Parliament',
        country: '',
        type_name: 'European Parliament',
        generation_low: 1,
        country_name: '-',
        type: 'EUP'
      },
      '900002': {
        parent_area: 900006,
        generation_high: 40,
        all_names: {},
        id: 900002,
        codes: {},
        name: 'London Assembly',
        country: 'E',
        type_name: 'London Assembly area (shared)',
        generation_low: 1,
        country_name: 'England',
        type: 'LAE'
      },
      '900006': {
        parent_area: null,
        generation_high: 40,
        all_names: {},
        id: 900006,
        codes: {},
        name: 'London Assembly',
        country: 'E',
        type_name: 'London Assembly area',
        generation_low: 1,
        country_name: 'England',
        type: 'LAS'
      }
    },
    northing: 181263
  }

  let areaCode = ''

  console.log(typeof data.shortcuts.council === 'object');

  switch (type) {
    // case 'council_county':
    //   if (typeof data.shortcuts.council === 'object'){
    //     areaCode = data.shortcuts.council.county
    //   } else {
    //     areaCode = data.shortcuts.council
    //   }
    //   break;
    case 'council_district':
      if (typeof data.shortcuts.council === 'object'){
        areaCode = data.shortcuts.council.district
      } else {
        areaCode = data.shortcuts.council
      }
      break;
    case 'ward_county':
      if (typeof data.shortcuts.ward === 'object'){
        areaCode = data.shortcuts.ward.county
      } else {
        areaCode = data.shortcuts.council
      }
      break;
    case 'ward_district':
      if (typeof data.shortcuts.ward === 'object'){
        areaCode = data.shortcuts.ward.district
      } else {
        areaCode = data.shortcuts.district
      }
      break;
    default:
      if (typeof data.shortcuts.council === 'object'){
        areaCode = data.shortcuts.council.county
      } else {
        areaCode = data.shortcuts.council
      }
  }

  const area = data.areas[areaCode]

  console.log(area)

  return area
}
