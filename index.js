import $ from 'jquery';
import {vertical} from "./examples/vertical.js"
import {horizontal } from "./examples/horizontal.js"
import {pageSetup} from "./examples/pageSetup.js"
import LoremChopsum from './src/module_main.js'

$('.container').hide(); // cannot be set from css ???

console.log(LoremChopsum)

var exampleObject = {
    vertical: vertical,
    horizontal: horizontal
}

var path = window.location.pathname.split('/');


if (path[1] == 'vertical' ) {
    exampleObject.vertical(LoremChopsum, $);
}
else if (path[1] == 'horizontal') {
    exampleObject.horizontal(LoremChopsum, $);
} else {
    exampleObject.vertical(LoremChopsum, $);
}

pageSetup();