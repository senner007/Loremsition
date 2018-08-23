

export function horizontal (Loremsition) {

  var elem1 = document.getElementById('loremsition-horizontal-1');
  var elem2 = document.getElementById('loremsition-horizontal-2');
  var elem3 = document.getElementById('loremsition-horizontal-3');
  var elem4 = document.getElementById('loremsition-horizontal-4');

  var winWidth = window.innerWidth; // recalculate windows height for cutoff on resize. Also run cutoff on resize

  var containers = [
    new Loremsition(elem1, {
      isVertical: false,
      cutOff: winWidth,
      adjIds: [
        elem2.id,
        elem3.id,
        elem4.id
      ]
    }),
    new Loremsition(elem2, {
      isVertical: false,
      cutOff: winWidth,
      adjIds: [
        elem1.id,
        elem3.id,
        elem4.id
      ]
    }),
    new Loremsition(elem3, {
      isVertical: false,
      cutOff: winWidth,
      adjIds: [
        elem1.id,
        elem2.id,
        elem4.id
      ]
    }),
    new Loremsition(elem4, {
      isVertical: false,
      cutOff: winWidth,
      adjIds: [
        elem1.id,
        elem2.id,
        elem3.id
      ]
    })
  ];

   

  return containers;

}
