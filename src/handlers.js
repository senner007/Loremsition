import {
  onDrag
} from "./eltStart.js"

import {
  onStop
} from "./eltStop.js"

export {
  _addEventHandlers
}

function _addEventHandlers(thisInst) {

  var isTouch = (function is_touch_device() {
    return (('ontouchstart' in window) ||
      (navigator.MaxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0));
  })();

  var isPointer = (window.PointerEvent);

  var eStart = isTouch ? 'touchstart' : isPointer ? 'pointerdown' : 'mousedown',
      eMove = isTouch ? 'touchmove' : isPointer ? 'pointermove' : 'mousemove',
      eEnd = isTouch ? 'touchend' : isPointer ? 'pointerup' : 'mouseup';

  var ul = thisInst.ul,
      elt,
      dontTouch = false,
      hasMoved;    

  var targetOffsetY,
      targetOffsetX,
      newDx,
      newDy,
      startX,
      startY,
      ieStartX,
      ieStartY;

  document.onselectstart = function() { return false; } // prevent text selection in ie9

  ul.addEventListener(eStart, pointerstart)

  function pointerstart(e) {

    // TODO : should handle any scenario. Make sure only Loremsition lis are selected

    if (e.target.localName == 'ul' || thisInst.props.locked == true || thisInst.props.tempLock == true  || e.target.localName == 'button') return;
    
    elt = e.target

    // TODO : should handle any scenario and not just span/div

    if (e.target.localName == 'span' || e.target.localName == 'div') {
      elt = e.target.offsetParent;
    }

    if (elt.locked) return;

    e.preventDefault();
    dontTouch = true;

    elt.nStart = elt.n
    elt.style[thisInst.transitionPrefix] = '0s';

    if (document.documentMode || /Edge/.test(navigator.userAgent)) { // if IE || Edge

      thisInst.adjCon.forEach(function (v) {
        thisInst[v].div.style.zIndex = -2;
      })

    }
    elt.style.zIndex = 5; // TODO : find alternative
    thisInst.div.style.zIndex = 99;

    elt.startDate = new Date();

    if(!thisInst.transSupport) {
      if (!parseInt(elt.style.left)) elt.style.left = '0px';
      if (!parseInt(elt.style.top)) elt.style.top = '0px';
      ieStartX = e.pageX - parseInt(elt.style.left);
      ieStartY = e.pageY - parseInt(elt.style.top);
    }

    startX = e.pageX, startY = e.pageY;
    targetOffsetY = elt.props.pos.top + (thisInst.options.isVertical ? elt.props.margin : 0);
    targetOffsetX = elt.props.pos.left + (thisInst.options.isVertical ? 0 : elt.props.margin);

    ul.removeEventListener(eStart, pointerstart);
    window.addEventListener(eEnd, pointerupFunction); // refactor to add the once: true object to similar to jquery once. Wait for browser compatibility
    window.addEventListener(eMove, pointermoveFunction);

  };


  function pointermoveFunction(e) {

    if (e.type == 'touchmove' && e.touches.length > e.targetTouches.length || !dontTouch) {
      return
    }

    e.preventDefault();
    hasMoved = true; // hasMoved is a flag for clicking items without moving them

    newDx = e.pageX - startX;
    newDy = e.pageY - startY;

    if( !thisInst.transSupport) {
      elt.style.top = e.pageY - ieStartY  + 'px';
      elt.style.left = e.pageX  - ieStartX + 'px';
    }
    else {
       elt.style[thisInst.transformPrefix] = 'translate3d(' + newDx + 'px, ' + newDy + 'px, 0px) translateZ(0)';
    }
   
    elt.props.currentPos.top = targetOffsetY + newDy;
    elt.props.currentPos.left = targetOffsetX + newDx;

    onDrag(elt, thisInst);

  };

  function pointerupFunction(e) {
    e.preventDefault();
    ul.addEventListener(eStart, pointerstart);

    if (hasMoved == true) {
      hasMoved = false;
      if (!elt) return;
      elt.style[thisInst.transformPrefix] = 'translateZ(0) translate3d(0px, 0px, 0px)';
      onStop(elt, thisInst);
    }

    dontTouch = false;
    window.removeEventListener(eMove, pointermoveFunction);
    window.removeEventListener(eEnd, pointerupFunction);

  }

};