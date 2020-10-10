'use strict'

module.exports = function (env) {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  const filters = {}

  /* ------------------------------------------------------------------
    utility function to get an error for a component
    example: {{ errors | getErrorMessage('title') }}
    outputs: "Enter a title"
  ------------------------------------------------------------------ */
  filters.getErrorMessage = function (array, fieldName) {
    if (!array || !fieldName) {
      return null
    }

    const error = array.filter((obj) =>
      obj.fieldName === fieldName
    )[0]

    return error
  }

  /* ------------------------------------------------------------------
    utility function to get an error for a component
    example: {{ errors | getErrorMessage('title') }}
    outputs: "Enter a title"
  ------------------------------------------------------------------ */
  filters.getAlertLevel = function (level) {
    if (!level) {
      return null
    }

    let alertLevel = 'Medium'
    switch (level) {
      case 2:
        alertLevel = 'High'
        break
      case 3:
        alertLevel = 'Very High'
        break
    }
    return alertLevel
  }

  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters
}
