import {
  // _shuffle,
  // setEvents,
  defaults,
  transSupport,
  transitionPrefix,
  transformPrefix,
  ifGpu,
  _elemsToCutAppend
} from "./utils.js"

import {
  _addEventHandlers
} from "./handlers.js"

import {
  _scaleElems
} from "./animation.js"

import {
    eltsReorder
} from "./eltsReorder.js";

import './polyfills';

import { _addToObject, _getMargin, _outerHeight, _outerWidth, _setInstances, _setEltsProps, _mergeObject} from './objSet';

export default Loremsition;

function jsOffset(el) { // replaces jquery offset
  var temp = el.getBoundingClientRect();
  return {
    top: temp.top + document.body.scrollTop,
    left: temp.left + document.body.scrollLeft
  }
}

function _setUlSize(size, thisInst) {
  var style = thisInst.ul.style;
  if (thisInst.options.isVertical) { style.height = size + 'px';} 
  else {  style.width = size + 'px'; }

  thisInst.props.ulSize = size;
}

var temporaryInstanceArray = [];

function Loremsition(element, options) { // Constructor function
  // window.temporaryInstanceArray =  window.temporaryInstanceArray || [];
    // create the temporaryInstanceArray in the global scope
  this.props = {}; // The values that are to remain a reference as a shallow copy and update accordingly in adjInst must reside in a nested oobject.
                  // it is a sideeffect of Object.assign :
                  //  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
  this.div = element;
  this.id = this.div.id;
  this.props.divOffset = jsOffset(element);
  this.props.divWidth = _outerWidth(this.div);
  this.props.divHeight = _outerHeight(this.div);
  this.ul = this.div.querySelector('ul');

  this.props.locked = false;
  // this.container = window.temporaryInstanceArray.length;
  this.adjCon = [];
  // this.options = $.extend({}, defaults, options);
  // this.options = Object.assign({}, defaults, options);
  this.options = _mergeObject({}, defaults, options); // Object.assign alternative
  this.props.cutOff = this.options.cutOff;
  delete this.options.cutOff;
  this.props.dropLimit = this.options.dropLimit;
  delete this.options.dropLimit;
  this.ul.style[transformPrefix] = 'translate3d(0px,0px,0px)';
  this.props.ulSize = 0;
  this.transitionPrefix = transitionPrefix;
  this.transformPrefix = transformPrefix;
  this.ifGpu = ifGpu;
  this.transSupport = transSupport;
  this.crossFlag = false;
  temporaryInstanceArray.push(this);
};


Loremsition.prototype.setCutOff = function (cutOff){
    this.props.cutOff = cutOff
};

Loremsition.prototype.setDropLimit = function (dropLimit){
  this.props.dropLimit = dropLimit
};

Loremsition.prototype.getInstances = function() {
  // get object containing all instances, but without the proto
}

Loremsition.prototype.lock = function() {
  // Nothing can be dragged to or from this instance
  this.props.locked = true;
}

Loremsition.prototype.unlock = function() {
  this.props.locked = false;
}

Loremsition.prototype.crossDistance = function(thisInst, adjInst) {
  adjInst.props.divOffset = jsOffset(adjInst.div) // if reLayout is called on all instances, this will be called multiple times on the same containers unnecessary
  return this.options.isVertical ? (adjInst.props.divOffset.left - this.props.divOffset.left) : (adjInst.props.divOffset.top - this.props.divOffset.top);
}

Loremsition.prototype.getUlSize = function() {
  return this.props.ulSize;
}

// Loremsition.prototype.shuffle = _shuffle;

  /*--------------------------------------------------------------------------------------------------------------------------------------------------*/

Loremsition.prototype.init = function() {

  var lis = this.div.getElementsByTagName('li');
  this.elts = new Array(lis.length);
  var ulSize = _setEltsProps(lis, this); // setting properties function return the ul size
  _setUlSize(ulSize, this)

  _addEventHandlers(this);

  this.isInit = true;

  this.div.dispatchEvent(new CustomEvent('onLayout')) // onLayout event

  function countInit() {
    return temporaryInstanceArray.reduce((acc,b) => { // loop over the array and get all instances that have been initialized
      return acc + (b.isInit ? 1 : 0)
    },0) 
  }

  if (countInit() == temporaryInstanceArray.length) {           // if all instances have been initialized
      temporaryInstanceArray.forEach(v => {
        _setInstances(v, temporaryInstanceArray);
        v.div.dispatchEvent(new CustomEvent('onLayoutAll'));
      })
  }
};


Loremsition.prototype.reCalculate = function() {
  var _this = this;
  _setUlSize(_setEltsProps(this.elts, this), this) //setting properties function returns the ul size
};

Loremsition.prototype.reLayout = function() {

  var _this = this;
  this.reCalculate();

  this.props.divWidth = _outerWidth(this.div)
  this.props.divOffset = jsOffset(this.div)

  this.adjCon.forEach(v => {
    _this[v].distanceTo = _this.crossDistance(_this, _this[v])
  })

};

// TODO : Refactor 
Loremsition.prototype.cutOffEnd = function() { // function to remove the items above cutoff limit and then prepend the adjacent container 
  _scaleElems( _elemsToCutAppend(this, this ), this); //_elemsToCut function returns the elts to scale
};

function _curryLi(thisInst, liText, setPos, opacity = 1) {

  var isVertical = thisInst.options.isVertical;
  var thisElts = thisInst.elts;
  var liPosition = Math.min(Math.max(parseInt(setPos), 0), thisElts.length); // this is to make sure that the insert position is not greater than the number of elts present.
  var n = thisElts.length,
      o = thisInst.options;

  var eltObj = {
    'left': liPosition > 0 ? thisElts[liPosition - 1].props.pos.left + thisElts[liPosition - 1].props.completeWidth : 0,
    'top': liPosition > 0 ? thisElts[liPosition - 1].props.pos.top + thisElts[liPosition - 1].props.completeHeight : 0
  }


  var item = ('<li style="opacity:' + opacity + ';left:' + eltObj.left + 'px;top:' + eltObj.top + 'px" class=' + (isVertical ? 'listItem' : 'listItem-horizontal') + '>' + liText + '</li>');
  var elt = document.createElement('li');
  elt.innerHTML = item;
  elt = elt.firstChild;

  return function (completeWidth, completeHeight, setUl, insert) {

    
    if (insert) {
      thisInst.ul.insertBefore(elt, thisElts[liPosition]);
    }

    var width = completeWidth(elt);
    var height = completeHeight(elt)
    var margin = _getMargin(elt, isVertical)

    if (setUl) {
      _setUlSize(isVertical ? thisInst.props.ulSize + height : thisInst.props.ulSize + width, thisInst)
    }


    _addToObject(elt, n, height, width, margin, thisInst, eltObj);
    //reorder the elts below its insert position(last) and update the elt properties(elt.n & elt.pos)
    //if the elt is added when crossing to adjacent instance, the elt will be referred to by the name of thisInst.added

    for (var i = liPosition ; i < thisElts.length -1; i++) {
      
      eltsReorder._eltsMoveForwardOrDown(elt, thisElts, thisInst);
    };

    return elt;
  }
}


Loremsition.prototype._addLiToObject = function (liText, setPos = this.elts.length, width, height) {

  var isVertical = this.options.isVertical;
  var createLi = _curryLi(this, liText, setPos, 0);

  return createLi(v => isVertical ? 0 : (width || 200), v => isVertical ? (height || 200)  : 0)    //random guessed number

}

  // es6 defaults:
  // liPosition : defaults to last position
  // addTrans: deafults to animate li and surrounding elems
  // setHeight: defaults to automatically retrieved height/width


Loremsition.prototype.addLiElem = function(liText, setPos = this.elts.length, addTrans = {elt:true,elts:true}) {

  var isVertical = this.options.isVertical;
  var createLi = _curryLi(this, liText, setPos);
  var elt = createLi(v => isVertical ? 0 : _outerWidth(v), v => isVertical ? _outerHeight(v): 0, true, true)  
  
  if (addTrans.elt) {
    _scaleElems([elt], this)

  }; // animation only needed when triggering add
  
  return elt;
}

Loremsition.prototype.removeLiElem = function(elt, transition, callBack, setUl = true) { // Remove new li to previous collection
  if (elt == undefined) {return;} // if the requested elt to delete doesn't exist
  if (!isNaN(elt)) { elt = this.elts[Math.min(Math.max(parseInt(elt), 0), this.elts.length -1)];} // elt input is a number 
  var n = elt.props.n,
    thisElts = this.elts,
    eltHeight = thisElts[n].props.completeHeight,
    eltWidth = thisElts[n].props.completeWidth;

  for (var i = n; i < thisElts.length; i++) {  // Loop over adjacent conatiner elements, animating them and updating their properties
    eltsReorder._eltsMoveBackOrUp(elt, thisElts,  this, true);
    // third argument is a flag to override pos check in eltsMoveDown/eltsMoveForward function
  };

  thisElts.length = thisElts.length - 1; // reduce the length of elt objects in the temporaryInstanceArray after a delete

  if (transition) { // if the option to animate in the removeLiElem method used after init is true. Used in cutOff method

    elt.addEventListener('transitionend', _animateCallback);
    if (!this.transSupport) _animateCallback();
    elt.style[this.transformPrefix] = 'scale(0.5,0.5)';
    elt.style.opacity = '0';
    elt.style[this.transitionPrefix] = '250ms';

    function _animateCallback() {    
      elt.removeEventListener('transitionend', _animateCallback);  
        elt.remove()
        if (callBack) {
          callBack(); //the callback is fired after the animation has finished
          // use transitionend instead
        }
    }
  } else {
    
    elt.remove();
  }
  // recalculate the height or width of the ul after deleting items
  if (setUl) {
    var ulSize = this.options.isVertical ? this.props.ulSize - eltHeight : this.props.ulSize - eltWidth;
    _setUlSize(ulSize, this)
  }

};
