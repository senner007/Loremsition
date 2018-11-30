
export {
  _animateBack,
  _transToZero,
  _scaleElems
};



function _transToZero(elt, thisInst, speed, reqFrame = true) {

  if (speed == undefined) { var speed = '250ms ease' }

  // IE 9
  if (!thisInst.transSupport) { 
  // Solution 1:
    window.getComputedStyle(elt)[thisInst.transformPrefix];
    elt.style[thisInst.transformPrefix] = thisInst.ifGpu; // translateZ doesn't work for ie9
    elt.style[thisInst.transitionPrefix] = speed; 
    return;
  }
  // TODO : Please fix bad coding!
  // double RAF in plce of reflow - Test
  if (!reqFrame) {
    requestAnimationFrame(() => {
      setInRAF();
    })
    // window.getComputedStyle(elt)[thisInst.transformPrefix];
    // elt.style[thisInst.transformPrefix] = thisInst.ifGpu; // translateZ doesn't work for ie9
    // elt.style[thisInst.transitionPrefix] = speed; 
    return;
  }
  setInRAF();
  // Solution 2:
  function setInRAF () {
    requestAnimationFrame(() => {
      elt.style[thisInst.transitionPrefix] = speed; 
      elt.style[thisInst.transformPrefix] = thisInst.ifGpu; // translateZ doesn't work for ie9
    })
  }
  
  
};

function _animateBack(elt, thisInst) {
  
  var isVertical = thisInst.options.isVertical;

  var eltMarginLeft = isVertical ? 0 : elt.props.margin; // get margin for horizontal
  var eltMarginTop = isVertical ? elt.props.margin : 0 ; // get margin for vertical 

  if (thisInst.crossFlag && thisInst.newInst) {
 
    if (isVertical) {
      var thisTop = thisInst.added.props.pos.top;
      var thisLeft = thisInst.newInst.distanceTo;
      var diff = Math.abs ( thisInst.props.divWidth - thisInst.newInst.props.divWidth);

    } else {
      var thisTop = thisInst.newInst.distanceTo;
      var thisLeft = thisInst.added.props.pos.left;

    }
  } else {

    var thisTop = elt.props.pos.top,
        thisLeft = elt.props.pos.left;

  }

  if (diff > 2) {

    elt.style.cssText = `width: ${thisInst.newInst.props.divWidth}px; 
                        ${thisInst.transitionPrefix}: width 200ms;`

    // elt.style.width = thisInst.newInst.props.divWidth + 'px'
    // elt.style[thisInst.transitionPrefix] = 'width 200ms';
  }

  elt.style.cssText = `top: ${thisTop}px; 
                      left: ${thisLeft}px;
                      ${thisInst.transformPrefix}: translate3d(${((elt.props.currentPos.left - thisLeft) - eltMarginLeft)}px, ${(elt.props.currentPos.top - thisTop - eltMarginTop )}px,0px)`; 

  // elt.style.top = thisTop  + 'px';
  // elt.style.left = thisLeft + 'px';
  // elt.style[thisInst.transformPrefix] = 'translate3d(' + ((elt.props.currentPos.left - thisLeft) - eltMarginLeft) + 'px,' + (elt.props.currentPos.top - thisTop - eltMarginTop ) + 'px,0px)';

};

function _scaleElems(elems, thisInst) {
  if (!thisInst.transSupport || !elems || elems.length === 0) return; // for IE - will not scale out and in

  scaleElems('off');

  window.getComputedStyle(elems[0])[thisInst.transformPrefix]; // force reflow

  scaleElems('on');;     

  function scaleElems(trigger) {
    for (let i = 0; i < elems.length; i++) {
      elems[i].style[thisInst.transitionPrefix] = trigger == 'on' ? '500ms' : '0ms';
      elems[i].style[thisInst.transformPrefix] = trigger == 'on' ? 'scale(1,1)' : 'scale(0,0)';
    }
  }
  return elems.length
};