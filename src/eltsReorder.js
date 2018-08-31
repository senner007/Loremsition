
import {
  _elemsToCutAppend,
  // setEvents
} from "./utils.js"
import {
  _animateBack,
  _scaleElems,
  _transToZero
} from "./animation.js"

var posObj = {}

function _onDrag(elt, thisInst) { // Drag

  var elts = thisInst.elts,
    o = thisInst.options,
    oldPos = posObj; //find the old position stored on the object

  posObj = {
    top: elt.props.currentPos.top,
    left: elt.props.currentPos.left
  }; //the elt current position

  var dir = o.isVertical ? 'left' : 'top';
   ////////////////////////////////////////////////////////////////////////
  // if (thisInst.emptySpace) {
  //   var ePos = thisInst.props.divOffset[dir] + posObj[dir];
  //   if (ePos < thisInst.emptySpace.max && ePos > thisInst.emptySpace.min) {
  //     console.log('EMPTY SPACE!')
  //     return;
  //   }
  // }
   ////////////////////////////////////////////////////////////////////////
  var measure = o.isVertical ? 'divWidth' : 'divHeight',
    thisInstMid = posObj[dir] + thisInst.props[measure] / 2, // the middle point of the dragging element
    home = thisInstMid > 0 && thisInstMid < thisInst.props[measure], // when the element is within its own instance(thisInst)
    inNewInst = thisInst.newInst && thisInstMid > thisInst.newInst.distanceTo && thisInstMid < thisInst.newInst.distanceTo + thisInst.newInst.props[measure];


  if (home && thisInst.crossFlag == true) { // go back to originating container

    onTrigger._deleteElt(thisInst);
    thisInst.crossFlag = false;
    onTrigger._homeEltsOpen(elt, elts, thisInst);

  } else if (inNewInst) { // still in new instance container

    var adjConElts = thisInst.newInst.elts;

  } else if (thisInst.adjInst1 && !home) { // if the element has moved to a new instance and no longer within home distance

    thisInst.crossFlag = true;

    for (let i = 0, adjLenght = thisInst.adjCon.length; i < adjLenght; i++) {
      let p = thisInst.adjCon[i];
      let dropLimit = thisInst[p].props.ulSize + elt.props.size < thisInst[p].props.dropLimit || thisInst[p].props.dropLimit == false;
      let locked = thisInst[p].props.locked
      if (thisInstMid < thisInst[p].distanceTo + thisInst[p].props[measure] && thisInstMid > thisInst[p].distanceTo && dropLimit && !locked) { // found new instance
        onTrigger._deleteElt(thisInst); // delete element from prvious instance(thisInst.newInst) and animate
        thisInst.newInst = thisInst[p];
        var adjConElts = thisInst.newInst.elts;
        onTrigger._addElt(elt, adjConElts, o, thisInst);
        onTrigger._homeEltsClose(elt, elts, thisInst);

        break;
      }

    }

    if (adjConElts == undefined) { // in empty space
      //  console.log('in empty space')
      onTrigger._homeEltsClose(elt, elts, thisInst);
      onTrigger._deleteElt(thisInst);

      return;
    }

  }


  /*-------------------------------------------------------------------------------------------------------------*/
  if (thisInst.crossFlag == true) {
    elts = adjConElts;
    thisInst.added.props.currentPos = elt.props.currentPos;
    elt = thisInst.added;
  }

  if (!o.isVertical && posObj.left != oldPos.left) { // move horizontally

    posObj.left > oldPos.left ? eltsReorder._eltsMoveBackOrUp(elt, elts, thisInst) : eltsReorder._eltsMoveForwardOrDown(elt, elts, thisInst);

  } else if (o.isVertical && posObj.top != oldPos.top) { // move vertically
    posObj.top > oldPos.top ? eltsReorder._eltsMoveBackOrUp(elt, elts, thisInst) : eltsReorder._eltsMoveForwardOrDown(elt, elts, thisInst);

  } else { // doing nothing
    return;
  }


};
/*----------------------------------------------------------------------------------------------------------------*/


var onTrigger = { //These will trigger when the elt is crossing over to connected adjacent container/instance

  _addElt: function(elt, adjConElts, o, thisInst) {
    var plane = o.isVertical ? 'top' : 'left',
      adjEltsLength = adjConElts.length,
      insertPos = adjEltsLength;

    for (let i = 0; i < adjEltsLength; i++) { //Loop the array
      if (elt.props.currentPos[plane] < adjConElts[i].props.pos[plane] + adjConElts[i].props.size / 2) {
        insertPos = i;
        break;
      };
    };
    // initially set insertPos to the length of elts (dropped after last item);
    // reorder the elements in the originating container

    ///////////////////////////////////////////////////////////
    // optionally set elt to animate to the new width
    // elt.style[thisInst.transitionPrefix] = 'width 100ms';
    // elt.style.width = thisInst.newInst.props.divWidth + 'px'
      ///////////////////////////////////////////////////////////

    var diff = Math.abs ( thisInst.props.divWidth - thisInst.newInst.props.divWidth)

    // if new div width is not same - set to undefined if in vertical
    
    var width =  elt.props.completeWidth
    var height =  diff < 2  ? elt.props.completeHeight: o.isVertical ? undefined : elt.props.completeHeight;
  
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

var eltsReorder = {
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

        this.eltsAnimate(eltPrev, -(elt.props.size), thisInst)
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

        this.eltsAnimate(eltNext, elt.props.size, thisInst)
      }
    }
  },
  eltsAnimate: function(elem, eltDimension, thisInst) {

    thisInst.div.dispatchEvent(new CustomEvent('onReorder'));
    var o = thisInst.options;
    var plane = o.isVertical ? 'top' : 'left';

    //  elem.style[thisInst.transitionPrefix] = '0s';
    //  elem.style[plane] = elem.pos[plane] + 'px';
    //  elem.style[thisInst.transformPrefix] = o.isVertical ? 'translate3d(0px,' + eltDimension + 'px, 0px)' : 'translate3d(' + eltDimension + 'px, 0px, 0px)';


    // this replaces the above for performance
    var stringCss = o.isVertical ? 'translate3d(0px,' + eltDimension + 'px, 0px)' : 'translate3d(' + eltDimension + 'px, 0px, 0px)';
    elem.style.cssText = thisInst.transitionPrefix + ":0s;" + plane + ":" + elem.props.pos[plane] + "px;" + thisInst.transformPrefix + ':' + stringCss;

    _transToZero(elem, thisInst);
  },
}

function _onStop(elt, thisInst) { // Stop
  
  
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
      appendRemove.call(thisInst)
      thisInst.div.dispatchEvent(new CustomEvent('onDropFrom'));
      thisInst.newInst.div.dispatchEvent(new CustomEvent('onDropTo'));
      thisInst.newInst.props.tempLock = false;
      delete thisInst.newInst
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

export {
  _onDrag,
  eltsReorder,
  _onStop
};