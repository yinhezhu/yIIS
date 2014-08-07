
define(function(require, exports, module) {
    var t = $;
    var r = require("./swipe.js");
    t(function() {
        
        var u = navigator.userAgent;
        var w = window;
        t(w).on("load",
        function() {
            var s = document.getElementById("inslist");
            if (s) var o = s.getElementsByTagName("li"),
            u = setInterval(function() {
                o.length > 0 && o[0].offsetWidth > 0 && (c = new r(".in-slider", {
                    wrap: ".in-slider-cont",
                    trigger: ".in-slider-status",
                    useTransform: !0,
                    interval: 3e3,
                    play: !0,
                    loop: !0,
					isFullScreen : !0
                }), clearInterval(u))
            },
            500);
        })
    })
}); 

