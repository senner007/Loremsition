

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


  return containers;

}