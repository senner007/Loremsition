    
function resizeThrottle(fn) {
    // resize throttle

    window.addEventListener("resize", resizeThrottler, false);
    var resizeTimeout;

    function resizeThrottler() {
        // ignore resize events as long as an actualResizeHandler execution is in the queue
        if (!resizeTimeout) {
            resizeTimeout = setTimeout(function () {
                resizeTimeout = null;
                fn();
            }, 700);
        }
    }
}

function liInc(loopContainers) {
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
        el.elts[i].querySelector('.special').textContent = myText
        counter++;
      }
    })
  }

  function romanize (num) {
    if (!+num)
        return NaN;
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
  }


export {resizeThrottle, liInc, romanize}