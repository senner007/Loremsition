import {
  resizeThrottle
} from '../utils/utils_helpers'

export default function(Loremsition) {

  var elem1 = document.getElementById('loremsition-vertical-n-ary-1');
  var elem2 = document.getElementById('loremsition-vertical-n-ary-2');
  var elem3 = document.getElementById('loremsition-vertical-n-ary-3');

  var winHeight = window.innerHeight; // recalculate windows height for cutoff on resize.

  var containers = [
    new Loremsition(elem1, {
      isVertical: true,
      cutOff: winHeight,
      adjIds: [
        elem2.id,
        elem3.id
      ]
    }),
    new Loremsition(elem2, {
      isVertical: true,
      cutOff: winHeight,
      adjIds: [
        elem1.id,
        elem3.id
      ]
    }),
    new Loremsition(elem3, {
      isVertical: true,
      cutOff: false,
      dropLimit: winHeight,
      adjIds: [
        elem1.id,
        elem2.id
      ]
    })
  ];

  // containers[0].lock();


  containers[1].div.addEventListener('onLayoutAll', function () {
    containers[1].removeLiElem(1, true, function () {
      containers[1].addLiElem("<span class='special'>O</span>dio ut sem nulla pharetra diam sit amet nisl suscipit. Luctus accumsan tortor posuere ac. Ipsum consequat nisl vel pretium lectus quam id leo.", 0)
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
      v.setDropLimit(v.props.dropLimit ? window.innerHeight : false)
      v.setCutOff(v.props.cutOff ? window.innerHeight : false)
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