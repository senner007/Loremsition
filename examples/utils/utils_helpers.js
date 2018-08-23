    
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
                }, 100);
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


export {resizeThrottle, liInc}