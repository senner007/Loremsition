

export function vertical(Loremsition) {

  var elem1 = document.getElementById('loremsition-vertical-1');
  var elem2 = document.getElementById('loremsition-vertical-2');

  var winHeight = window.innerHeight; // recalculate windows height for cutoff on resize.

  var containers = [
    new Loremsition(elem1, {
      isVertical: true,
      cutOff: winHeight,
      adjIds: [
        elem2.id
      ]
    }),
    new Loremsition(elem2, {
      isVertical: true,
      cutOff: false,
      dropLimit: winHeight,
      adjIds: [
        elem1.id
      ]
    })
  ];


  return containers;

}