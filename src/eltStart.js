import {
  eltsReorder,
  onTrigger
} from './eltsReorder';

var posObj = {} // global to keep track of previous position

export function onDrag(elt, thisInst) { // Drag

  var elts = thisInst.elts,
    isVertical = thisInst.options.isVertical,
    oldPos = posObj; //find the old position stored on the posObj object

  posObj = {
    top: elt.props.currentPos.top,
    left: elt.props.currentPos.left
  }; //the elt current position

  var dir = isVertical ? 'left' : 'top',
      measure = isVertical ? 'divWidth' : 'divHeight';

  var thisInstMid = posObj[dir] + thisInst.props[measure] / 2, // the middle point of the dragging element
      home = thisInstMid > 0 && thisInstMid < thisInst.props[measure], // when the element is within its own instance(thisInst)
      inNewInst = thisInst.newInst && thisInstMid > thisInst.newInst.distanceTo && thisInstMid < thisInst.newInst.distanceTo + thisInst.newInst.props[measure],
      adjConElts;

  if (home && thisInst.crossFlag == true) { // go back to originating container

    onTrigger._deleteElt(thisInst);
    thisInst.crossFlag = false;
    onTrigger._homeEltsOpen(elt, elts, thisInst);

  } else if (inNewInst) { // still in new instance container

    adjConElts = thisInst.newInst.elts;

  } else if (thisInst.adjInst1 && !home) { // if the element has moved to a new instance and no longer within home distance

    thisInst.crossFlag = true;

    for (let i = 0, adjLenght = thisInst.adjCon.length; i < adjLenght; i++) {
      let p = thisInst.adjCon[i];
      let dropLimit = thisInst[p].props.ulSize + elt.props.size < thisInst[p].props.dropLimit || thisInst[p].props.dropLimit == false;
      let locked = thisInst[p].props.locked;
      if (thisInstMid < thisInst[p].distanceTo + thisInst[p].props[measure] && thisInstMid > thisInst[p].distanceTo && dropLimit && !locked) { // found new instance
        onTrigger._deleteElt(thisInst); // delete element from prvious instance(thisInst.newInst) and animate
        thisInst.newInst = thisInst[p];
        adjConElts = thisInst.newInst.elts;
        onTrigger._addElt(elt, adjConElts, thisInst);
        onTrigger._homeEltsClose(elt, elts, thisInst);

        break;
      }
    }

    if (!adjConElts) { // in empty space
      onTrigger._homeEltsClose(elt, elts, thisInst);
      onTrigger._deleteElt(thisInst);

      return;
    }

  }

  if (thisInst.crossFlag == true) {
    elts = adjConElts;
    thisInst.added.props.currentPos = elt.props.currentPos;
    elt = thisInst.added;
  }

  if (!isVertical && posObj.left != oldPos.left) { // move horizontally
    posObj.left > oldPos.left ? eltsReorder._eltsMoveBackOrUp(elt, elts, thisInst) : eltsReorder._eltsMoveForwardOrDown(elt, elts, thisInst);

  } else if (isVertical && posObj.top != oldPos.top) { // move vertically
    posObj.top > oldPos.top ? eltsReorder._eltsMoveBackOrUp(elt, elts, thisInst) : eltsReorder._eltsMoveForwardOrDown(elt, elts, thisInst);
  }

};