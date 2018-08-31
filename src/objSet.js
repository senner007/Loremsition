function Elt (n, thisHeight, thisWidth, margin, thisInst, eltObj) {

    this.o = thisInst.options; // its current position (as per the other elements)
    this.completeWidth = thisWidth || 0; // its width (with the margin)
    this.completeHeight = thisHeight || 0; // its height (with the margin)
    this.size;
    this.margin = margin;
    this.pos = thisInst.options.isVertical ? { top: eltObj.top, left: 0 } : {  top: 0, left: eltObj.left }; // its position (left and top position)
    this.initN = n; // its initial position (as per the other elements)
    this.n = n; // its current position (as per the other elements)
    this.currentPos = {top:0, left:0};

}

function setEltProto (param) {
    Object.defineProperty(Elt.prototype, param, {
        get: function() { return this.size },
        set: function(value) { this.size = value }
    })
}

export function _addToObject(elt, n, thisHeight, thisWidth, margin, thisInst, eltObj) {
    var thisElts = thisInst.elts
    thisElts[n] = elt;

    var param =  thisInst.options.isVertical ? "completeHeight" : "completeWidth";
    if (!(param in Elt.prototype)) {setEltProto(param);}
    thisElts[n].props = new Elt(n, thisHeight, thisWidth, margin, thisInst, eltObj)
};

export function _setEltsProps(elts, thisInst) {

    var size = 0;

    for (var i = 0; i < elts.length; i++) {
      var elt = elts[i];
      
      if (thisInst.options.isVertical) {
        elt.style.top = size + 'px'; // get each li height in case of individual heights.
        var thisHeight = _outerHeight(elt);
        var newPosTop = size
        size += thisHeight;

      } else {
        elt.style.left = size + 'px'; // get each li width in case of individual widths. (default)
        var thisWidth = _outerWidth(elt);
        var newPosLeft = size
        size += thisWidth;

      }
      let margin = _getMargin(elt, thisInst.options.isVertical);
      elt.style[thisInst.transitionPrefix] = '0ms'; // make sure the elts don't animate into position
      _addToObject(elt, i, thisHeight, thisWidth, margin, thisInst, {top:newPosTop, left:newPosLeft});
     // elt.style[thisInst.transformPrefix] = 'translate3d(0px, 0px, 0px)'; // must not be set for scale to work
    };
    return size; // return the size of the ul
};



export function _getMargin(el, isVertical) { // replacing jquery outerWidth(true)
    var style = getComputedStyle(el);
    var margin = isVertical ? parseInt(style.marginTop) + parseInt(style.marginBottom) : parseInt(style.marginLeft) + parseInt(style.marginRight);
    return margin;
}

export function _outerHeight(el) { // replacing jquery outerWidth(true)

    var height = el.offsetHeight;
    var style = getComputedStyle(el);
    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    return height;
}

export function _outerWidth(el) { // replacing jquery outerWidth(true)

    var width = el.offsetWidth;
    var style = getComputedStyle(el);
    width += parseInt(style.marginLeft) + parseInt(style.marginRight);
    return width;
}

export function _setInstances(thisinst, temporaryInstanceArray) {

    var adjInstances = thisinst.options.adjIds;                  
  
    for (var i= 0; i < temporaryInstanceArray.length; i++) {
  
        for (let n = 0; n < adjInstances.length; n++) {
  
            if (temporaryInstanceArray[i].id == adjInstances[n]) {
  
                var copy = { ...temporaryInstanceArray[i] };
                // delete nested adjInst object references in adjInst references
                 copy.adjCon.forEach(v =>  delete copy[v])
                 delete copy.adjCon;
  
                thisinst['adjInst' + (n +1)] = copy;
                thisinst.adjCon.push('adjInst' + (n +1))
  
                copy.distanceTo = thisinst.crossDistance(thisinst, temporaryInstanceArray[i])
            }
        }
    }
}