// var setEvents = {
//   onLayoutAll: new Event('onLayoutAll'),
//   onLayout : new Event('onLayout'),
//   onReorder: new Event('onReorder'),
//   onDropTo: new Event('onDropTo'),
//   onDropFrom: new Event('onDropFrom'),
//  afterDrop: new Event('afterDrop')
// };

var transSupport = (function() {
  var b = document.body || document.documentElement,
    s = b.style,
    p = 'transition';
  if (typeof s[p] == 'string') {
    return true;
  }
  // Tests for vendor specific prop
  var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
  p = p.charAt(0).toUpperCase() + p.substr(1);
  for (var i = 0; i < v.length; i++) {
    if (typeof s[v[i] + p] == 'string') {
      return true;
    }
  }
  return false;
})();

var ifGpu = transSupport ? 'translate3d(0px,0px,0px) translateZ(0)' : 'translate(0px,0px)';
var testElement = document.createElement('div');
var transitionPrefix = "webkitTransition" in testElement.style ? "-webkit-transition" : "transition";
var transformPrefix = "webkitTransform" in testElement.style ? "-webkit-transform" : "-ms-transform" in testElement.style && transSupport == false ? "-ms-transform" : "transform"; //if ie9

function _findNext(thisInst, adjInst) {   // find instance by offset which is after the instance with elements to cut
  var plane = thisInst.options.isVertical ? 'left' : 'top';
  var next;
  for (let i = 0; i< thisInst.adjCon.length + 1; i++) {
    let inst = i != thisInst.adjCon.length ? thisInst[thisInst.adjCon[i]] : thisInst;
    if (inst.props.divOffset[plane] > adjInst.props.divOffset[plane] ) {
      if (next == undefined || inst.props.divOffset[plane] < next.props.divOffset[plane]) {
          next = inst;
      }
    }
  }
  return next;
}

function _getFirstInstance(thisInst) {
  var plane = thisInst.options.isVertical ? 'left' : 'top';
  var lowest = thisInst;

  thisInst.adjCon.forEach(v => {
    if ( lowest === undefined || thisInst[v].props.divOffset[plane] < lowest.props.divOffset[plane]) {
      lowest = thisInst[v]
    }
  })
  return lowest;
}


function _elemsToCutAppend(thisInst, adjInst) {

  if (adjInst.props.cutOff == false ) {
    return function() {};
  }

  var elemsToCut = [],
      ulSize = thisInst.getUlSize.call(adjInst),
      counter = -1;

  while (ulSize > adjInst.props.cutOff) {

    elemsToCut.push(adjInst.elts[adjInst.elts.length + counter])
    ulSize -= adjInst.elts[adjInst.elts.length + counter].props.size
    counter -= 1
  }
  var next = _findNext(thisInst, adjInst);

  var instToAddTo = next != undefined ? next : _getFirstInstance(thisInst); // if drop to last instance: cutoff to first instance

  if (instToAddTo.props.locked) return;
  
  var addedElemsArray = [];

  if (elemsToCut.length != 0) {

    for (let i = 0; i < elemsToCut.length; i++) {
     
      addedElemsArray.push(thisInst.addLiElem.call(instToAddTo, elemsToCut[i].innerHTML, 0, {elt: false, elts: true}))
      thisInst.removeLiElem.call(adjInst, adjInst.elts[adjInst.elts.length - 1], adjInst.transSupport, false, true)
    }
  }
  return addedElemsArray;
}


// function _shuffleArray(a) {
//   for (let i = a.length; i; i--) {
//     let j = Math.floor(Math.random() * i);
//     [a[i - 1], a[j]] = [a[j], a[i - 1]];
//   }
// }

// function _shuffle() {

//     var elems = [],
//         instances = arguments;  // account for n number of instances to shuffle


//     for (let ii = 0; ii < instances.length; ii++) { // get the elems

//       let n = 0;
//       while (instances[ii].elts[n] != undefined) {
//         instances[ii].elts[n].style[instances[ii].transitionPrefix] = '0ms'; // make sure elts dont animate into new position
//         elems.push(instances[ii].elts[n].innerHTML)
//         n++
//       }

//     }

//     _shuffleArray(elems)          // shuffle the elems

//       var count = 0
//       for (let ii = 0; ii < instances.length; ii++) {   // insert the elems

//           for (let n = 0; n < instances[ii].elts.length; n++) {
//             instances[ii].elts[n].innerHTML = elems[count]
//             count++;
//           }

//       }

//   this.reLayout()                             // reLayout the instances
//   this.reLayout.call(this.adjInst1)

//   return elems;
// };

export {
  // _shuffle,
  _elemsToCutAppend,
  transSupport,
  transitionPrefix,
  transformPrefix,
  ifGpu
};