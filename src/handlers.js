import {
  _onDrag,
  _onStop
} from "./eltsReorder.js"
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


  var targetOffsetY,
    targetOffsetX,
    newDx,
    newDy,
    thisInst = thisInst,
    transformPrefix = thisInst.transformPrefix,
    transitionPrefix = thisInst.transitionPrefix,
    ul = thisInst.ul,
    elt,
    eStart = isTouch ? 'touchstart' : isPointer ? 'pointerdown' : 'mousedown',
    eMove = isTouch ? 'touchmove' : isPointer ? 'pointermove' : 'mousemove',
    eEnd = isTouch ? 'touchend' : isPointer ? 'pointerup' : 'mouseup',
    dontTouch = false,
    startX,
    startY,
    hasMoved;

  ul.addEventListener(eStart, pointerstart)

  function pointerstart(e) {

    if (e.target.localName == 'ul' || thisInst.props.locked == true || thisInst.props.tempLock == true || e.target.locked == true || e.target.localName == 'button') return;
    elt = e.target
    if (e.target.localName == 'span' || e.target.localName == 'div') {
      elt = e.target.offsetParent;
    }


    e.preventDefault();
    dontTouch = true;

    elt.nStart = elt.n
    elt.style[transitionPrefix] = '0s';



    if (document.documentMode || /Edge/.test(navigator.userAgent)) { // if IE || Edge

      thisInst.adjCon.forEach(function (v) {
        thisInst[v].div.style.zIndex = -2;
      })

    }
    elt.style.zIndex = 5; // TODO : find alternative
    thisInst.div.style.zIndex = 99;

    elt.startDate = new Date();

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
    hasMoved = true; // hasMoved is a flag to clicking items without moving them

    newDx = e.pageX - startX;
    newDy = e.pageY - startY;


    elt.style[transformPrefix] = 'translate3d(' + newDx + 'px, ' + newDy + 'px, 0px) translateZ(0)';


    elt.props.currentPos.top = targetOffsetY + newDy;
    elt.props.currentPos.left = targetOffsetX + newDx;

    _onDrag(elt, thisInst);

  };

  function pointerupFunction(e) {
    e.preventDefault();
    ul.addEventListener(eStart, pointerstart);

    if (hasMoved == true) {

      if (document.documentMode || /Edge/.test(navigator.userAgent)) { // if IE || Edge
        console.log("ie!")
        elt.style.zIndex = 0; // TODO : FIX duplication

        thisInst.adjCon.forEach(function (v) {
          thisInst[v].div.style.zIndex = 1;
        })

      } else {
        elt.style.zIndex = 0; // TODO : FIX duplication
        thisInst.div.style.zIndex = 1;
      }


      hasMoved = false;
      clearClass();
      elt.style[transformPrefix] = 'translateZ(0) translate3d(' + 0 + 'px, ' + 0 + 'px, 0px)';

      if (!elt) {
        return;
      }
      _onStop(elt, thisInst);
    } else { // if it hasn't moved
      clearClass();
    }

    function clearClass() {
      dontTouch = false;
    };
    window.removeEventListener(eMove, pointermoveFunction);
    window.removeEventListener(eEnd, pointerupFunction);

  }

};