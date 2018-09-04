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

    var size = (containers[0].props.ulSize + containers[1].props.ulSize)/2 * 1.3;

    containers[0].setCutOff(size)

    grid.style.width = size + 'px';
    containers[1].props.dropLimit = size;

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

    var size = (containers[0].props.ulSize + containers[1].props.ulSize)/2 * 1.3;
    
    grid.style.width = size + 'px';
    containers[0].setCutOff(size);
    containers[1].props.dropLimit = size;

  })

  return containers;

}