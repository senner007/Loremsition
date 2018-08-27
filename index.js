import $ from 'jquery';
import {vertical} from "./examples/vertical-binary/vertical-binary.js"
import {horizontal } from "./examples/horizontal-binary/horizontal-binary.js"
import Loremsition from './src/main.js'
import {resizeThrottle, liInc, romanize} from './examples/utils/utils_helpers'

import './css/vertical-binary.css';
import './css/horizontal.css';
import './css/sortCss.css';

//$('.container').hide(); // cannot be set from css ???

(function () {
    var path = window.location.pathname.split('/');

    if (path[2] == 'horizontal') {
        $('.grid-vertical').remove();
        var containers = horizontal(Loremsition);
    }
    else  {
        $('.grid-horizontal').remove();
        var containers = vertical(Loremsition);
    } 

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
  
  
      loopContainers(function(v) { v.init()})

      document.body.querySelector('.container').style.visibility = "visible";
   
    
  
    resizeThrottle(function () {
      console.log('resizing!')
      loopContainers(function(v) { v.setCutOff(path[1] == 'horizontal' ? window.innerWidth : window.innerHeight)})
  
      // example of using the cutOffEnd method on the object's prototype.
      //Here, upon resize, it cuts the list when height is above specified value and prepends to adjacent container
  
      loopContainers(function(v) { v.cutOffEnd()})
      
      loopContainers(function(v) { v.reLayout()})
  
    })

}());

(function pageSetup() {

    $.fn.disableSelection = function() {
      return this
        .attr('unselectable', 'on')
        .css('user-select', 'none')
        .on('selectstart', false);
    };
  
    //$("body").css("overflow", "hidden");
    $('body').disableSelection();
    $('ul').on('touchmove', function(e) {
      e.preventDefault();
    });
  
}());


