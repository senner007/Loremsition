import {
  resizeThrottle,
  romanize
} from '../utils/utils_helpers'

export default function (Loremsition) {

  var elem1 = document.getElementById('loremsition-horizontal-1');
  var elem2 = document.getElementById('loremsition-horizontal-2');

  var grid = document.querySelector('.grid-horizontal')

  var containers = [
    new Loremsition(elem1, {
      isVertical: false,
      adjIds: [
        elem2.id
      ]
    }),
    new Loremsition(elem2, {
      isVertical: false,
      cutOff: false,
      adjIds: [
        elem1.id
      ]
    })
  ];

  containers[0].div.addEventListener('onLayoutAll', function () {

    containers[0].setCutOff(containers[0].props.ulSize)

    grid.style.width = containers[0].props.ulSize + 'px';
    containers[1].props.dropLimit = containers[0].props.ulSize;

    (function () {
      var i = 1
      loopContainers(function (v) {
        v.elts.forEach(function (e) {
          e.querySelector('.special').innerText = romanize(i++);
        })
      })
    }());

    loopContainers(function (v) {
      v.reCalculate()
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

    loopContainers(function (v) {
      v.reLayout()
    })

    var largestUl = Math.max(containers[0].props.ulSize, containers[1].props.ulSize)
    var size = largestUl * 1.1;
    
    grid.style.width = size + 'px';
    containers[0].setCutOff(size);
    containers[1].props.dropLimit = size;

  })

  return containers;

}