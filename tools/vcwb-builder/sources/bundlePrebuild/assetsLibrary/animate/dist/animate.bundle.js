!function(t){function e(n){if(a[n])return a[n].exports;var r=a[n]={exports:{},id:n,loaded:!1};return t[n].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var a={};return e.m=t,e.c=a,e.p=".",e(0)}({"./src/animate.js":function(t,e){"use strict";window.vcv.on("ready",function(t,e){var a=function(t){var e=t?'[data-vcv-element="'+t+'"]':"[data-vce-animate]",a=document.querySelectorAll(e);a=[].slice.call(a),a.forEach(function(e){if(!t||e.getAttribute("data-vce-animate")||(e=e.querySelector("[data-vce-animate]"))){var a=e.vcvWaypoints;a&&(a.destroy(),e.removeAttribute("data-vcv-o-animated"));var n=new window.Waypoint({element:e,handler:function(t,a,r,c,o){e.setAttribute("data-vcv-o-animated","true"),n.destroy()},offset:"85%"});e.vcvWaypoints=n}})};"merge"!==t&&a(t&&e?e:"")})},"./src/animate.css":function(t,e){},0:function(t,e,a){a("./src/animate.js"),t.exports=a("./src/animate.css")}});