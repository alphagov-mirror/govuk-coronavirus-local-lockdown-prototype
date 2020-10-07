'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

// postcode_key: {type: String, required: true, unique: true, uppercase: true, trim: true},

const PostcodeSchema = new Schema({
  postcode: {type: String, required: true, unique: true, uppercase: true, trim: true},
  postcode_key: {type: String, required: true, unique: true, uppercase: true, trim: true},
  in_use: Boolean,
  latitude: Number,
  longitude: Number,
  easting: Number,
  northing: Number,
  grid_ref: String,
  county: String,
  district: String,
  ward: String,
  district_code: String,
  ward_code: String,
  country: String,
  county_code: String,
  constituency: String,
  introduced: Date,
  terminated: Date,
  parish: String,
  built_up_area: String,
  built_up_sub_division: String,
  lower_layer_super_output_area: String,
  region: String,
  altitude: Number,
  london_zone: Number,
  lsoa_code: String,
  local_authority: String,
  msoa_code: String,
  middle_layer_super_output_area: String,
  parish_code: String,
  census_output_area: String,
  constituency_code: String,
  last_updated: Date,
  postcode_area: String,
  postcode_district: String,
  plus_code: String
})

module.exports = mongoose.model('Postcode', PostcodeSchema)
