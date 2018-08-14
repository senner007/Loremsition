import {
  vertical
} from "./examples/vertical.js"
import {
  horizontal
} from "./examples/horizontal.js"
import {
  pageSetup
} from "./pageSetup.js"
import JumbleScramble from "../plugin_js/module_main.js";
// ES6 MODULE IMPORT/EXPORT
////////////////////////////
$(document).ready(function() {

  $('.container').hide(); // cannot be set from css ???

  var exampleObject = {
    vertical: vertical,
    horizontal: horizontal
  }
 
  var path = window.location.pathname.split('/');

  console.log(path[1])

  // if (path[2].length == 0) {
  //   $('.bodyButton').show().on('click', function(e) {
  //     console.log('hello')
  //     exampleObject[e.target.textContent]();
  //   });
  if (path[1] == 'vertical') {
    exampleObject.vertical();
  }

  if (path[1] == 'horizontal') {
    exampleObject.horizontal();
  }
  
  pageSetup();

});
