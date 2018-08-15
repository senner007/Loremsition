    
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

export {resizeThrottle}