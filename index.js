import $ from 'jquery';
import {vertical} from "./examples/vertical.js"
import {horizontal } from "./examples/horizontal.js"
import {pageSetup} from "./examples/pageSetup.js"

$('.container').hide(); // cannot be set from css ???

var exampleObject = {
    vertical: vertical,
    horizontal: horizontal
}

var path = window.location.pathname.split('/');


if (path[1] == 'vertical' ) {
    exampleObject.vertical();
}
else if (path[1] == 'horizontal') {
    exampleObject.horizontal();
} else {
    exampleObject.vertical();
}

pageSetup();