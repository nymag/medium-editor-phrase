# Medium Editor Phrase

Medium Editor Phrase is an extension to add a "phrase" button to [Medium Editor](https://github.com/yabwe/medium-editor).

A "phrase" is a group of one or more words.

This extension can be used to add a button to Medium Editor that adds an HTML tag to the selected text. Generally this means adding a `span` tag around a phrase that may not have any semantic meaning. The `span` can be useful for adding styles to the selected phrase. The phraseTagName is an option, so tags other than `span` can be used, e.g. `div`, `pre`, or any other tag.


## Installation

```
npm install medium-editor-phrase
```

On install, the library will compile to `dist/medium-editor-phrase.js` and `dist/medium-editor-phrase.min.js`.


## Initialization options

Options unique to Medium Editor Phrase:

* `phraseTagName`: lowercase tagName of the phrase tag, default `'span'`
* `phraseClassList`: classes applied to each phrase tag, default `[]`

Options inherited from Medium Editor's button:

* `name`: name used to reference the button from medium editor, default `'phrase'`
* `aria`: aria label, default `'phrase'`
* `contentDefault`: HTML visible to the user in the toolbar button, default `'S'`
* `classList`: classes added to the button, default `['medium-editor-action-phrase']`


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
* `npm install medium-editor-phrase` downloads and compiles the script.
* `npm test` runs eslint locally and karma tests on BrowserStack configured by `karma.conf.js`. Note: `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` environment variables must be set to run tests on BrowserStack.
* `npm run test-local` runs both eslint and karma tests locally configured by `karma.local.conf.js`.
* `gulp` compiles the script to `dist/medium-editor-phrase.js` and `dist/medium-editor-phrase.min.js`.


## License

[MIT](https://github.com/nymag/medium-editor-phrase/blob/master/LICENSE)
