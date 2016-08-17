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

      it('removes parent phrase tags from selection when there is no text node in unselected area', function () {
        el.innerHTML = '<span class="phrase-class"><b>selected</b></span>';
        selectText(el.querySelector('b'));
        clickPhraseButton();
        expect(el.innerHTML).to.equal('<b>selected</b>');
      });

      it('does not add phrase tags if the selection has no text node', function () {
        el.innerHTML = '<b></b>';
        selectText(el.querySelector('b'));
        clickPhraseButton();
        expect(el.innerHTML).to.not.contain('<span class="phrase-class">'); // testing with `not.contain` because Edge adds a <br> when an empty element is selected
      });

      it('removes phrase tags if the selection ends at the end of the last text node in a phrase', function () {
        // this is a case that can arise when a phrase is added and then text in front of the phrase through to the end of the phrase is selected.
        el.innerHTML = 'a<span class="phrase-class"><b>b</b></span>';
        selectText(el.firstChild, 0, el.querySelector('b').firstChild, 1);
        clickPhraseButton();
        expect(el.innerHTML).to.equal('a<b>b</b>');
      });

      it('removes phrase tags if the selection starts at the first text node in a phrase and ends after the phrase', function () {
        el.innerHTML = 'a<span class="phrase-class"><b>b</b></span>c';
        selectText(el.querySelector('b').firstChild, 0, el.lastChild, 0);
        clickPhraseButton();
        expect(el.innerHTML).to.equal('a<b>b</b>c');
      });

      it('removes phrase tags if the selection starts at the first text node in a phrase and ends at the end of another phrase', function () {
        el.innerHTML = 'a<span class="phrase-class"><b>b</b></span>c<span class="phrase-class"><i>d</i></span>';
        selectText(el.querySelector('b').firstChild, 0, el.querySelector('i').firstChild, 1);
        clickPhraseButton();
        expect(el.innerHTML).to.equal('a<b>b</b>c<i>d</i>');
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

      it('removes parent phrase tags from selection when there is no text node in unselected area', function () {
        el.innerHTML = '<span><b>selected</b></span>';
        selectText(el.querySelector('b'));
        clickPhraseButton();
        expect(el.innerHTML).to.equal('<b>selected</b>');
      });

      it('does not add phrase tags if the selection has no text node', function () {
        el.innerHTML = '<b></b>';
        selectText(el.querySelector('b'));
        clickPhraseButton();
        expect(el.innerHTML).to.not.contain('<span>');
      });

      it('removes phrase tags if the selection ends at the end of the last text node in a phrase', function () {
        el.innerHTML = 'a<span><b>b</b></span>';
        selectText(el.firstChild, 0, el.querySelector('b').firstChild, 1);
        clickPhraseButton();
        expect(el.innerHTML).to.equal('a<b>b</b>');
      });

      it('removes phrase tags if the selection starts at the first text node in a phrase and ends after the phrase', function () {
        el.innerHTML = 'a<span><b>b</b></span>c';
        selectText(el.querySelector('b').firstChild, 0, el.lastChild, 0);
        clickPhraseButton();
        expect(el.innerHTML).to.equal('a<b>b</b>c');
      });

      it('removes phrase tags if the selection starts at the first text node in a phrase and ends at the end of another phrase', function () {
        el.innerHTML = 'a<span><b>b</b></span>c<span><i>d</i></span>';
        selectText(el.querySelector('b').firstChild, 0, el.querySelector('i').firstChild, 1);
        clickPhraseButton();
        expect(el.innerHTML).to.equal('a<b>b</b>c<i>d</i>');
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

      it('removes parent phrase tags from selection when there is no text node in unselected area', function () {
        el.innerHTML = '<em class="phrase-class"><b>selected</b></em>';
        selectText(el.querySelector('b'));
        clickPhraseButton();
        expect(el.innerHTML).to.equal('<b>selected</b>');
      });

      it('does not add phrase tags if the selection has no text node', function () {
        el.innerHTML = '<b></b>';
        selectText(el.querySelector('b'));
        clickPhraseButton();
        expect(el.innerHTML).to.not.contain('<em class="phrase-class">');
      });

      it('removes phrase tags if the selection ends at the end of the last text node in a phrase', function () {
        el.innerHTML = 'a<em class="phrase-class"><b>b</b></em>';
        selectText(el.firstChild, 0, el.querySelector('b').firstChild, 1);
        clickPhraseButton();
        expect(el.innerHTML).to.equal('a<b>b</b>');
      });

      it('removes phrase tags if the selection starts at the first text node in a phrase and ends after the phrase', function () {
        el.innerHTML = 'a<em class="phrase-class"><b>b</b></em>c';
        selectText(el.querySelector('b').firstChild, 0, el.lastChild, 0);
        clickPhraseButton();
        expect(el.innerHTML).to.equal('a<b>b</b>c');
      });

      it('removes phrase tags if the selection starts at the first text node in a phrase and ends at the end of another phrase', function () {
        el.innerHTML = 'a<em class="phrase-class"><b>b</b></em>c<em class="phrase-class"><i>d</i></em>';
        selectText(el.querySelector('b').firstChild, 0, el.querySelector('i').firstChild, 1);
        clickPhraseButton();
        expect(el.innerHTML).to.equal('a<b>b</b>c<i>d</i>');
      });

    });

  });
});
