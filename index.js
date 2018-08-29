import Loremsition from './src/main.js'
import './css/sortCss.css';
import './css/horizontal.css';
import './css/vertical-binary.css';

import "babel-polyfill";
import 'whatwg-fetch'

(function () {
    var path = window.location.pathname.split('/');

    if (path[2] == 'horizontal') {
      var assets = {
        html : import('./examples/horizontal-unary/horizontal-unary.html'),
        js : import("./examples/horizontal-unary/horizontal-unary.js")
      }
          
    }
    else  {
      var assets = {
        html : import('./examples/vertical-binary/vertical-binary.html'),
        js : import("./examples/vertical-binary/vertical-binary.js")
      }
    } 

    Promise.all([assets.html, assets.js]).then(function(values) {
      document.querySelector('.container').innerHTML = values[0];
      values[1]['default'](Loremsition)
    });

}());
