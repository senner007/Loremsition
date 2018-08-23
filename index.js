import $ from 'jquery';
import {vertical} from "./examples/vertical.js"
import {horizontal } from "./examples/horizontal.js"
import Loremsition from './src/main.js'

//$('.container').hide(); // cannot be set from css ???

(function () {
    var path = window.location.pathname.split('/');

    if (path[1] == 'horizontal') {
        $('.grid-vertical').remove();
        horizontal(Loremsition, $);
    }
    else  {
        $('.splitList-horizontal').remove();
        vertical(Loremsition);

    } 
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


