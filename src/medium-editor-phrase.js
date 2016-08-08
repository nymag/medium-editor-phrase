const MediumEditor = require('medium-editor');

module.exports = MediumEditor.extensions.button.extend({

  // default values can be overwritten by options on init
  phraseTagName: 'span', // lowercase tagName of the phrase tag
  phraseClassList: [], // classes applied to each phrase tag
  name: 'phrase', // name used to reference the button from Medium Editor
  contentDefault: 'S', // html visible to the user in the toolbar button
  aria: 'Span Button', // aria label
  classList: [], // classes added to the button

  init: function () {
    MediumEditor.Extension.prototype.init.apply(this, arguments);

    // properties not set in options
    this.useQueryState = false; // cannot rely on document.queryCommandState()
    this.placeholderHtml = '<div data-phrase-placeholder="true"></div>';
    this.placeholderSelector = 'div[data-phrase-placeholder="true"]';
    this.phraseHasNoClass = this.phraseClassList.length === 0;
    this.phraseSelector = this.phraseTagName + this.phraseClassList.reduce((selector, className) => selector + '.' + className, '');
    this.openingTag = `<${ this.phraseTagName }${ this.phraseHasNoClass ? '' : ' class="' + this.phraseClassList.join(' ').trim() + '"' }>`;
    this.closingTag = `</${ this.phraseTagName }>`;
    this.button = this.createButton();
    this.on(this.button, 'click', this.handleClick.bind(this));
  },

  /**
   * returns a clone of the selection inside a `div` container
   * @returns {Element}
   */
  cloneSelection: function () {
    var range = MediumEditor.selection.getSelectionRange(this.document),
      container = document.createElement('div');

    container.appendChild(range.cloneContents());
    return container;
  },

  /**
   * check if the node is a phrase
   * @param {Node} node
   * @returns {boolean}
   */
  isPhraseNode: function (node) {
    return !!(
      node &&
      node.tagName.toLowerCase() === this.phraseTagName &&
      (this.phraseHasNoClass ? !node.className : this.phraseClassList.reduce((hasAll, c) => hasAll && node.classList.contains(c), true))
    );
  },

  /**
   *
   * @param {Element} phrase
   */
  removePhraseTags: function (phrase) {
    phrase.outerHTML = phrase.innerHTML;
  },

  /**
   *
   * @param {string} phrase
   * @returns {string}
   */
  addPhraseTags: function (phrase) {
    var closingTagsAtStart = '',
      openingTagsAtEnd = '';

    // innerHTML sometimes returns fragments that start or end
    // with tags that we do not want to wrap in the phrase tags.
    // e.g. `a<b>` should become `<span>a</span><b>`
    // e.g. `</b>a` should become `</b><span>a</span>`
    phrase = phrase.replace(/^(<\/[^>]+>)*/, function (match) {
      closingTagsAtStart = match;
      return '';
    }).replace(/(<[^\/>]+>)*$/, function (match) {
      openingTagsAtEnd = match;
      return '';
    });

    // add phrase tags
    return closingTagsAtStart + this.openingTag + phrase + this.closingTag + openingTagsAtEnd;
  },

  /**
   *
   * @param {Node} container
   * @returns {Array} Array of phrase elements that are in the selection
   */
  getSelectionPhrases: function (container) {
    var selectionPhrases = Array.prototype.slice.call(container.querySelectorAll(this.phraseSelector + ',' + this.placeholderSelector));

    if (this.phraseHasNoClass) {
      selectionPhrases = selectionPhrases.filter(phrase => !phrase.className); // ensure phrases have no className
    }
    return selectionPhrases;
  },

  /**
   * replaces the selection with new html and selects the new html
   * @param {string} html
   * @param {boolean} [shouldSelectHtml]
   */
  replaceSelectionHtml: function (html, shouldSelectHtml) {
    var fragment,
      range = MediumEditor.selection.getSelectionRange(this.document),
      selection = this.document.getSelection();

    // insert html
    range.deleteContents();
    fragment = range.createContextualFragment(html);
    range.insertNode(fragment);

    // remove selection
    selection.removeAllRanges();

    // select html
    if (shouldSelectHtml !== false) {
      if (fragment.firstChild) {
        range.setStartBefore(fragment.firstChild);
        range.setEndAfter(fragment.lastChild);
      }
      selection.addRange(range);
    }
  },

  /**
   * get the innerHTML or textContent
   * @param {Node} node
   * @returns {string}
   */
  getNodeHtml: function (node) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        return node.innerHTML;
      case Node.TEXT_NODE:
        return node.textContent;
      default:
        return node.innerHTML || node.textContent || '';
    }
  },

  /**
   * check if the selection has a phrase as a child or ancestor
   * @returns {boolean}
   */
  isAlreadyApplied: function () {
    return this.hasSelectionPhrase() || !!this.getAncestorPhrase();
  },

  /**
   * html before and after the selection remain phrases,
   * a placeholder text node becomes the selected range,
   * and the selection html is returned.
   * @param {Element} ancestorPhrase
   * @returns {string}
   */
  removeAncestorPhrase: function (ancestorPhrase) {
    var ancestorPhraseParent = ancestorPhrase.parentNode,
      selectionHtml = this.getNodeHtml(this.cloneSelection()),
      selection = this.document.getSelection(),
      range = this.document.createRange(),
      placeholderHtml = this.placeholderHtml,
      placeholderEl,
      textNodePlaceholder;

    // use the placeholder to update the html before and after the selection
    this.replaceSelectionHtml(placeholderHtml, false);
    ancestorPhrase.outerHTML = ancestorPhrase.cloneNode(true).innerHTML.split(placeholderHtml)
      // add phrase tags to fragments before and after selection
      .map(phrase => phrase && this.addPhraseTags(phrase))
      // re-insert placeholder where selection was
      .join(placeholderHtml);

    // select a text node where the original selection needs to be re-inserted
    selection.removeAllRanges();
    placeholderEl = ancestorPhraseParent.querySelector(this.placeholderSelector);
    textNodePlaceholder = placeholderEl.parentNode.insertBefore(this.document.createTextNode('safariNeedsTextNode'), placeholderEl.nextSibling);
    placeholderEl.parentNode.removeChild(placeholderEl);
    range.selectNode(textNodePlaceholder); // selects text node because safari only allows selection of text nodes.
    selection.addRange(range);

    // return the selection html
    return selectionHtml;
  },

  /**
   * get the HTML from the selected range and either add or remove the phrase tags.
   * @returns {string} HTML
   */
  togglePhraseTags: function () {
    var html,
      container = this.cloneSelection(),
      selectionPhrases = this.getSelectionPhrases(container);

    if (selectionPhrases.length) { // selection already has phrases, so remove them
      selectionPhrases.forEach(this.removePhraseTags); // remove phrases while keeping their innerHTML
      html = container.innerHTML;
    } else { // no phrases found so add phrase tags
      html = this.addPhraseTags(container.innerHTML);
    }
    return html;
  },

  /**
   * traverse down from the selection to find at least one phrase
   * @returns {boolean}
   */
  hasSelectionPhrase: function () {
    return this.getSelectionPhrases(this.cloneSelection()).length > 0;
  },

  /**
   * traverse up from the selection to find the first ancestor phrase
   * @returns {Node|boolean}
   */
  getAncestorPhrase: function () {
    return MediumEditor.util.traverseUp(MediumEditor.selection.getSelectionRange(this.document).startContainer, this.isPhraseNode.bind(this));
  },

  /**
   * when the button is clicked, update the html
   * @param {object} e
   */
  handleClick: function (e) {
    var ancestorPhrase = this.getAncestorPhrase();

    e.preventDefault();
    e.stopPropagation();
    this.replaceSelectionHtml(!ancestorPhrase || this.hasSelectionPhrase() ? this.togglePhraseTags() : this.removeAncestorPhrase(ancestorPhrase));
    this.isAlreadyApplied() ? this.setActive() : this.setInactive(); // update button state
    this.base.checkContentChanged(); // triggers 'editableInput' event
  },
});
