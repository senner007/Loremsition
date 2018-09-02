import {
    _animateBack,
    _scaleElems,
    _transToZero
  } from "./animation.js";

  import {
    _elemsToCutAppend,
  } from "./utils.js"


export function onStop(elt, thisInst) { // Stop
  
  
    elt.endDate = new Date();
    elt.dragSpeed = (elt.endDate.getTime() - elt.startDate.getTime()) / 1000;
    // elt.dragSpeed measuresthe time it takes to initialize the drag to when it is dropped. A smaller difference
    // will increase the speed of the layout animation.
    var speed;
  
    if (elt.dragSpeed < 0.2) {
      speed = '15ms ease'
    } else if (elt.dragSpeed < 0.35) {
      speed = '100ms ease'
    } else if (elt.dragSpeed < 0.5) {
      speed = '170ms ease'
    }
  
    // A lower elt.dragSpeed value will speed up the animation and subsequently the add and remove logic after dropping an item.
    // (If the difference in time between the initialized drag and the release is less than specified,
    // it will increase the transition speed of the dropped item going to its new position)
  
  
    if (thisInst.crossFlag == true && thisInst.newInst) { // going to new container
     
      elt.locked = true;
  
      thisInst.newInst.props.tempLock = true;
  
      thisInst.newInst.ul.insertBefore(thisInst.added, thisInst.newInst.elts[thisInst.added.props.n + 1]);
      thisInst.reCalculate.call(thisInst.newInst);
      // The element (thisInst.added) is place on triggerOn,
      // but is not moved if the user subsequently reorders(by dragging) the elements.
      // Therefore it must be inserted/repositioned again
  
      elt.addEventListener('transitionend', _callback);
  
      if (!thisInst.transSupport) _callback();
  
      function _callback() {
        this.removeEventListener('transitionend', _callback);
        thisInst.added.style.opacity = 1
        thisInst.options.isVertical ? thisInst.added.style.top = thisInst.added.props.pos.top + 'px' : thisInst.added.style.left = thisInst.added.props.pos.left + 'px';
        appendRemove();
        thisInst.div.dispatchEvent(new CustomEvent('onDropFrom'));
        thisInst.newInst.div.dispatchEvent(new CustomEvent('onDropTo'));
        thisInst.newInst.props.tempLock = false;
        delete thisInst.newInst;
        setZIndex();
        
      }
  
  
    } else { // staying in originating container
  
  
      if (elt.nStart != elt.props.n) { //(elt.nStart != elt.n) only run the code in the if statement if elt is in new position
        // insert the dragged element into its new position efter drop in originating container
        // on condition that it has changed its position
  
        thisInst.ul.insertBefore(elt, thisInst.elts[elt.props.n + 1]);
  
        elt.addEventListener('transitionend', _callback);
  
        if (!thisInst.transSupport) _callback();
  
        function _callback() {
          console.log('afterDrop - no cut');
          thisInst.div.dispatchEvent(new CustomEvent('onDropTo'));
          thisInst.div.dispatchEvent(new CustomEvent('onDropFrom'));
          this.removeEventListener('transitionend', _callback);
          setZIndex();
        }
  
      }
    }
  
    _animateBack(elt, thisInst);
    _transToZero(elt, thisInst, speed, false);
  
    thisInst.crossFlag = false;
  
    function setZIndex () {
      if (document.documentMode || /Edge/.test(navigator.userAgent)) { // if IE || Edge 
     
        thisInst.adjCon.forEach(function (v) {
          thisInst[v].div.style.zIndex = 1;
        })
  
      } 
        elt.style.zIndex = 0; // TODO : FIX duplication
        thisInst.div.style.zIndex = 1;
    }
  
    function appendRemove() {
      delete thisInst.added // the object that is a reference to the added object is deleted
      thisInst.removeLiElem(elt, false, true); // the dragged elt from the previous/starting instance is deleted once animated to its position  
  
      _scaleElems(_elemsToCutAppend(thisInst, thisInst.newInst), thisInst);
    };
  
  };