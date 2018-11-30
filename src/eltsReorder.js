import {
  _transToZero
} from "./animation.js"


export const onTrigger = { //These will trigger when the elt is crossing over to connected adjacent container/instance

  _addElt: function(elt, adjConElts, thisInst) {

    var isVertical = thisInst.options.isVertical;

    var plane = isVertical ? 'top' : 'left',
        adjEltsLength = adjConElts.length,
        insertPos = adjEltsLength;

    for (let i = 0; i < adjEltsLength; i++) { //Loop the array
      if (elt.props.currentPos[plane] < adjConElts[i].props.pos[plane] + adjConElts[i].props.size / 2) {
        insertPos = i;
        break;
      };
    };

    var diff = Math.abs ( thisInst.props.divWidth - thisInst.newInst.props.divWidth)

    // if new div width is not same - set to undefined if in vertical
    
    var width =  elt.props.completeWidth

    // TODO : should not be hardcoded as the number 2

    var height =  diff < 2  ? elt.props.completeHeight: isVertical ? undefined : elt.props.completeHeight;
   
    thisInst.added = thisInst._addLiToObject.call(thisInst.newInst, elt.innerHTML, insertPos, width, height);

  },
  _deleteElt: function(thisInst) { // going back to the originating container

    thisInst.removeLiElem.call(thisInst.newInst, thisInst.added, false, false, false);
    delete thisInst.added
    delete thisInst.newInst;

  },
  _homeEltsOpen: function(elt, elts, thisInst) {
    for (var i = 0; i < elts.length; i++) { // Loop over originating Container elements, animate and update their properties
      eltsReorder._eltsMoveForwardOrDown(elt, elts, thisInst);
    }
  },
  _homeEltsClose: function(elt, elts, thisInst) {
    for (let i = elt.props.n + 1; i < elts.length; i++) { // originating
      eltsReorder._eltsMoveBackOrUp(elt, elts, thisInst, true);
      // third argument is a flag to override pos check in eltsMoveDown/eltsMoveForward function
    }
  }
};

export const eltsReorder = {
  _eltsMoveForwardOrDown: function(elt, elts, thisInst, flag) {

    var plane = thisInst.options.isVertical ? 'top' : 'left';
    var eltn = elt.props.n;
    if (eltn > 0) {

      var eltPrev = elts[eltn - 1];
      var eltPrevMid = eltPrev.props.pos[plane] + eltPrev.props.size / 2 + eltPrev.props.margin / 2;
      
      if (elt.props.currentPos[plane] < eltPrevMid || flag) {

        elt.props.pos[plane] = eltPrev.props.pos[plane]; // swap position property
        eltPrev.props.pos[plane] += elt.props.size;
        elts[eltn] = eltPrev; // swap index in elts array
        elts[eltn - 1] = elt;
        // elts[elt.props.n].props.n = elt.props.n;
        // elt.props.n = elt.props.n - 1;
        eltPrev.props.n++; // swap n property
        elt.props.n--;

        this._eltsAnimate(eltPrev, -(elt.props.size), thisInst)
      }
    }
  },
  _eltsMoveBackOrUp: function(elt, elts, thisInst, flag) { // flag disregards elt position check.


    var plane = thisInst.options.isVertical ? 'top' : 'left';
    var eltn = elt.props.n;
    if (eltn < elts.length - 1) {

      var eltNext = elts[eltn + 1];
      var eltNextMid = eltNext.props.pos[plane] - elt.props.size + (eltNext.props.size + eltNext.props.margin) /2 + eltNext.props.margin;

      if (elt.props.currentPos[plane] > eltNextMid || flag) {
        eltNext.props.pos[plane] = elt.props.pos[plane]; // swap position property
        elt.props.pos[plane] += eltNext.props.size;
        elts[eltn] = eltNext; // swap index in elts array
        elts[eltn + 1] = elt;
        // elts[elt.props.n].props.n = elt.props.n;
        // elt.props.n = elt.props.n + 1;
        eltNext.props.n--; // swap n property
        elt.props.n++;

        this._eltsAnimate(eltNext, elt.props.size, thisInst)
      }
    }
  },
  _eltsAnimate: function(elem, eltDimension, thisInst) {

    thisInst.div.dispatchEvent(new CustomEvent('onReorder'));
    var isVertical = thisInst.options.isVertical;
    var plane = isVertical ? 'top' : 'left';

    //  elem.style[thisInst.transitionPrefix] = '0s';
    //  elem.style[plane] = elem.pos[plane] + 'px';
    //  elem.style[thisInst.transformPrefix] = isVertical ? 'translate3d(0px,' + eltDimension + 'px, 0px)' : 'translate3d(' + eltDimension + 'px, 0px, 0px)';
    
    // TODO: avoid setting the top/left(plane) in eltsAnimate causing paint - avoid tranzToZero func
    function setAnimate() {
      var stringCss = isVertical ? 'translate3d(0px,' + eltDimension + 'px, 0px)' : 'translate3d(' + eltDimension + 'px, 0px, 0px)';
      elem.style.cssText = thisInst.transitionPrefix + ":0s;" + plane + ":" + elem.props.pos[plane] + "px;" + thisInst.transformPrefix + ':' + stringCss;
    }

    // TODO :requestanimationFrame creates jank when vertical instance crossing - WHY!
    if (isVertical) {
      setAnimate()
    } else {
      //IE9
      if (!thisInst.transSupport) setAnimate()
      else requestAnimationFrame(setAnimate)  
    }
  
    _transToZero(elem, thisInst);
  },
}