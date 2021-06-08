
/**
 * Expose `json`
 */

module.exports = json;

/**
 * Add `json` as a language.
 *
 * @param {Highlight} highlight
 * @api public
 */

function json(highlight){
  highlight.language('json', json);
}

/**
 * Booleans
 */

json.boolean = /\b(true|false)\b/;

/**
 * Strings
 */

json.string = /("(\\?.)*")/;

/**
 * Punctuation
 */

json.punctuation = /[{}[\]:]/;

/**
 * Numbers
 */

json.number = /\b-?(\d+\.?\d*([eE]-?\d+)?)\b/;