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
  return restrictions[code]
}
