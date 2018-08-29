import {
  resizeThrottle, romanize
} from '../utils/utils_helpers'

export default function (Loremsition) {

  var elem1 = document.getElementById('loremsition-horizontal-1');

  var winWidth = window.innerWidth; // recalculate windows height for cutoff on resize. Also run cutoff on resize

  var containers = [
    new Loremsition(elem1, {
      isVertical: false,
      cutOff: winWidth,
    })
  ];

  // containers[0].lock();
  

  containers[0].div.addEventListener('onLayoutAll', function () {
    containers[0].div.style.width = containers[0].props.ulSize + 'px';
    containers[0].removeLiElem(2, true, function () {
      containers[0].addLiElem("<span class='special'>11</span><div class='inner-div'>N</div>")
      loopContainers(function (v) {
        v.elts.forEach(function(e,i)  {
          e.querySelector('.special').innerText = romanize(i +1);
        })
      })
     
      loopContainers(function (v) {
        v.reCalculate()
      })

    })
  })

  loopContainers(function (c) {
    c.div.addEventListener('onDropTo', function (ev) {
      loopContainers(function (v) {
        v.elts.forEach(function(e,i)  {
          e.querySelector('.special').innerText = romanize(i +1);
        })
      })
       loopContainers(function(v) { v.reCalculate()})
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
    containers[0].div.style.width = containers[0].props.ulSize + 'px';

  })

  return containers;

}
