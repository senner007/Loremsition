import Loremsition from './src/main.js'
import './css/sortCss.css';
import './examples/horizontal-unary/horizontal-unary.css';
import './examples/vertical-binary/vertical-binary.css';
import './examples/vertical-n-ary/vertical-n-ary.css';

import 'core-js/features/promise';  
import 'whatwg-fetch';

(function () {
    var path = window.location.pathname.split('/');

    if (path[2] == 'horizontal-unary') {
      var assets = {
        html : import('./examples/horizontal-unary/horizontal-unary.html'),
        js : import("./examples/horizontal-unary/horizontal-unary.js")
      }      
    }
    else if (path[2] == 'vertical-binary') {
      var assets = {
        html : import('./examples/vertical-binary/vertical-binary.html'),
        js : import("./examples/vertical-binary/vertical-binary.js")
      }
    }
    else if (path[2] == 'vertical-n-ary') {
      var assets = {
        html : import('./examples/vertical-n-ary/vertical-n-ary.html'),
        js : import("./examples/vertical-n-ary/vertical-n-ary.js")
      }
    }  

    Promise.all([assets.html, assets.js]).then(function(values) {
      document.querySelector('.container').innerHTML = values[0];
      values[1]['default'](Loremsition)
    });

}());
