[![Build Status](https://travis-ci.org/tripu/Performs.svg?branch=master)](https://travis-ci.org/tripu/Performs)

# <span style="color: #c00000;">Per</span>forms

An HTML UI engine written in JavaScript.

* [Intro and examples](https://tripu.github.io/Performs/doc/)
* [API reference](https://tripu.github.io/Performs/api/)
* [GitHub project](https://github.com/tripu/Performs)
* [npm package](https://www.npmjs.com/package/performs)

## Installation

<span style="color: #c00000;">Per</span>forms requires jQuery.

Server-side only:

```bash
$ npm i performs
```

Either server- or client-side:

```javascript
var Performs = require('performs').Performs;
```

## Usage

Let's assume the HTML document is this:

```html
<html>
  <body>
    <p>Enter your details to create your new e-mail account!</p>
    <form id="userPreferences">
  </body>
</html>
```

And let's assume the URL `https://example.com/options.json` returns this JSON object:

```json
{
  "schema": "performs-0.2.0",
  "content": [
    {
      "id":       "givenName",
      "type":     "string",
      "label":    "Given name",
      "required": true
    }, {
      "id":       "familyName",
      "type":     "string",
      "label":    "Family name",
      "required": true
    }, {
      "id":       "phone",
      "type":     "string",
      "label":    "Contact phone number"
    }, {
      "id":       "email",
      "type":     "string",
      "label":    "Desired e-mail address",
      "required": true,
      "value":    "{{$givenName$familyName@example.com}}"
    }, {
      "id":       "subscribe",
      "type":     "boolean",
      "label":    "Subscribe to the newsletter",
      "value":    "true"
    }, {
      "id":       "call",
      "type":     "boolean",
      "label":    "Get a free call from our marketing departament",
      "enabled":  "{{@phone}}",
      "value":    "true"
    }
  ]
}
```

We can invoke Performs like this:

```javascript
var performs = new Performs();
performs.perform('https://example.com/options.json', '#userPreferences');
```

After Performs is done, new elements will created inside the initial (empty) form, and the resulting document will be:

```html
<html>
  <body>
    <p>Enter your details to create your new e-mail account!</p>
    <form id="userPreferences" class="pf-processed">
      <label for="pf-givenName">Given name</label>
      <input id="pf-givenName" type="text" required>
      <label for="pf-familyName">Family name</label>
      <input id="pf-familyName" type="text" required>
      <label for="pf-phone">Contact phone number</label>
      <input id="pf-phone" type="text">
      <label for="pf-email">Desired e-mail address</label>
      <input id="pf-email" type="text" required>
      <label>
        <input id="pf-subscribe" type="checkbox" checked>
        Subscribe to the newsletter
      </label>
      <label>
        <input id="pf-call" type="checkbox" checked disabled>
        Get a free call from our marketing departament
      </label>
    </form>
  </body>
</html>
```

&hellip;effectively *translating* the JSON object into an HTML form.

However, rendering a form programmatically like this wouldn't be that difficult, or particularly useful.
The interesting part is that Performs *understands* the relations between fields.
So for example, in the JSON above,

```
{
  "id":       "email",
  "type":     "string",
  "label":    "Desired e-mail address",
  "required": true,
  "value":    "{{$givenName$familyName@example.com}}"
}
```

means:

* &ldquo;Add a field with ID `email`, of type &laquo;string&raquo;, showing this label&rdquo;
* &ldquo;This field *has to have* a value, or the form can't be submitted&rdquo;
* **&ldquo;Whenever the value of the field `givenName` or the value of the field `familyName` change, change automatically the value of `email`, according to
the expression specified.&rdquo;**
For instance, the given name `John` and the family name `Smith` would produce the value `JohnSmith@example.com` for this field.

To achieve this, Performs adds event listeners to all necessary fields.
Input-only fields (like `givenName` here) will *notify* other fields whenever their values change.

Performs detects *cycles* (circular dependencies among fields), which are forbidden for obvious reasons, and alerts the users if there are any.

There are other useful features, like:

* Read-only fields, useful for output-only data, eg results of computations or informative messages
* Automatically disabling fields depending on expressions
* Hidden fields, useful to hold temporary results, or to send extra data along with the visible form

The expressions understood by Performs, like the one above, extend regular JavaScript syntax, so in theory they can get as complex as needed, and anything is
possible.
The basic syntax is:

* Curly brackets signal an expression, eg `{{2020 === new Date().getFullYear()}}`
* An ID prefixed by `@` refers to the *value* of that field, eg `{{@givenName.replace(/\s/, '') /* Remove spaces */}}`

## API

The class `Performs` exposes the following properties and methods.

### Property `version`

* Type: `String`
* Example: `'0.4.1'`

### Method `perform`

* Expects these arguments:
 * `json`: `stream`, `document`, `file`, a `String` containing a URL, or a `String` containing JSON
 * `form`: jQuery-like selector that identifies one (and only one) `<form>` element, eg `'.fields'`, `'form#userInput'`
* Returns: `0` if everything goes OK
* Throws:
 * `SyntaxError` if the number of arguments is not 2

## Test suite

```bash
$ npm t
```

At some point, `npm run test-ui` will work, too.

## Documentation

General documentation, introduction to the projects, and some live examples are under `doc/`.

Generated documentation (ie, the API reference) can be refreshed under `api/` running this command:

```bash
$ npm run jsdoc
```

## Credits

Copyright © 2014–2020 tripu ([`t@tripu.info`](mailto:t@tripu.info), [`https://tripu.info`](https://tripu.info/))

This project is licensed [under the terms of the MIT license](LICENSE.md).
