import {
  resizeThrottle
} from '..//utils/utils_helpers'

export default function(Loremsition) {

  var elem1 = document.getElementById('loremsition-vertical-1');
  var elem2 = document.getElementById('loremsition-vertical-2');

  var winHeight = window.innerHeight; // recalculate windows height for cutoff on resize.

  var containers = [
    new Loremsition(elem1, {
      isVertical: true,
      cutOff: winHeight,
      adjIds: [
        elem2.id
      ]
    }),
    new Loremsition(elem2, {
      isVertical: true,
      cutOff: false,
      dropLimit: winHeight,
      adjIds: [
        elem1.id
      ]
    })
  ];

  // containers[0].lock();


  containers[1].div.addEventListener('onLayoutAll', function () {
    containers[1].removeLiElem(1, true, function () {
      containers[1].addLiElem("<span class='special'>E</span>element added after remove animation", 0)
    })
  })

  loopContainers(function (c) {
    c.div.addEventListener('onDropTo', function (ev) {

      // loopContainers(function(v) { v.reCalculate()})
    })
  })

  function loopContainers(fn) {
    containers.forEach(fn)
  }

  loopContainers(function (v) {
    v.init()
  })

  document.body.querySelector('.container').style.visibility = "visible";

  resizeThrottle(function () {
    console.log('resizing!')
    loopContainers(function (v) {
      v.setCutOff(window.innerHeight)
    })

    // example of using the cutOffEnd method on the object's prototype.
    //Here, upon resize, it cuts the list when height is above specified value and prepends to adjacent container

    loopContainers(function (v) {
      v.cutOffEnd()
    })

    loopContainers(function (v) {
      v.reLayout()
    })

  })

  return containers;

}