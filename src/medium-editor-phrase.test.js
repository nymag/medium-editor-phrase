const MediumEditor = require('medium-editor'),
  dirname = __dirname.split('/').pop(),
  filename = __filename.split('/').pop().split('.').shift(),
  lib = require('./medium-editor-phrase'); // static-analysis means this must be string, not ('./' + filename);

let phraseButtonName = '', count = 0; // phrase button name needs to be unique each time

/**
 * inits medium editor with a phrase button
 * @param {Element} el
 * @param {object} phraseConfig
 * @returns {object}
 */
function initEditorWithButton(el, phraseConfig) {
  var extensions = {};

  phraseButtonName = 'phrase' + ++count; // phrase button name needs to be unique each time
  phraseConfig.name = phraseButtonName;
  extensions[phraseButtonName] = new lib(phraseConfig);
  return new MediumEditor(el, {
    toolbar: { buttons: [phraseButtonName] },
    extensions: extensions
  });
}

/**
 * selects text
 * @param {Node} startNode
 */
function selectText(startNode) {
  var selection = window.getSelection(),
    range = document.createRange();

  range.selectNodeContents(startNode);
  selection.removeAllRanges();
  selection.addRange(range);
}

/**
 * click on the button
 */
function clickPhraseButton() {
  document.querySelector('.medium-editor-action-' + phraseButtonName).click();
}

describe(dirname, function () {
  describe(filename, function () {
    var el;

    beforeEach(function () {
      el = document.body.appendChild(document.createElement('div'));
    });

    describe('when phrase has a class', function () {

      beforeEach(function () {
        initEditorWithButton(el, {
          phraseClassList: ['phrase-class'],
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

    describe('when phrase has no class', function () {

      beforeEach(function () {
        initEditorWithButton(el, {
          phraseClassList: [], // no class
          phraseTagName: 'span'
        });
      });

      it('adds phrase tags to selection', function () {
        el.innerHTML = 'Some Phrase.';
        selectText(el.firstChild);
        clickPhraseButton();
        expect(el.innerHTML).to.equal('<span>Some Phrase.</span>');
      });

      it('removes phrase tags from selection', function () {
        el.innerHTML = '<p><span>Some Phrase.</span></p>';
        selectText(el);
        clickPhraseButton();
        expect(el.innerHTML).to.equal('<p>Some Phrase.</p>');
      });

      it('removes parent phrase tags from selection', function () {
        el.innerHTML = '<span>a <b>selected</b> unselected</span>';
        selectText(el.querySelector('b'));
        clickPhraseButton();
        expect(el.innerHTML).to.equal('<span>a </span><b>selected</b><span> unselected</span>');
      });

    });

    describe('when phrase is a different phrasing tag', function () {

      beforeEach(function () {
        initEditorWithButton(el, {
          phraseClassList: ['phrase-class'],
          phraseTagName: 'em' // this could be any phrasing content tag
        });
      });

      it('adds phrase tags to selection', function () {
        el.innerHTML = 'Some Phrase.';
        selectText(el.firstChild);
        clickPhraseButton();
        expect(el.innerHTML).to.equal('<em class="phrase-class">Some Phrase.</em>');
      });

      it('removes phrase tags from selection', function () {
        el.innerHTML = '<p><em class="phrase-class">Some Phrase.</em></p>';
        selectText(el);
        clickPhraseButton();
        expect(el.innerHTML).to.equal('<p>Some Phrase.</p>');
      });

      it('removes parent phrase tags from selection', function () {
        el.innerHTML = '<em class="phrase-class">a <b>selected</b> unselected</em>';
        selectText(el.querySelector('b'));
        clickPhraseButton();
        expect(el.innerHTML).to.equal('<em class="phrase-class">a </em><b>selected</b><em class="phrase-class"> unselected</em>');
      });

    });

  });
});
