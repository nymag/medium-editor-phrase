const MediumEditor = require('medium-editor'),
  dirname = __dirname.split('/').pop(),
  filename = __filename.split('/').pop().split('.').shift(),
  lib = require('./medium-editor-phrase'), // static-analysis means this must be string, not ('./' + filename);
  buttonClass = 'medium-editor-action-phrase',
  phraseClass = 'phrase-class',
  phraseButtonName = 'phrase';

function clickPhraseButton() {
  document.querySelector('.' + buttonClass).click(); // click on the editor
}

/**
 * selects text
 * @param {Node} startNode
 * @param {number} [startOffset]
 * @param {Node} [endNode]
 * @param {number} [endOffset]
 */
function selectText(startNode, startOffset, endNode, endOffset) {
  var selection = window.getSelection(),
    range = document.createRange();

  if (!endNode) {
    range.selectNodeContents(startNode);
  } else {
    range.setStart(startNode, startOffset || 0);
    range.setEnd(endNode, endOffset || 0);
  }
  selection.removeAllRanges();
  selection.addRange(range);
}

/**
 * inits medium editor with a phrase button
 * @param {Element} el
 * @param {object} phraseConfig
 * @returns {object}
 */
function initEditorWithButton(el, phraseConfig) {
  phraseConfig.name = phraseButtonName;
  return new MediumEditor(el, {
    toolbar: { buttons: [phraseButtonName] },
    extensions: { phrase: new lib(phraseConfig)}
  });
}

describe(dirname, function () {
  describe(filename, function () {
    var el;

    beforeEach(function () {
      el = document.body.appendChild(document.createElement('div'));
      initEditorWithButton(el, {
        classList: [buttonClass],
        phraseClassList: [phraseClass],
        phraseTagName: 'span'
      });
    });

    it('adds phrase tags to selection', function () {
      el.innerHTML = 'Some Phrase.';
      selectText(el.firstChild);
      clickPhraseButton();
      expect(el.innerHTML).to.equal('<span class="phrase-class">Some Phrase.</span>');
    });

    it('removes phrase tags from selection', function () {
      el.innerHTML = '<p><span class="phrase-class">Some Phrase.</span></p>';
      selectText(el);
      clickPhraseButton();
      expect(el.innerHTML).to.equal('<p>Some Phrase.</p>');
    });

    it('removes parent phrase tags from selection', function () {
      el.innerHTML = '<span class="phrase-class">a <b>selected</b> unselected</span>';
      selectText(el.querySelector('b'));
      clickPhraseButton();
      expect(el.innerHTML).to.equal('<span class="phrase-class">a </span><b>selected</b><span class="phrase-class"> unselected</span>');
    });

  });
});
