import {
  resizeThrottle,
  romanize
} from '../utils/utils_helpers'

export default function (Loremsition) {

  var elem1 = document.getElementById('loremsition-horizontal-1');
  var elem2 = document.getElementById('loremsition-horizontal-2');
  var elem3 = document.getElementById('loremsition-horizontal-3');
  var elem4 = document.getElementById('loremsition-horizontal-4');

  var grid = document.querySelector('.grid-horizontal')

  var containers = [
    new Loremsition(elem1, {
      isVertical: false,
      adjIds: [
        elem2.id,
        elem3.id,
        elem4.id
      ]
    }),
    new Loremsition(elem2, {
      isVertical: false,
      adjIds: [
        elem1.id,
        elem3.id,
        elem4.id
      ]
    }),
    new Loremsition(elem3, {
      isVertical: false,
      adjIds: [
        elem1.id,
        elem2.id,
        elem4.id
      ]
    }),
    new Loremsition(elem4, {
      isVertical: false,
      adjIds: [
        elem1.id,
        elem2.id,
        elem3.id
      ]
    })
  ];

  containers[0].div.addEventListener('onLayoutAll', function () {

    var size = (containers[0].props.ulSize + containers[1].props.ulSize)/2 * 1.3;

    grid.style.width = size + 'px';

    (function () {
      var i = 1
      loopContainers(function (cont) {
        cont.props.dropLimit = size;
        cont.elts.forEach(function (e) {
          e.querySelector('.special').innerText = romanize(i++);
        })
      })
    }());

    loopContainers(function (cont) {
      cont.reCalculate()
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

    loopContainers(function (cont) {
      cont.props.dropLimit = size;
    })

  })

  return containers;

}