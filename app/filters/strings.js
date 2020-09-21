// -------------------------------------------------------------------
// Imports and setup
// -------------------------------------------------------------------
const string = require('string')
const _ = require('lodash')

// Leave this filters line
const filters = {}

filters.isString = (obj) => {
  return typeof obj === 'string'
}

/*
  ====================================================================
  slugify
  --------------------------------------------------------------------
  Create url slugs from text
  ====================================================================

  Usage:

  {{ "This is a heading" | slugify }}

  = this-is-a-heading

*/

filters.slugify = (input) => {
  if (!input) {
    return 'Error in slugify: no input'
  } else {
    return string(input).slugify().toString()
  }
}

/*
  ====================================================================
  kebabCase
  --------------------------------------------------------------------
  Hypen separate a string
  ====================================================================

  Usage:

  {{ "This is a string" | kebabCase }}

  = this-is-a-string

*/

filters.kebabCase = (string) => {
  return string.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g, '-').toLowerCase()
}

/*
  ====================================================================
  sentenceCase
  --------------------------------------------------------------------
  Uppercase first letter
  ====================================================================

  Usage:

  [Usage here]

*/

filters.sentenceCase = (input) => {
  if (!input) {
    return ''// avoid printing false to client
  }

  if (_.isString(input)) {
    return input.charAt(0).toUpperCase() + input.slice(1)
  } else {
    return input
  }
}

// -------------------------------------------------------------------
// keep the following line to return your filters to the app
// -------------------------------------------------------------------
exports.filters = filters
