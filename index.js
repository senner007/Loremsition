import $ from 'jquery';
import {vertical} from "./examples/vertical.js"
import {horizontal } from "./examples/horizontal.js"
import Loremsition from './src/main.js'
import {resizeThrottle, liInc} from './examples/utils/utils_helpers'

//$('.container').hide(); // cannot be set from css ???

(function () {
    var path = window.location.pathname.split('/');

    if (path[1] == 'horizontal') {
        $('.grid-vertical').remove();
        var containers = horizontal(Loremsition);
    }
    else  {
        $('.grid-horizontal').remove();
        var containers = vertical(Loremsition);
    } 


    containers[1].div.addEventListener('onLayout', function () {
        console.log('onLayout event')
     
     })
    
      containers[1].div.addEventListener('onLayoutAll', function () {
        console.log('onLayoutAll event!')
        containers[1].addLiElem("<span class='special'></span>This element is added after the 'onLayoutAll' event.", 0)
     })
  
  
     loopContainers(function (c) {
      c.div.addEventListener('onDropTo', function (ev) {
        liInc(loopContainers)
        loopContainers(function(v) { v.reCalculate()})
      })
    })
  
    function loopContainers(fn) {
      containers.forEach(fn)
    }
  
    loopContainers(function(v) { v.init()})
    liInc(loopContainers)
    loopContainers(function(v) { v.reCalculate()})
  
  
    resizeThrottle(function () {
      console.log('resizing!')
      loopContainers(function(v) { v.setCutOff(path[1] == 'horizontal' ? window.innerWidth : window.innerHeight)})
  
        console.log(containers[0].cutOff)
      // example of using the cutOffEnd method on the object's prototype.
      //Here, upon resize, it cuts the list when height is above specified value and prepends to adjacent container
  
      loopContainers(function(v) { v.cutOffEnd()})
      liInc(loopContainers)
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


