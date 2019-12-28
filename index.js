import Loremsition from './src/main.js'
import './css/sortCss.css';

// import './examples/horizontal-unary/horizontal-unary.css';
// import './examples/vertical-binary/vertical-binary.css';
// import './examples/vertical-n-ary/vertical-n-ary.css';

import 'core-js/features/promise';  
import 'whatwg-fetch';


(function () {
    var path = window.location.pathname.split('/').join('');
    console.log(path)
    var myRe = /((vertical|horizontal)[-\w]+)/
    var test = myRe.exec(path)[0];

    if (test) {
      var assets = {
        css : import(`./examples/${test}/${test}.css`),
        html : import(`./examples/${test}/${test}.html`),
        js : import(`./examples/${test}/${test}.js`)
      }      
    }
    // else if (path.includes('vertical-binary')) {
    //   var assets = {
    //     html : import('./examples/vertical-binary/vertical-binary.html'),
    //     js : import("./examples/vertical-binary/vertical-binary.js")
    //   }
    // }
    // else if (path.includes('vertical-n-ary') || path[2] == "" || !path[2]) {
    //   var assets = {
    //     html : import('./examples/vertical-n-ary/vertical-n-ary.html'),
    //     js : import("./examples/vertical-n-ary/vertical-n-ary.js")
    //   }
    // }  

    Promise.all([assets.css, assets.html, assets.js]).then(function(values) {
      document.querySelector('.container').innerHTML = values[1].default;
      values[2]['default'](Loremsition)
    });

}());
