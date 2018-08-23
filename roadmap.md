### Roadmap:

2.0
- set up css in options overwritring the css in css file

0.2 - Plugin showcasing
- Click items to delete (for showcasing)
- support for custom animations set in options
- method to turn all animations on/off
- getInstances() should point to array of all instances but without prototypes (Object.assign)
- Add callbacks to init, relayout, add, remove, drop (before and after animate)
- Add containment option to specify containment for the draggable elements.
- add placeholder when dragging
- maybe set {passive: true} as third argument on event start and event move - https://developers.google.com/web/updates/2017/01/scrolling-intervention
- if id is not passed in options, it will get the div id or assign a number based id based on the order of instantiation(default)
- possibly eliminate the need for having both height and width property on elt.props
- fix dragging in ie9

0.1
- Refactor shuffle method to scale out and in use the _scaleElems method, call cutoff method after shuffle
- setChars function should update elt object as well, it does not work when moving to another container. should probably work in conjunction with the relayout method.
- Dragging enable/disable/lock on individual items method
- Improve add and remove method. eg. all or an array as parameter, allow index(number) as elt selctor in removeLiElem
- add boolean to cutOffEnd method which prevents the function from running if the cut-off element(s) will make adjacent container fire its cutoffEnd method and thereby creating an infinite loop.
- Assume transition support
- Call orientationChange event in place of resize on Chrome ios
- use native event delegation https://stackoverflow.com/questions/14174056/native-addeventlistener-with-selector-like-on-in-jquery
- when using a single list, allow the option to constrain to a single axis - http://www.javascriptkit.com/javatutors/touchevents.shtml(bottom)
----------------------------------------------------------------------------------------------------------------------------
- fix onReorder event to only show reorder on the desired instance
- fix lock method
- call scale method in removeLiElem
- allow option to cutoff to specified instance
- allow shuffle method with no parameters, otherwise should take an array of instances
- Use normalize.css
- Allow vertical instances to be placed vertically above/under. Create example with 4 vertical instances aligned horizontally which then realigns to 2 above and 2 under in landscape mode.
- Validate html with w3
- Optional sorting functionality - drag from but not reorder
- Put crossflag on instance object - not prototype
- Set initial div.id on elt
- return elt, elts, thisInst and thisInst.newInst with onDropTo, onDropFrom callbacks
- allow user to specify delay before animating elements
-------------------------------------------------------------------------------------------------------------------------------
- write guessHeight algorithm
- refactor guessHeight conditionals
- throttle drag call on mouse/touch move
- fix ie shaking behavior on transition


Fixed:
- allow dragging and dropping over other instances 
- double cliking elements throws errors 
- do not run init on object instantiation (run after as obj.init())
- currently doesn't work in Edge  ({once: true} in events doesn't agree with Edge)
- improve the addLiElem logic, remove jQuery
- maybe add and remove the element on triggeron/tiggeroff, hide it but update its position on each reorder. Then avoid calling the addLiElem on dragstop - 
- try to unify the reordering logic and refactor into a single function call
- remove global instanceArr. 
- refactor cutOff - pass completeHeight, comleteWidth to addLiElem
- on event move, pass in only instances that are involved in the event(Pass in elt, instanceThis, instanceAdj (maybe rename)). 
- Put remaining properties on instanceArr on each instance. 
- allow cutOff and dropLimit to be set after init
- make dropLimit work in horizontal mode
- refactor scale/descale elems to one function 
- scale in items before transition has finished 
- make calculate a ul function
- make a function to iterate  over elements and add to object as in init and relayout.
- make cutOff return a collection of items and which can then be passed to add and remove function. 
- make a cutoff on prototype only for external use
- save the ul height on instance
- remove onstop from prototype
- use the eltsReorder in addLiElem - then publish reorder event when reorder in eltsReorder functions - 
- relayout is duplicating code from init
- reduce params to addToObject function 
- remove _transToZero from prototype
- remove remaining methods from adjInst prototype
- trigger events using native js - https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events 
- account for margin/space  between instances
- remove setInstances, addLiElem, removeLiElem from proto 
- fix shaking animation in edge -  (occurs when .container class position is not set to absolute in css)
- pass in the element for the adjacent container on instantiation, and set/look up adjacent container by its id 
- No need to pass adjConElts and o to triggeroff function
- loop over copy.adjInst(n) to be removed in setInstances
- update algorithm to allow for individual width of adjacent vertical instances :
ThisInst.left + thisInst.w /2 > thisInst[p].left && ThisInst.left + thisInst.w /2 < thisInst[p] + thisInst[p].w
- Use only one loop when setting divSwitch, save the position distance to a var and only run loop if outside the saved distance
- recalculate completeHeight/completeWidth when adding element dragged from container with a different width
- correct bug causing cutOff to not calculate properly
- fix z-index
- Multiple container drop ( long term ) 
- allow individual width of each instance in vertical
- Setup with css grid
- define getter and setter for position, size
- recalculate adjInst(n).distanceTo & props.divWidth/divHeight on reLayout

Partially fixed:
- prevent multitouch !!! - The element will freeze and animate back if multi touch is detected. Find a way to simple ignore additional touches

Testing:
- Create responsive layout and test on mobile devices
- Insert into sliders eg. SLY