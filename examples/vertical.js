import {resizeThrottle} from './utils/utils_helpers'

export function vertical(Loremsition) {

  var elem1 = document.getElementById('loremsition-vertical-1');
  var elem2 = document.getElementById('loremsition-vertical-2');
  var elem3 = document.getElementById('loremsition-vertical-3');
  var elem4 = document.getElementById('loremsition-vertical-4');

  var winHeight = window.innerHeight - 20; // recalculate windows height for cutoff on resize.

  var containers = [
    new Loremsition(elem1, {
      isVertical: true,
      cutOff: winHeight,
      adjIds: [
        elem2.id,
        elem3.id,
        elem4.id
      ]
    }),
    new Loremsition(elem2, {
      isVertical: true,
      // dropLimit: 500,
      cutOff: winHeight,
      adjIds: [
        elem1.id,
        elem3.id,
        elem4.id
      ]
    }),
    new Loremsition(elem3, {
      isVertical: true,
      cutOff: winHeight,
      adjIds: [
        elem1.id,
        elem2.id,
        elem4.id
      ]
    }),
    new Loremsition(elem4, {
      isVertical: true,
      cutOff: winHeight,
      adjIds: [
        elem1.id,
        elem2.id,
        elem3.id
      ]
    })
  ];


  /*---------------------------------------------------------------------------------------------------------------------------------------*/
  // SETUP CALLBACKS
  /////////////////////////////////////////


  // containers[0].div.addEventListener('onReorder', function () {


  // })
  // containers[1].div.addEventListener('onReorder', function () {


  // })


  //  example of firing the layoutCompleteAll callback, which can be set up on all instance.divs. It is fired whan all instances have been init
  // cont2.div.addEventListener('onLayoutAll', function () {
  //   //
  //  cont2.addLiElem("<span class='special'></span>This element is added after the 'layoutCompleteAll' event.<span></br>This text <div class='blue'> This text is in a nested span element.</div>  is in a span element.</span>",0, {elt:true,elts:true},)
  //
  // })
  //containers[0].div.addEventListener('onReorder', function (ev, elt, elts) {

  // console.log('elt moved: ' + elt.n)
  // console.log('elt top pos : ' + elt.pos.top)
  // console.log('length of elts: ' + elts.length)

  // })

  // $('ul').on('pointerup.hello', function(ev) { // namespaced event added on top of events set in plugin. requires that stopPropagation is not used in plugin
  // //  ev.preventDefault()

  //   if (ev.target.localName == 'button') {

  //     cont1.shuffle(cont1, cont1.adjInst)
  //   }
  //   //$(this).off('pointerdown.hello');
  // })

 // containers[0].div.addEventListener('onDropTo', function (ev) {

    //$(this).find('li').first().css('height', '50px');
    //  liInc(containers)
    //  var elm = this.querySelectorAll('li');
    //  console.log(elm)

    //   var length = elm.length;
    //   for (var i = 0; i < length; i++) {
    //     elm[i].className = elm[i].className + " classname";
    //   }

    //  $(this).find('li').addClass('trimText')

    //  containers[0].reLayout()
  //})

  containers[1].div.addEventListener('onLayout', function () {
    console.log('onLayout event')
 
 })

  containers[1].div.addEventListener('onLayoutAll', function () {
    console.log('onLayoutAll event!')
    containers[1].addLiElem("<span class='special'></span>This element is added after the 'onLayoutAll' event.", 0)
 })

  loopContainers(function (c) {
    c.div.addEventListener('onDropTo', function (ev) {
      liInc()
      loopContainers(function(v) { v.reCalculate()})
    })
  })


  function liInc() {
    var counter = 1;
    loopContainers(function (el) {
      for (let i = 0; i < el.elts.length; i++) {
        var myText = counter + 'th'
        if (counter == 1) {
          myText = counter + 'st'
        }
        if (counter == 2) {
          myText = counter + 'nd'
        }
        if (counter == 3) {
          myText = counter + 'rd'
        }

        el.elts[i].childNodes[0].textContent = myText
        counter++;
      }
    })
  }

  function loopContainers(fn) {
    containers.forEach(fn)
  }

  loopContainers(function(v) { v.init()})
  liInc()
  loopContainers(function(v) { v.reCalculate()})

  resizeThrottle(function () {
    console.log('resizing!')
    loopContainers(function(v) { v.cutOff = window.innerHeight - 20})


    // example of using the cutOffEnd method on the object's prototype.
    //Here, upon resize, it cuts the list when height is above specified value and prepends to adjacent container

    loopContainers(function(v) { v.cutOffEnd()})
    liInc()
    loopContainers(function(v) { v.reLayout()})

  })

}