// Generated by CoffeeScript 1.8.0
// Initializes function definitions for content generation
(function() {
  var makeDiv, makeImgElem;
	
  /**
   * Creates an HTML division with the given
   * set of attributes and styling.
   * @param at the attribute data to add
   * @param cData the CSS (styling) data to add
   */
  makeDiv = function(at, cData) {
    var nDiv;
    if (at == null) {
      at = "none";
    }
    if (cData == null) {
      cData = "none";
    }
    nDiv = $('<div></div>');
    if (at !== "none") {
      nDiv.attr(at);
    }
    if (cData !== "none") {
      nDiv.css(cData);
    }
    return nDiv;
  };
  
  /**
   * Makes an HTML image element given
   * the set of attributes and styling.
   * @param attrData the attribute data to add
   * @param cssData the styling data to add
   */
  makeImgElem = function(attrData, cssData) {
    var nImg;
    nImg = $('<img></img>');
    if (cssData !== "none") {
      nImg.css(cssData);
    }
    if (attrData !== "none") {
      nImg.attr(attrData);
    }
    return nImg;
  };

  window.makeImgElem = makeImgElem;

  window.makeDiv = makeDiv;

}).call(this);
