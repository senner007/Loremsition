
  
  import {
    _shuffle,
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
    _animateBack,
    _transToZero,
    _scaleElems
  } from "./animation.js"

  import {
      eltsReorder
  } from "./eltsReorder.js"


  export default Loremsition;

  function Elt (n, thisHeight, thisWidth, margin, thisInst, eltObj) {
    var isVertical = thisInst.options.isVertical == true;

    this.o = thisInst.options; // its current position (as per the other elements)
    this.completeWidth = thisWidth || 0; // its width (with the margin)
    this.completeHeight = thisHeight || 0; // its height (with the margin)
    this.size;
    this.margin = margin;
    this.pos = isVertical ? { top: eltObj.top, left: 0 } : {  top: 0, left: eltObj.left }; // its position (left and top position)
    this.initN = n; // its initial position (as per the other elements)
    this.n = n; // its current position (as per the other elements)
    this.currentPos = {top:0, left:0};
//    console.log(thisWidth)

  }

function setEltProto (param) {
  Object.defineProperty(Elt.prototype, param, {
  	get: function() { return this.size },
  	set: function(value) { this.size = value }
  })
}


  function _addToObject(elt, n, thisHeight, thisWidth, margin, thisInst, eltObj) {
    var thisElts = thisInst.elts
    var isVertical = thisInst.options.isVertical == true;
    thisElts[n] = elt;
    // thisElts[n].completeWidth = thisWidth || 0; // its width (with the margin)
    // thisElts[n].completeHeight = thisHeight || 0; // its height (with the margin)
  //  thisElts[n].size = thisInst.options.isVertical == true ? thisHeight : thisWidth
  //  thisElts[n].pos = isVertical ? { top: eltObj.top, left: 0 } : {  top: 0, left: eltObj.left }; // its position (left and top position)
//    thisElts[n].initN = n; // its initial position (as per the other elements)
  //  thisElts[n].n = n; // its current position (as per the other elements)
  //  thisElts[n].o = thisInst.options; // its current position (as per the other elements)
  //  thisElts[n].hasCrossed = false; // has the elt crossed over to the other container
  //  thisElts[n].newPosSameCon = false; // has the element changed position but remained in the same container //  remove!
    // thisElts[n].belongsTo = thisInst.container;
    //thisElts[n].movesTo = thisInst.adjCon;
    //thisElts[n].currentPos = {top:0, left:0};


      var param = isVertical ? "completeHeight" : "completeWidth";
      if (!(param in Elt.prototype)) {setEltProto(param);}


    thisElts[n].props = new Elt(n, thisHeight, thisWidth, margin, thisInst, eltObj)


  };

  function jsOffset(el) { // replaces jquery offset

    var temp = el.getBoundingClientRect();

    return {
      top: temp.top + document.body.scrollTop,
      left: temp.left + document.body.scrollLeft
    }
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
    this.options = mergeObject({}, defaults, options); // Object.assign alternative
    this.props.cutOff = this.options.cutOff;
    this.props.dropLimit = this.options.dropLimit;
    this.ul.style[transformPrefix] = 'translate3d(0px,0px,0px)';
    this.props.ulSize = 0;
    this.transitionPrefix = transitionPrefix;
    this.transformPrefix = transformPrefix;
    this.ifGpu = ifGpu;
    this.transSupport = transSupport;
    this.crossFlag = false;
    temporaryInstanceArray.push(this);
  };

  function mergeObject(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}

(function () { // custom event polyfill

  if ( typeof window.CustomEvent === "function" ) return false;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

// from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('remove')) {
      return;
    }
    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove() {
        if (this.parentNode !== null)
          this.parentNode.removeChild(this);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);




  Loremsition.prototype.setCutOff = function (cutOff){

      this.props.cutOff = cutOff
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


  Loremsition.prototype.setInstances = function() {

    var adjInstances = this.options.adjIds;                     //Refactor - too many loops

    for (var i= 0;i<temporaryInstanceArray.length; i++) {

        for (var n = 0; n<adjInstances.length; n++) {

           if (temporaryInstanceArray[i].id == adjInstances[n]) {

                var copy = mergeObject({}, temporaryInstanceArray[i]);
                copy.adjCon.forEach(v =>  delete copy[v])
               
                delete copy.adjCon;
                this['adjInst' + (n +1)] = copy;
                this.adjCon.push('adjInst' + (n +1))

                copy.distanceTo = this.crossDistance(this, temporaryInstanceArray[i])
           }
        }

    }


  }



  Loremsition.prototype.getUlSize = function() {
    return this.props.ulSize;
  }

  Loremsition.prototype.shuffle = _shuffle;

  /*--------------------------------------------------------------------------------------------------------------------------------------------------*/

  function _setEltsProps(elts, thisInst) {

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

      //elt.style[thisInst.transformPrefix] = 'translate3d(0px, 0px, 0px)'; // must be off for scale to work
    };
    return size; // return the size of the ul
  };
    /*--------------------------------------------------------------------------------------------------------------------------------------------------*/

  function _setUlSize(size, thisInst) {
    var style = thisInst.ul.style;
    if (thisInst.options.isVertical) {
      style.height = size + 'px';
    } else {
      style.width = size + 'px';
    //  thisInst.ul.style.height = _outerHeight(thisInst.elts[0]) + 'px';
    }
    thisInst.props.ulSize = size;
  }
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
          v.setInstances();
          v.div.dispatchEvent(new CustomEvent('onLayoutAll'));
        })
    }
  };

  /*--------------------------------------------------------------------*/

  function _getMargin(el, isVertical) { // replacing jquery outerWidth(true)
    var style = getComputedStyle(el);
    var margin = isVertical ? parseInt(style.marginTop) + parseInt(style.marginBottom) : parseInt(style.marginLeft) + parseInt(style.marginRight);
    return margin;
  }

  function _outerHeight(el) { // replacing jquery outerWidth(true)

    var height = el.offsetHeight;
    var style = getComputedStyle(el);
    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    return height;
  }

  function _outerWidth(el) { // replacing jquery outerWidth(true)

    var width = el.offsetWidth;
    var style = getComputedStyle(el);
    width += parseInt(style.marginLeft) + parseInt(style.marginRight);
    return width;
  }
  /*--------------------------------------------------------------------*/

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
  /*------------------------------------------------------------------------------------------------------------------------------------*/


  Loremsition.prototype.cutOffEnd = function() { // function to remove the items above cutoff limit and then prepend the adjacent container
  

    // console.log(this[this.adjCon[0]])
    _scaleElems( _elemsToCutAppend(this, this ), this); //_elemsToCut function returns the elts to scale

  };


  /*--------------------------------------------------------------------------------------------------------------------------------------------------*/

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


  Loremsition.prototype._addLiToObject = function (liText, setPos = this.elts.length) {

    var isVertical = this.options.isVertical;

    var createLi = _curryLi(this, liText, setPos, 0);

    return createLi(v => isVertical ? 0 : 200, v => isVertical ? 200 : 0)    //random guessed number

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

  /*------------------------------------------------------------------------------------------------------------------------*/


  Loremsition.prototype.removeLiElem = function(elt, transition, callBack) { // Remove new li to previous collection

    if (elt == undefined) {return;} // if the requested elt to delete doesn't exist
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


      elt.style[this.transformPrefix] = 'scale(0.5,0.5)';
      elt.style.opacity = '0';
      elt.style[this.transitionPrefix] = '250ms';
      setTimeout(function() {
        elt.remove()
        if (callBack) {
          callBack(); //the callback is fired after the animation has finished
          // use transitionend instead
        }
      }, 250);
    } else {

      elt.remove();

    }
    // recalculate the height or width of the ul after deleting items

    var ulSize = this.options.isVertical ? this.props.ulSize - eltHeight : this.props.ulSize - eltWidth;
    _setUlSize(ulSize, this)
  };
