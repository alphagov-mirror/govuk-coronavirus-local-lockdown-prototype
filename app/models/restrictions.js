'use strict'

const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')

const directoryPath = path.join(__dirname, '../data/')
const restrictions = yaml.safeLoad(fs.readFileSync(directoryPath + 'restrictions.yaml', 'utf8'))

exports.find = () => {
  return restrictions
}

exports.findById = (code) => {
  if (!code) {
    return null
  }

  const restrictions = this.find()
  let restriction = {}

  if (restrictions[code] !== undefined) {
    restriction = restrictions[code].restrictions.pop()
  } else {
    restriction.alert_level = 1
    restriction.start_date = "2020-10-12"
    restriction.start_time = "00:01"
  }

  return restriction
}
