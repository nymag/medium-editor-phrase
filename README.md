# Medium Editor Phrase

[![Build Status](https://travis-ci.org/nymag/medium-editor-phrase.svg)](https://travis-ci.org/nymag/medium-editor-phrase)
[![Coverage Status](https://coveralls.io/repos/nymag/medium-editor-phrase/badge.svg?branch=master)](https://coveralls.io/r/nymag/medium-editor-phrase?branch=master)

Medium Editor Phrase is an extension to add a "phrase" button to [Medium Editor](https://github.com/yabwe/medium-editor).

A "phrase" is a group of one or more words.

This extension can be used to add a button to Medium Editor that adds an HTML tag to the selected text. Generally this means adding a `span` tag around a phrase that may not have any semantic meaning. The `span` can be useful for adding styles to the selected phrase. The phraseTagName is an option, so any [HTML phasing content tag](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#Phrasing_content) can be used, e.g. `span`, `em`, or `code`.

In some cases an alternative is [MediumButton](https://github.com/arcs-/MediumButton); however, Medium Editor Phrase has improved handling of selecting/unselecting text and unit tests pass on Chrome, Firefox, Safari, Safari Mobile, and Edge.

## Installation

```
npm install medium-editor-phrase
```


## Initialization options

Options unique to Medium Editor Phrase:

* `phraseTagName`: lowercase tagName of the phrase tag, default `'span'`
* `phraseClassList`: classes applied to each phrase tag, default `[]`

Options inherited from Medium Editor's button:

* `name`: name used to reference the button from medium editor, default `'phrase'`
* `aria`: aria label, default `'phrase'`
* `contentDefault`: HTML visible to the user in the toolbar button, default `'S'`
* `classList`: classes added to the button, default `[]`


## Example

In this example, selected text will have a span added, 
e.g. `preceding selected succeeding` will become `preceding <span class="has-footnote">selected</span> succeeding`.

```html
<div class="editable"></div>

<script type="text/javascript" src="<path_to_medium-editor>/dist/js/medium-editor.js"></script>
<script type="text/javascript" src="<path_to_medium-editor-phrase>/dist/medium-editor-phrase.js"></script>

<script type="text/javascript" charset="utf-8">
  var editor = new MediumEditor('.editable', {
    toolbar: {
      buttons: ['bold', 'italic', 'phrase']
    },
    extensions: {
      phrase: new MediumEditorPhrase({
         name: 'footnote',
         aria: 'footnote',
         contentDefault: 'F¹',
         phraseClassList: ['has-footnote']
      })
    }
  });
</script>
```


## Terminal commands
* `npm install medium-editor-phrase` downloads Medium Editor Phrase.
* `npm test` runs both eslint and karma tests configured by `karma.conf.js`.
* `npm run test-travis` runs eslint and karma configured for Travis CI by `karma.travis.conf.js` to run tests on headless Chrome browser and report code coverage to Coveralls.
* `npm run test-browserstack` runs eslint locally and karma tests on BrowserStack configured by `karma.browserstack.conf.js`. Note: `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` environment variables must be set to run tests on BrowserStack.
* `gulp` compiles the script to `dist/medium-editor-phrase.js` and `dist/medium-editor-phrase.min.js`.


## License

[MIT](https://github.com/nymag/medium-editor-phrase/blob/master/LICENSE)
