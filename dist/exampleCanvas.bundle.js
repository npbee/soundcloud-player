!function(t){function e(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return t[r].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var n={};return e.m=t,e.c=n,e.p="/dist/",e(0)}([function(t,e,n){n(1),t.exports=n(47)},function(t,e,n){throw new Error("[HMR] Hot Module Replacement is disabled.")},function(t,e,n){"use strict";var r=n(34)["default"],o=n(37)["default"],i=n(38)["default"],s=n(3)["default"],a=n(41)["default"];Object.defineProperty(e,"__esModule",{value:!0});var c=n(46),u=function(){function t(e){if(o(this,t),"object"!=typeof SC)throw new Error('No "SC" Soundcloud object found.  You need to first load the Soundcloud SDK before loading the player.');if(!e)throw new Error("Please provide an options object to the constructor.");if(!e.clientId)throw new Error('Please provide a "clientId" parameter to the constructor');this.clientId=e.clientId,this.scrubberEl=e.scrubberEl||void 0,this.timeEl=e.timeEl||void 0,this.tracksEl=e.tracksEl||void 0,this.controlsEl=e.controlsEl||void 0,this.tracks=[],this.subscriptions={},this.trackOptions={},this.currentTrackIndex=0,this.onWaveformCreate=e.onWaveformCreate||void 0,this.showWaveform=void 0!==e.showWaveform?e.showWaveform:!0,this.busy=!1,this.playing=!1,this.paused=!1,this.initializeSoundcloud(this.clientId),"object"==typeof window&&this.bindKeys()}return r(t,[{key:"initializeSoundcloud",value:function(t){return SC.initialize({client_id:t})}},{key:"appendControls",value:function(){var t=this.controlsEl,e=document.createDocumentFragment(),n=document.createElement("a"),r=document.createElement("span");r.textContent="Previous",n.className="sc-prev",n.appendChild(r),e.appendChild(n);var o=document.createElement("a"),i=document.createElement("span");i.textContent="Play",o.className="sc-play",o.appendChild(i),e.appendChild(o);var s=document.createElement("a"),a=document.createElement("span");a.textContent="Play",s.className="sc-pause",s.appendChild(a),e.appendChild(s);var c=document.createElement("a"),u=document.createElement("span");u.textContent="Play",c.className="sc-next",c.appendChild(u),e.appendChild(c),t.appendChild(e),this.bindControlEvents()}},{key:"appendTrackLinks",value:function(){var t=this.tracks,e=this.tracksEl,n=document.createDocumentFragment();t.forEach(function(t,e){var r=t.title,o=document.createElement("a");o.textContent=r,o.setAttribute("data-track-index",e),o.className="sc-track",n.appendChild(o)}),e.appendChild(n),this.bindTrackEvents()}},{key:"removeActiveTrackLinks",value:function(){var t=i(this.tracksEl.children);t.forEach(function(t){t.classList.remove("sc-track--active")})}},{key:"bindKeys",value:function(){var t=this;document.body.addEventListener("keydown",t.onKeyboardEvent.bind(t))}},{key:"onKeyboardEvent",value:function(t){var e=t.keyCode||t.which,n=this;32===e&&(n.playing?n.pause():n.paused?n.resume():n.play()),39===e&&n.next(),37===e&&n.prev()}},{key:"bindControlEvents",value:function(){var t=this.controlsEl,e=this;t.addEventListener("click",function(t){if(t.target&&"A"===t.target.nodeName){var n=t.target;n.classList.contains("sc-prev")&&e.prev(),n.classList.contains("sc-next")&&e.next(),n.classList.contains("sc-play")&&(document.body.classList.contains("sc--paused")?e.resume():e.play(),document.body.classList.add("sc--playing"),document.body.classList.remove("sc--paused")),n.classList.contains("sc-pause")&&(document.body.classList.add("sc--paused"),document.body.classList.remove("sc--playing"),e.pause())}})}},{key:"bindTrackEvents",value:function(){var t=this.tracksEl,e=this;t.addEventListener("click",function(t){if(t.target&&"A"===t.target.nodeName){var n=t.target,r=n.getAttribute("data-track-index");e.play(r)}})}},{key:"addSets",value:function(t,e){var n=this,r=this;r.busy=!0,"string"==typeof t&&(t=[t]),Array.isArray(e)||(e=[e]);var o=t.map(function(t,e){return n.get("/playlists/"+t)});return s.all(o).then(function(t){return t.forEach(function(t){t.tracks.forEach(function(t,n){var o=e.length>1?e[n]:e[0];r.trackOptions[t.id]||(r.trackOptions[t.id]=o),r.tracks.push(t)})}),r.appendTrackLinks(),r.appendControls(),r.busy=!1,t})}},{key:"addTracks",value:function(t,e){var n=this,r=this;r.busy=!0,"string"==typeof t&&(t=[t]),Array.isArray(e)||(e=[e]);var o=t.map(function(t,e){return n.get("/tracks/"+t)});return s.all(o).then(function(t){return t.forEach(function(t,n){var o=e.length>1?e[n]:e[0];r.trackOptions[t.id]||(r.trackOptions[t.id]=o),r.tracks.push(t)}),r.busy=!1,t})}},{key:"at",value:function(t,e,n){this.subscriptions[t]||(this.subscriptions[t]=[]),"string"==typeof e&&(e=c.toMilliseconds(e)),this.subscriptions[t].push({time:e,fn:n})}},{key:"get",value:function(t,e){return new s(function(n,r){SC.get(t,e,function(t,e){return e?r(e):void n(t)})})}},{key:"stream",value:function(t){var e=void 0===arguments[1]?{}:arguments[1],n=this,r=n.trackOptions[t.id]||{},o=a({onload:function(){var e=n.subscriptions[t.id],r=this;e.length&&e.forEach(function(t){r.onPosition(t.time,t.fn)}),n.waveform&&n.waveform.onload&&n.waveform.onload(this)},whileplaying:e.whileplaying||function(){var t=this.position/this.duration,e=c.toTimecode(this.position),r=c.toTimecode(this.duration);n.timeEl.textContent=e+" / "+r,n.waveform&&n.waveform.whileplaying?n.waveform.whileplaying(this):n.played.style.width=100*t+"%"}},r,e);SC.stream(t.uri,o,function(t){n.currentSoundObject=t,t.play(),n.playing=!0,n.paused=!1,"object"==typeof window&&document.body.classList.add("sc--playing")})}},{key:"next",value:function(){this.play(++this.currentTrackIndex)}},{key:"prev",value:function(){this.play(--this.currentTrackIndex)}},{key:"play",value:function(t){var e=this;if(e.playing&&e.stop(),this.busy)return void setTimeout(function(){e.play(t)},0);if(!this.tracks.length)throw new Error("There are no tracks in the player!");var n=this.tracks[t||0];if(n){this.prepareScrubber(n);var r=this.trackOptions[n.id];return e.removeActiveTrackLinks(),e.makeTrackActive(t||0),this.stream(n,r||{})}}},{key:"makeTrackActive",value:function(t){var e=this.tracksEl,n=i(e.children).filter(function(e){return parseInt(e.getAttribute("data-track-index"),10)===parseInt(t,10)});n[0].classList.add("sc-track--active")}},{key:"stop",value:function(){this.currentSoundObject.stop(),document.body.classList.remove("sc--playing")}},{key:"pause",value:function(){this.paused=!0,this.playing=!1,document.body.classList.remove("sc--playing"),document.body.classList.add("sc--paused"),this.currentSoundObject.pause()}},{key:"resume",value:function(){this.paused=!1,this.playing=!0,document.body.classList.remove("sc--paused"),document.body.classList.add("sc--playing"),this.currentSoundObject.resume()}},{key:"push",value:function(t,e){var n=this;n.busy=!0,this.get("/tracks/"+t.uri,e).then(function(e){t=a(t,e),n.tracks.push(t),n.busy=!1})}},{key:"scrub",value:function(t){var e=this.scrubberEl.getBoundingClientRect(),n=e.left,r=this.scrubberEl.offsetWidth,o=(t-n)/r;this.seek(o)}},{key:"seek",value:function(t){var e=this.currentSoundObject,n=e.duration,r=n*t;e.setPosition(r)}},{key:"prepareScrubber",value:function(t){var e=this;if(console.log(e),this.onWaveformCreate){this.scrubberEl.innerHTML="";var n=this.waveform=this.onWaveformCreate(t);n.element?this.scrubberEl.appendChild(n.element):this.scrubberEl.appendChild(n)}else if(this.showWaveform){this.played||(this.played=document.createElement("div"),this.played.classList.add("sc-played"),this.scrubberEl.appendChild(this.played));var r=document.createElement("div"),o=document.createElement("img");r.classList.add("sc-waveform"),o.src=t.waveform_url,r.appendChild(o),this.scrubberEl.appendChild(r)}this.scrubberEl.addEventListener("click",function(t){e.scrub(t.pageX)})}}]),t}();e.Player=u},function(t,e,n){t.exports={"default":n(4),__esModule:!0}},function(t,e,n){n(5),n(13),n(19),n(22),t.exports=n(7).core.Promise},function(t,e,n){"use strict";var r=n(6),o={};o[n(9)("toStringTag")]="z",n(7).FW&&"z"!=r(o)&&n(12)(Object.prototype,"toString",function(){return"[object "+r.classof(this)+"]"},!0)},function(t,e,n){function r(t){return s.call(t).slice(8,-1)}var o=n(7),i=n(9)("toStringTag"),s={}.toString;r.classof=function(t){var e,n;return void 0==t?void 0===t?"Undefined":"Null":"string"==typeof(n=(e=Object(t))[i])?n:r(e)},r.set=function(t,e,n){t&&!o.has(t=n?t:t.prototype,i)&&o.hide(t,i,e)},t.exports=r},function(t,e,n){"use strict";function r(t){return isNaN(t=+t)?0:(t>0?v:p)(t)}function o(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}function i(t,e,n){return t[e]=n,t}function s(t){return g?function(e,n,r){return k.setDesc(e,n,o(t,r))}:i}function a(t){return null!==t&&("object"==typeof t||"function"==typeof t)}function c(t){return"function"==typeof t}function u(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}var l="undefined"!=typeof self?self:Function("return this")(),f={},h=Object.defineProperty,d={}.hasOwnProperty,p=Math.ceil,v=Math.floor,m=Math.max,y=Math.min,g=!!function(){try{return 2==h({},"a",{get:function(){return 2}}).a}catch(t){}}(),b=s(1),k=t.exports=n(8)({g:l,core:f,html:l.document&&document.documentElement,isObject:a,isFunction:c,that:function(){return this},toInteger:r,toLength:function(t){return t>0?y(r(t),9007199254740991):0},toIndex:function(t,e){return t=r(t),0>t?m(t+e,0):y(t,e)},has:function(t,e){return d.call(t,e)},create:Object.create,getProto:Object.getPrototypeOf,DESC:g,desc:o,getDesc:Object.getOwnPropertyDescriptor,setDesc:h,setDescs:Object.defineProperties,getKeys:Object.keys,getNames:Object.getOwnPropertyNames,getSymbols:Object.getOwnPropertySymbols,assertDefined:u,ES5Object:Object,toObject:function(t){return k.ES5Object(u(t))},hide:b,def:s(0),set:l.Symbol?i:b,each:[].forEach});"undefined"!=typeof __e&&(__e=f),"undefined"!=typeof __g&&(__g=l)},function(t,e){t.exports=function(t){return t.FW=!1,t.path=t.core,t}},function(t,e,n){var r=n(7).g,o=n(10)("wks");t.exports=function(t){return o[t]||(o[t]=r.Symbol&&r.Symbol[t]||n(11).safe("Symbol."+t))}},function(t,e,n){var r=n(7),o="__core-js_shared__",i=r.g[o]||(r.g[o]={});t.exports=function(t){return i[t]||(i[t]={})}},function(t,e,n){function r(t){return"Symbol(".concat(void 0===t?"":t,")_",(++o+Math.random()).toString(36))}var o=0;r.safe=n(7).g.Symbol||r,t.exports=r},function(t,e,n){t.exports=n(7).hide},function(t,e,n){var r=n(7).set,o=n(14)(!0),i=n(11).safe("iter"),s=n(15),a=s.step;n(17)(String,"String",function(t){r(this,i,{o:String(t),i:0})},function(){var t,e=this[i],n=e.o,r=e.i;return r>=n.length?a(1):(t=o(n,r),e.i+=t.length,a(0,t))})},function(t,e,n){var r=n(7);t.exports=function(t){return function(e,n){var o,i,s=String(r.assertDefined(e)),a=r.toInteger(n),c=s.length;return 0>a||a>=c?t?"":void 0:(o=s.charCodeAt(a),55296>o||o>56319||a+1===c||(i=s.charCodeAt(a+1))<56320||i>57343?t?s.charAt(a):o:t?s.slice(a,a+2):(o-55296<<10)+(i-56320)+65536)}}},function(t,e,n){"use strict";function r(t,e){o.hide(t,u,e),l in[]&&o.hide(t,l,e)}var o=n(7),i=n(6),s=i.classof,a=n(16),c=a.obj,u=n(9)("iterator"),l="@@iterator",f=n(10)("iterators"),h={};r(h,o.that),t.exports={BUGGY:"keys"in[]&&!("next"in[].keys()),Iterators:f,step:function(t,e){return{value:e,done:!!t}},is:function(t){var e=Object(t),n=o.g.Symbol;return(n&&n.iterator||l)in e||u in e||o.has(f,s(e))},get:function(t){var e,n=o.g.Symbol;return void 0!=t&&(e=t[n&&n.iterator||l]||t[u]||f[s(t)]),a(o.isFunction(e),t," is not iterable!"),c(e.call(t))},set:r,create:function(t,e,n,r){t.prototype=o.create(r||h,{next:o.desc(1,n)}),i.set(t,e+" Iterator")}}},function(t,e,n){function r(t,e,n){if(!t)throw TypeError(n?e+n:e)}var o=n(7);r.def=o.assertDefined,r.fn=function(t){if(!o.isFunction(t))throw TypeError(t+" is not a function!");return t},r.obj=function(t){if(!o.isObject(t))throw TypeError(t+" is not an object!");return t},r.inst=function(t,e,n){if(!(t instanceof e))throw TypeError(n+": use the 'new' operator!");return t},t.exports=r},function(t,e,n){var r=n(18),o=n(12),i=n(7),s=n(6),a=n(15),c=n(9)("iterator"),u="@@iterator",l="keys",f="values",h=a.Iterators;t.exports=function(t,e,n,d,p,v,m){function y(t){function e(e){return new n(e,t)}switch(t){case l:return function(){return e(this)};case f:return function(){return e(this)}}return function(){return e(this)}}a.create(n,e,d);var g,b,k=e+" Iterator",w=t.prototype,x=w[c]||w[u]||p&&w[p],E=x||y(p);if(x){var j=i.getProto(E.call(new t));s.set(j,k,!0),i.FW&&i.has(w,u)&&a.set(j,i.that)}if((i.FW||m)&&a.set(w,E),h[e]=E,h[k]=i.that,p)if(g={keys:v?E:y(l),values:p==f?E:y(f),entries:p!=f?E:y("entries")},m)for(b in g)b in w||o(w,b,g[b]);else r(r.P+r.F*a.BUGGY,e,g)}},function(t,e,n){function r(t,e){return function(){return t.apply(e,arguments)}}function o(t,e,n){var i,u,l,f,h=t&o.G,d=t&o.P,p=h?s:t&o.S?s[e]:(s[e]||{}).prototype,v=h?a:a[e]||(a[e]={});h&&(n=e);for(i in n)u=!(t&o.F)&&p&&i in p,u&&i in v||(l=u?p[i]:n[i],h&&!c(p[i])?f=n[i]:t&o.B&&u?f=r(l,s):t&o.W&&p[i]==l?!function(t){f=function(e){return this instanceof t?new t(e):t(e)},f.prototype=t.prototype}(l):f=d&&c(l)?r(Function.call,l):l,v[i]=f,d&&((v.prototype||(v.prototype={}))[i]=l))}var i=n(7),s=i.g,a=i.core,c=i.isFunction;o.F=1,o.G=2,o.S=4,o.P=8,o.B=16,o.W=32,t.exports=o},function(t,e,n){n(20);var r=n(7),o=n(15).Iterators,i=n(9)("iterator"),s=o.Array,a=r.g.NodeList,c=r.g.HTMLCollection,u=a&&a.prototype,l=c&&c.prototype;r.FW&&(!a||i in u||r.hide(u,i,s),!c||i in l||r.hide(l,i,s)),o.NodeList=o.HTMLCollection=s},function(t,e,n){var r=n(7),o=n(21),i=n(11).safe("iter"),s=n(15),a=s.step,c=s.Iterators;n(17)(Array,"Array",function(t,e){r.set(this,i,{o:r.toObject(t),i:0,k:e})},function(){var t=this[i],e=t.o,n=t.k,r=t.i++;return!e||r>=e.length?(t.o=void 0,a(1)):"keys"==n?a(0,r):"values"==n?a(0,e[r]):a(0,[r,e[r]])},"values"),c.Arguments=c.Array,o("keys"),o("values"),o("entries")},function(t,e){t.exports=function(){}},function(t,e,n){"use strict";function r(t){var e=new I(function(){});return t&&(e.constructor=Object),I.resolve(e)===e}function o(t){return A(t)&&(M?"Promise"==v.classof(t):E in t)}function i(t,e){return d.FW||t!==I||e!==h?k(t,e):!0}function s(t){var e=P(t)[x];return void 0!=e?e:t}function a(t){var e;return A(t)&&(e=t.then),L(e)?e:!1}function c(t){var e=t.c;e.length&&_.call(C,function(){function n(e){var n,i,s=o?e.ok:e.fail;try{s?(o||(t.h=!0),n=s===!0?r:s(r),n===e.P?e.rej(TypeError("Promise-chain cycle")):(i=a(n))?i.call(n,e.res,e.rej):e.res(n)):e.rej(r)}catch(c){e.rej(c)}}for(var r=t.v,o=1==t.s,i=0;e.length>i;)n(e[i++]);e.length=0})}function u(t){var e,n=t[E],r=n.a||n.c,o=0;if(n.h)return!1;for(;r.length>o;)if(e=r[o++],e.fail||!u(e.P))return!1;return!0}function l(t){var e,n=this;n.d||(n.d=!0,n=n.r||n,n.v=t,n.s=2,n.a=n.c.slice(),setTimeout(function(){_.call(C,function(){u(e=n.p)&&(S?O.emit("unhandledRejection",t,e):C.console&&console.error&&console.error("Unhandled promise rejection",t)),n.a=void 0})},1),c(n))}function f(t){var e,n=this;if(!n.d){n.d=!0,n=n.r||n;try{(e=a(t))?_.call(C,function(){var r={r:n,d:!1};try{e.call(t,p(f,r,1),p(l,r,1))}catch(o){l.call(r,o)}}):(n.v=t,n.s=1,c(n))}catch(r){l.call({r:n,d:!1},r)}}}var h,d=n(7),p=n(24),v=n(6),m=n(18),y=n(16),g=n(25),b=n(27).set,k=n(23),w=n(28),x=n(9)("species"),E=n(11).safe("record"),j="Promise",C=d.g,O=C.process,S="process"==v(O),_=O&&O.nextTick||n(29).set,I=C[j],L=d.isFunction,A=d.isObject,T=y.fn,P=y.obj,M=function(){function t(e){var n=new I(e);return b(n,t.prototype),n}var e=!1;try{if(e=L(I)&&L(I.resolve)&&r(),b(t,I),t.prototype=d.create(I.prototype,{constructor:{value:t}}),t.resolve(5).then(function(){})instanceof t||(e=!1),e&&d.DESC){var n=!1;I.resolve(d.setDesc({},"then",{get:function(){n=!0}})),e=n}}catch(o){e=!1}return e}();M||(I=function(t){T(t);var e={p:y.inst(this,I,j),c:[],a:void 0,s:0,d:!1,v:void 0,h:!1};d.hide(this,E,e);try{t(p(f,e,1),p(l,e,1))}catch(n){l.call(e,n)}},n(32)(I.prototype,{then:function(t,e){var n=P(P(this).constructor)[x],r={ok:L(t)?t:!0,fail:L(e)?e:!1},o=r.P=new(void 0!=n?n:I)(function(t,e){r.res=T(t),r.rej=T(e)}),i=this[E];return i.c.push(r),i.a&&i.a.push(r),i.s&&c(i),o},"catch":function(t){return this.then(void 0,t)}})),m(m.G+m.W+m.F*!M,{Promise:I}),v.set(I,j),w(I),w(h=d.core[j]),m(m.S+m.F*!M,j,{reject:function(t){return new(s(this))(function(e,n){n(t)})}}),m(m.S+m.F*(!M||r(!0)),j,{resolve:function(t){return o(t)&&i(t.constructor,this)?t:new this(function(e){e(t)})}}),m(m.S+m.F*!(M&&n(33)(function(t){I.all(t)["catch"](function(){})})),j,{all:function(t){var e=s(this),n=[];return new e(function(r,o){g(t,!1,n.push,n);var i=n.length,s=Array(i);i?d.each.call(n,function(t,n){e.resolve(t).then(function(t){s[n]=t,--i||r(s)},o)}):r(s)})},race:function(t){var e=s(this);return new e(function(n,r){g(t,!1,function(t){e.resolve(t).then(n,r)})})}})},function(t,e){t.exports=Object.is||function(t,e){return t===e?0!==t||1/t===1/e:t!=t&&e!=e}},function(t,e,n){var r=n(16).fn;t.exports=function(t,e,n){if(r(t),~n&&void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,r){return t.call(e,n,r)};case 3:return function(n,r,o){return t.call(e,n,r,o)}}return function(){return t.apply(e,arguments)}}},function(t,e,n){var r=n(24),o=n(15).get,i=n(26);t.exports=function(t,e,n,s){for(var a,c=o(t),u=r(n,s,e?2:1);!(a=c.next()).done;)if(i(c,u,a.value,e)===!1)return i.close(c)}},function(t,e,n){function r(t){var e=t["return"];void 0!==e&&i(e.call(t))}function o(t,e,n,o){try{return o?e(i(n)[0],n[1]):e(n)}catch(s){throw r(t),s}}var i=n(16).obj;o.close=r,t.exports=o},function(t,e,n){function r(t,e){i.obj(t),i(null===e||o.isObject(e),e,": can't set as prototype!")}var o=n(7),i=n(16);t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,e){try{e=n(24)(Function.call,o.getDesc(Object.prototype,"__proto__").set,2),e({},[])}catch(i){t=!0}return function(n,o){return r(n,o),t?n.__proto__=o:e(n,o),n}}():void 0),check:r}},function(t,e,n){var r=n(7),o=n(9)("species");t.exports=function(t){!r.DESC||o in t||r.setDesc(t,o,{configurable:!0,get:r.that})}},function(t,e,n){"use strict";function r(){var t=+this;if(c.has(w,t)){var e=w[t];delete w[t],e()}}function o(t){r.call(t.data)}var i,s,a,c=n(7),u=n(24),l=n(6),f=n(30),h=n(31),d=c.g,p=c.isFunction,v=c.html,m=d.process,y=d.setImmediate,g=d.clearImmediate,b=d.MessageChannel,k=0,w={},x="onreadystatechange";p(y)&&p(g)||(y=function(t){for(var e=[],n=1;arguments.length>n;)e.push(arguments[n++]);return w[++k]=function(){f(p(t)?t:Function(t),e)},i(k),k},g=function(t){delete w[t]},"process"==l(m)?i=function(t){m.nextTick(u(r,t,1))}:d.addEventListener&&p(d.postMessage)&&!d.importScripts?(i=function(t){d.postMessage(t,"*")},d.addEventListener("message",o,!1)):p(b)?(s=new b,a=s.port2,s.port1.onmessage=o,i=u(a.postMessage,a,1)):i=x in h("script")?function(t){v.appendChild(h("script"))[x]=function(){v.removeChild(this),r.call(t)}}:function(t){setTimeout(u(r,t,1),0)}),t.exports={set:y,clear:g}},function(t,e){t.exports=function(t,e,n){var r=void 0===n;switch(e.length){case 0:return r?t():t.call(n);case 1:return r?t(e[0]):t.call(n,e[0]);case 2:return r?t(e[0],e[1]):t.call(n,e[0],e[1]);case 3:return r?t(e[0],e[1],e[2]):t.call(n,e[0],e[1],e[2]);case 4:return r?t(e[0],e[1],e[2],e[3]):t.call(n,e[0],e[1],e[2],e[3]);case 5:return r?t(e[0],e[1],e[2],e[3],e[4]):t.call(n,e[0],e[1],e[2],e[3],e[4])}return t.apply(n,e)}},function(t,e,n){var r=n(7),o=r.g.document,i=r.isObject,s=i(o)&&i(o.createElement);t.exports=function(t){return s?o.createElement(t):{}}},function(t,e,n){var r=n(12);t.exports=function(t,e){for(var n in e)r(t,n,e[n]);return t}},function(t,e,n){var r=n(9)("iterator"),o=!1;try{var i=[7][r]();i["return"]=function(){o=!0},Array.from(i,function(){throw 2})}catch(s){}t.exports=function(t){if(!o)return!1;var e=!1;try{var n=[7],i=n[r]();i.next=function(){e=!0},n[r]=function(){return i},t(n)}catch(s){}return e}},function(t,e,n){"use strict";var r=n(35)["default"];e["default"]=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),r(t,o.key,o)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),e.__esModule=!0},function(t,e,n){t.exports={"default":n(36),__esModule:!0}},function(t,e,n){var r=n(7);t.exports=function(t,e,n){return r.setDesc(t,e,n)}},function(t,e){"use strict";e["default"]=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},e.__esModule=!0},function(t,e,n){t.exports={"default":n(39),__esModule:!0}},function(t,e,n){n(13),n(40),t.exports=n(7).core.Array.from},function(t,e,n){var r=n(7),o=n(24),i=n(18),s=n(15),a=n(26);i(i.S+i.F*!n(33)(function(t){Array.from(t)}),"Array",{from:function(t){var e,n,i,c,u=Object(r.assertDefined(t)),l=arguments[1],f=void 0!==l,h=f?o(l,arguments[2],2):void 0,d=0;if(s.is(u))for(c=s.get(u),n=new("function"==typeof this?this:Array);!(i=c.next()).done;d++)n[d]=f?a(c,h,[i.value,d],!0):i.value;else for(n=new("function"==typeof this?this:Array)(e=r.toLength(u.length));e>d;d++)n[d]=f?h(u[d],d):u[d];return n.length=d,n}})},function(t,e,n){t.exports={"default":n(42),__esModule:!0}},function(t,e,n){n(43),t.exports=n(7).core.Object.assign},function(t,e,n){var r=n(18);r(r.S,"Object",{assign:n(44)})},function(t,e,n){var r=n(7),o=n(45);t.exports=Object.assign||function(t,e){for(var n=Object(r.assertDefined(t)),i=arguments.length,s=1;i>s;)for(var a,c=r.ES5Object(arguments[s++]),u=o(c),l=u.length,f=0;l>f;)n[a=u[f++]]=c[a];return n}},function(t,e,n){var r=n(7);t.exports=function(t){var e=r.getKeys(t),n=r.getDesc,o=r.getSymbols;return o&&r.each.call(o(t),function(r){n(t,r).enumerable&&e.push(r)}),e}},function(t,e){"use strict";function n(t){var e=/^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/,n=t.match(e);if(n){var r=parseInt(n[1],10)||0,o=parseInt(n[2],10)||0,i=parseInt(n[3],10)||0;return 60*r*60*1e3+60*o*1e3+1e3*i}throw new Error("Timecode could not be parsed.")}function r(t){return 10>t?"0"+t:""+t}function o(t){var e=Math.floor(t/36e5),n=Math.floor(t/6e4%60),o=Math.floor(t/1e3%60),i=r(e),s=r(n),a=r(o);return e?i+":"+s+":"+a:s+":"+a}Object.defineProperty(e,"__esModule",{value:!0}),e.toMilliseconds=n,e.toTimecode=o},function(t,e,n){"use strict";var r=n(2),o=n(48),i=new r.Player({clientId:"aa97dc0ebed982bfcd02ef939f2149cc",scrubberEl:document.getElementById("scrubber"),timeEl:document.getElementById("time"),tracksEl:document.getElementById("tracks"),controlsEl:document.getElementById("controls"),onWaveformCreate:function(t){var e=new o.Waveform({container:document.getElementById("scrubber"),clientId:"aa97dc0ebed982bfcd02ef939f2149cc",track:t});return e}});i.at("6743445","01:00",function(){console.log("hello")}),i.addSets("34714944").then(function(t){console.log(t)})},function(t,e,n){"use strict";var r=n(34)["default"],o=n(37)["default"],i=n(49)["default"];Object.defineProperty(e,"__esModule",{value:!0});var s=n(50),a=i(s),c=function(){function t(e){o(this,t),this.container=e.container,this.clientId=e.clientId,this.track=e.track,this.element=this.createCanvas(e),this.context=this.element.getContext("2d"),this.width=parseInt(this.context.canvas.width,10),this.height=parseInt(this.context.canvas.height,10),this.innerColor=e.innerColor||"seagreen",this.backgroundColor=e.backgroundColor||"#d9d9d9",this.outerColor=e.outerColor||"#fff",this.playing=!1,this.getWaveform()}return r(t,[{key:"createCanvas",value:function(t){var e=document.createElement("canvas");return e.width=t.width||this.container.clientWidth,e.height=t.height||this.container.clientHeight,e}},{key:"getWaveform",value:function(){var t=this;return a["default"](this.clientId,this.track.uri,function(e,n){t.data=n,t.draw()})}},{key:"clear",value:function(){return this.context.fillStyle=this.outerColor,this.context.clearRect(0,0,this.width,this.height),this.context.fillRect(0,0,this.width,this.height)}},{key:"linearInterpolate",value:function(t,e,n){return t+(e-t)*n}},{key:"interpolate",value:function(t,e){var n=[],r=(t.length-1)/(e-1),o=1;for(n[0]=t[0];e-1>o;){var i=o*r,s=Math.floor(i).toFixed(),a=Math.ceil(i).toFixed(),c=i-s;n[o]=this.linearInterpolate(t[s],t[a],c),o++}return n[e-1]=t[t.length-1],n}},{key:"whileplaying",value:function(t){this.playing=!0,this.draw(t)}},{key:"draw",value:function(t){var e=this.height/2,n=this.interpolate(this.data,this.width),r=this.width/n.length,o=[];this.playing||(this.context.fillStyle=this.backgroundColor);for(var i=0;i<n.length;i++){var s=n[i],a=2*r,c=e*s*2;this.playing?i/this.width<t.position/t.durationEstimate&&(this.context.fillStyle=this.innerColor,this.context.clearRect(r*i,e-e*s,a,c),this.context.fillRect(r*i,e-e*s,a,c),i++):(this.context.clearRect(r*i,e-e*s,a,c),this.context.fillRect(r*i,e-e*s,a,c),o.push(i++))}return o}}]),t}();e.Waveform=c},function(t,e){"use strict";e["default"]=function(t){return t&&t.__esModule?t:{"default":t}},e.__esModule=!0},function(t,e,n){function r(t,e,n){function r(t){function e(t){delete window[o],i(r),n(null,t)}var r=document.createElement("script"),o=u+c++,a="http://www.waveformjs.org/w?"+s.stringify({url:t,callback:o});r.src=a,document.body.appendChild(r),window[o]=e}var l=a.parse(e).hostname;return-1!==l.indexOf("sndcdn.com")?r(e):void o(t,e,function(t,e){return t?n(t):void r(e.waveform_url)})}var o=n(51),i=n(58),s=n(52),a=n(59);t.exports=r;var c=Math.floor(1e6*Math.random()),u="soundcloud_waveform_"},function(t,e,n){function r(t,e,n){var r="http://api.soundcloud.com/resolve.json?"+o.stringify({url:e,client_id:t});i({uri:r,method:"GET"},function(e,r,o){if(e)return n(e);try{o=JSON.parse(o)}catch(i){return n(i)}if(o.errors)return n(new Error(o.errors[0].error_message));var s="track"===o.kind&&o.stream_url+"?client_id="+t;return n(null,o,s)})}var o=n(52),i=n(55);t.exports=r},function(t,e,n){"use strict";e.decode=e.parse=n(53),e.encode=e.stringify=n(54)},function(t,e){"use strict";function n(t,e){return Object.prototype.hasOwnProperty.call(t,e)}t.exports=function(t,e,r,o){e=e||"&",r=r||"=";var i={};if("string"!=typeof t||0===t.length)return i;var s=/\+/g;t=t.split(e);var a=1e3;o&&"number"==typeof o.maxKeys&&(a=o.maxKeys);var c=t.length;a>0&&c>a&&(c=a);for(var u=0;c>u;++u){var l,f,h,d,p=t[u].replace(s,"%20"),v=p.indexOf(r);v>=0?(l=p.substr(0,v),f=p.substr(v+1)):(l=p,f=""),h=decodeURIComponent(l),d=decodeURIComponent(f),n(i,h)?Array.isArray(i[h])?i[h].push(d):i[h]=[i[h],d]:i[h]=d}return i}},function(t,e){"use strict";var n=function(t){switch(typeof t){case"string":return t;case"boolean":return t?"true":"false";case"number":return isFinite(t)?t:"";default:return""}};t.exports=function(t,e,r,o){return e=e||"&",r=r||"=",null===t&&(t=void 0),"object"==typeof t?Object.keys(t).map(function(o){var i=encodeURIComponent(n(o))+r;return Array.isArray(t[o])?t[o].map(function(t){return i+encodeURIComponent(n(t))}).join(e):i+encodeURIComponent(n(t[o]))}).join(e):o?encodeURIComponent(n(o))+r+encodeURIComponent(n(t)):""}},function(t,e,n){function r(t,e){function n(){4===l.readyState&&r()}function r(){var t=null,n=l.statusCode=l.status,r=l.body=l.response||l.responseText||l.responseXML;if(0===n||n>=400&&600>n){var o=l.responseText||a[String(l.status).charAt(0)];t=new Error(o),t.statusCode=l.status}if(v)try{r=l.body=JSON.parse(r)}catch(i){}e(t,l,r)}function i(t){e(t,l)}"string"==typeof t&&(t={uri:t}),t=t||{},e=s(e);var l;l=t.cors?new u:new c;var f=l.url=t.uri,h=l.method=t.method||"GET",d=t.body||t.data,p=l.headers=t.headers||{},v=!1;return"json"in t&&(v=!0,p["Content-Type"]="application/json",d=JSON.stringify(t.json)),l.onreadystatechange=n,l.onload=r,l.onerror=i,l.onprogress=function(){},l.ontimeout=o,l.open(h,f),t.cors&&(l.withCredentials=!0),l.timeout="timeout"in t?t.timeout:5e3,l.setRequestHeader&&Object.keys(p).forEach(function(t){l.setRequestHeader(t,p[t])}),l.send(d),l}function o(){}var i=n(56),s=n(57),a={0:"Internal XMLHttpRequest Error",4:"4xx Client Error",5:"5xx Server Error"},c=i.XMLHttpRequest||o,u="withCredentials"in new c?i.XMLHttpRequest:i.XDomainRequest;t.exports=r},function(t,e){(function(e){"undefined"!=typeof window?t.exports=window:"undefined"!=typeof e?t.exports=e:t.exports={}}).call(e,function(){return this}())},function(t,e){function n(t){var e=!1;return function(){return e?void 0:(e=!0,t.apply(this,arguments))}}t.exports=n,n.proto=n(function(){Object.defineProperty(Function.prototype,"once",{value:function(){return n(this)},configurable:!0})})},function(t,e){function n(t){return t&&t.parentNode&&t.parentNode.removeChild(t),t}t.exports=n},function(t,e,n){function r(){this.protocol=null,this.slashes=null,this.auth=null,this.host=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.query=null,this.pathname=null,this.path=null,this.href=null}function o(t,e,n){if(t&&u(t)&&t instanceof r)return t;var o=new r;return o.parse(t,e,n),o}function i(t){return c(t)&&(t=o(t)),t instanceof r?t.format():r.prototype.format.call(t)}function s(t,e){return o(t,!1,!0).resolve(e)}function a(t,e){return t?o(t,!1,!0).resolveObject(e):e}function c(t){return"string"==typeof t}function u(t){return"object"==typeof t&&null!==t}function l(t){return null===t}function f(t){return null==t}var h=n(60);e.parse=o,e.resolve=s,e.resolveObject=a,e.format=i,e.Url=r;var d=/^([a-z0-9.+-]+:)/i,p=/:[0-9]*$/,v=["<",">",'"',"`"," ","\r","\n","	"],m=["{","}","|","\\","^","`"].concat(v),y=["'"].concat(m),g=["%","/","?",";","#"].concat(y),b=["/","?","#"],k=255,w=/^[a-z0-9A-Z_-]{0,63}$/,x=/^([a-z0-9A-Z_-]{0,63})(.*)$/,E={javascript:!0,"javascript:":!0},j={javascript:!0,"javascript:":!0},C={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,"http:":!0,"https:":!0,"ftp:":!0,"gopher:":!0,"file:":!0},O=n(52);r.prototype.parse=function(t,e,n){if(!c(t))throw new TypeError("Parameter 'url' must be a string, not "+typeof t);var r=t;r=r.trim();var o=d.exec(r);if(o){o=o[0];var i=o.toLowerCase();this.protocol=i,r=r.substr(o.length)}if(n||o||r.match(/^\/\/[^@\/]+@[^@\/]+/)){var s="//"===r.substr(0,2);!s||o&&j[o]||(r=r.substr(2),this.slashes=!0)}if(!j[o]&&(s||o&&!C[o])){for(var a=-1,u=0;u<b.length;u++){var l=r.indexOf(b[u]);-1!==l&&(-1===a||a>l)&&(a=l)}var f,p;p=-1===a?r.lastIndexOf("@"):r.lastIndexOf("@",a),-1!==p&&(f=r.slice(0,p),r=r.slice(p+1),this.auth=decodeURIComponent(f)),a=-1;for(var u=0;u<g.length;u++){var l=r.indexOf(g[u]);-1!==l&&(-1===a||a>l)&&(a=l)}-1===a&&(a=r.length),this.host=r.slice(0,a),r=r.slice(a),this.parseHost(),this.hostname=this.hostname||"";var v="["===this.hostname[0]&&"]"===this.hostname[this.hostname.length-1];if(!v)for(var m=this.hostname.split(/\./),u=0,S=m.length;S>u;u++){var _=m[u];if(_&&!_.match(w)){for(var I="",L=0,A=_.length;A>L;L++)I+=_.charCodeAt(L)>127?"x":_[L];if(!I.match(w)){var T=m.slice(0,u),P=m.slice(u+1),M=_.match(x);M&&(T.push(M[1]),P.unshift(M[2])),P.length&&(r="/"+P.join(".")+r),this.hostname=T.join(".");break}}}if(this.hostname.length>k?this.hostname="":this.hostname=this.hostname.toLowerCase(),!v){for(var F=this.hostname.split("."),D=[],u=0;u<F.length;++u){var W=F[u];D.push(W.match(/[^A-Za-z0-9_-]/)?"xn--"+h.encode(W):W)}this.hostname=D.join(".")}var N=this.port?":"+this.port:"",R=this.hostname||"";this.host=R+N,this.href+=this.host,v&&(this.hostname=this.hostname.substr(1,this.hostname.length-2),"/"!==r[0]&&(r="/"+r))}if(!E[i])for(var u=0,S=y.length;S>u;u++){var q=y[u],U=encodeURIComponent(q);U===q&&(U=escape(q)),r=r.split(q).join(U)}var H=r.indexOf("#");-1!==H&&(this.hash=r.substr(H),r=r.slice(0,H));var G=r.indexOf("?");if(-1!==G?(this.search=r.substr(G),this.query=r.substr(G+1),e&&(this.query=O.parse(this.query)),r=r.slice(0,G)):e&&(this.search="",this.query={}),r&&(this.pathname=r),C[i]&&this.hostname&&!this.pathname&&(this.pathname="/"),this.pathname||this.search){var N=this.pathname||"",W=this.search||"";this.path=N+W}return this.href=this.format(),this},r.prototype.format=function(){var t=this.auth||"";t&&(t=encodeURIComponent(t),t=t.replace(/%3A/i,":"),t+="@");var e=this.protocol||"",n=this.pathname||"",r=this.hash||"",o=!1,i="";this.host?o=t+this.host:this.hostname&&(o=t+(-1===this.hostname.indexOf(":")?this.hostname:"["+this.hostname+"]"),this.port&&(o+=":"+this.port)),this.query&&u(this.query)&&Object.keys(this.query).length&&(i=O.stringify(this.query));var s=this.search||i&&"?"+i||"";
return e&&":"!==e.substr(-1)&&(e+=":"),this.slashes||(!e||C[e])&&o!==!1?(o="//"+(o||""),n&&"/"!==n.charAt(0)&&(n="/"+n)):o||(o=""),r&&"#"!==r.charAt(0)&&(r="#"+r),s&&"?"!==s.charAt(0)&&(s="?"+s),n=n.replace(/[?#]/g,function(t){return encodeURIComponent(t)}),s=s.replace("#","%23"),e+o+n+s+r},r.prototype.resolve=function(t){return this.resolveObject(o(t,!1,!0)).format()},r.prototype.resolveObject=function(t){if(c(t)){var e=new r;e.parse(t,!1,!0),t=e}var n=new r;if(Object.keys(this).forEach(function(t){n[t]=this[t]},this),n.hash=t.hash,""===t.href)return n.href=n.format(),n;if(t.slashes&&!t.protocol)return Object.keys(t).forEach(function(e){"protocol"!==e&&(n[e]=t[e])}),C[n.protocol]&&n.hostname&&!n.pathname&&(n.path=n.pathname="/"),n.href=n.format(),n;if(t.protocol&&t.protocol!==n.protocol){if(!C[t.protocol])return Object.keys(t).forEach(function(e){n[e]=t[e]}),n.href=n.format(),n;if(n.protocol=t.protocol,t.host||j[t.protocol])n.pathname=t.pathname;else{for(var o=(t.pathname||"").split("/");o.length&&!(t.host=o.shift()););t.host||(t.host=""),t.hostname||(t.hostname=""),""!==o[0]&&o.unshift(""),o.length<2&&o.unshift(""),n.pathname=o.join("/")}if(n.search=t.search,n.query=t.query,n.host=t.host||"",n.auth=t.auth,n.hostname=t.hostname||t.host,n.port=t.port,n.pathname||n.search){var i=n.pathname||"",s=n.search||"";n.path=i+s}return n.slashes=n.slashes||t.slashes,n.href=n.format(),n}var a=n.pathname&&"/"===n.pathname.charAt(0),u=t.host||t.pathname&&"/"===t.pathname.charAt(0),h=u||a||n.host&&t.pathname,d=h,p=n.pathname&&n.pathname.split("/")||[],o=t.pathname&&t.pathname.split("/")||[],v=n.protocol&&!C[n.protocol];if(v&&(n.hostname="",n.port=null,n.host&&(""===p[0]?p[0]=n.host:p.unshift(n.host)),n.host="",t.protocol&&(t.hostname=null,t.port=null,t.host&&(""===o[0]?o[0]=t.host:o.unshift(t.host)),t.host=null),h=h&&(""===o[0]||""===p[0])),u)n.host=t.host||""===t.host?t.host:n.host,n.hostname=t.hostname||""===t.hostname?t.hostname:n.hostname,n.search=t.search,n.query=t.query,p=o;else if(o.length)p||(p=[]),p.pop(),p=p.concat(o),n.search=t.search,n.query=t.query;else if(!f(t.search)){if(v){n.hostname=n.host=p.shift();var m=n.host&&n.host.indexOf("@")>0?n.host.split("@"):!1;m&&(n.auth=m.shift(),n.host=n.hostname=m.shift())}return n.search=t.search,n.query=t.query,l(n.pathname)&&l(n.search)||(n.path=(n.pathname?n.pathname:"")+(n.search?n.search:"")),n.href=n.format(),n}if(!p.length)return n.pathname=null,n.search?n.path="/"+n.search:n.path=null,n.href=n.format(),n;for(var y=p.slice(-1)[0],g=(n.host||t.host)&&("."===y||".."===y)||""===y,b=0,k=p.length;k>=0;k--)y=p[k],"."==y?p.splice(k,1):".."===y?(p.splice(k,1),b++):b&&(p.splice(k,1),b--);if(!h&&!d)for(;b--;b)p.unshift("..");!h||""===p[0]||p[0]&&"/"===p[0].charAt(0)||p.unshift(""),g&&"/"!==p.join("/").substr(-1)&&p.push("");var w=""===p[0]||p[0]&&"/"===p[0].charAt(0);if(v){n.hostname=n.host=w?"":p.length?p.shift():"";var m=n.host&&n.host.indexOf("@")>0?n.host.split("@"):!1;m&&(n.auth=m.shift(),n.host=n.hostname=m.shift())}return h=h||n.host&&p.length,h&&!w&&p.unshift(""),p.length?n.pathname=p.join("/"):(n.pathname=null,n.path=null),l(n.pathname)&&l(n.search)||(n.path=(n.pathname?n.pathname:"")+(n.search?n.search:"")),n.auth=t.auth||n.auth,n.slashes=n.slashes||t.slashes,n.href=n.format(),n},r.prototype.parseHost=function(){var t=this.host,e=p.exec(t);e&&(e=e[0],":"!==e&&(this.port=e.substr(1)),t=t.substr(0,t.length-e.length)),t&&(this.hostname=t)}},function(t,e,n){var r;(function(t,o){!function(i){function s(t){throw RangeError(T[t])}function a(t,e){for(var n=t.length,r=[];n--;)r[n]=e(t[n]);return r}function c(t,e){var n=t.split("@"),r="";n.length>1&&(r=n[0]+"@",t=n[1]),t=t.replace(A,".");var o=t.split("."),i=a(o,e).join(".");return r+i}function u(t){for(var e,n,r=[],o=0,i=t.length;i>o;)e=t.charCodeAt(o++),e>=55296&&56319>=e&&i>o?(n=t.charCodeAt(o++),56320==(64512&n)?r.push(((1023&e)<<10)+(1023&n)+65536):(r.push(e),o--)):r.push(e);return r}function l(t){return a(t,function(t){var e="";return t>65535&&(t-=65536,e+=F(t>>>10&1023|55296),t=56320|1023&t),e+=F(t)}).join("")}function f(t){return 10>t-48?t-22:26>t-65?t-65:26>t-97?t-97:w}function h(t,e){return t+22+75*(26>t)-((0!=e)<<5)}function d(t,e,n){var r=0;for(t=n?M(t/C):t>>1,t+=M(t/e);t>P*E>>1;r+=w)t=M(t/P);return M(r+(P+1)*t/(t+j))}function p(t){var e,n,r,o,i,a,c,u,h,p,v=[],m=t.length,y=0,g=S,b=O;for(n=t.lastIndexOf(_),0>n&&(n=0),r=0;n>r;++r)t.charCodeAt(r)>=128&&s("not-basic"),v.push(t.charCodeAt(r));for(o=n>0?n+1:0;m>o;){for(i=y,a=1,c=w;o>=m&&s("invalid-input"),u=f(t.charCodeAt(o++)),(u>=w||u>M((k-y)/a))&&s("overflow"),y+=u*a,h=b>=c?x:c>=b+E?E:c-b,!(h>u);c+=w)p=w-h,a>M(k/p)&&s("overflow"),a*=p;e=v.length+1,b=d(y-i,e,0==i),M(y/e)>k-g&&s("overflow"),g+=M(y/e),y%=e,v.splice(y++,0,g)}return l(v)}function v(t){var e,n,r,o,i,a,c,l,f,p,v,m,y,g,b,j=[];for(t=u(t),m=t.length,e=S,n=0,i=O,a=0;m>a;++a)v=t[a],128>v&&j.push(F(v));for(r=o=j.length,o&&j.push(_);m>r;){for(c=k,a=0;m>a;++a)v=t[a],v>=e&&c>v&&(c=v);for(y=r+1,c-e>M((k-n)/y)&&s("overflow"),n+=(c-e)*y,e=c,a=0;m>a;++a)if(v=t[a],e>v&&++n>k&&s("overflow"),v==e){for(l=n,f=w;p=i>=f?x:f>=i+E?E:f-i,!(p>l);f+=w)b=l-p,g=w-p,j.push(F(h(p+b%g,0))),l=M(b/g);j.push(F(h(l,0))),i=d(n,y,r==o),n=0,++r}++n,++e}return j.join("")}function m(t){return c(t,function(t){return I.test(t)?p(t.slice(4).toLowerCase()):t})}function y(t){return c(t,function(t){return L.test(t)?"xn--"+v(t):t})}var g=("object"==typeof e&&e&&!e.nodeType&&e,"object"==typeof t&&t&&!t.nodeType&&t,"object"==typeof o&&o);(g.global===g||g.window===g||g.self===g)&&(i=g);var b,k=2147483647,w=36,x=1,E=26,j=38,C=700,O=72,S=128,_="-",I=/^xn--/,L=/[^\x20-\x7E]/,A=/[\x2E\u3002\uFF0E\uFF61]/g,T={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},P=w-x,M=Math.floor,F=String.fromCharCode;b={version:"1.3.2",ucs2:{decode:u,encode:l},decode:p,encode:v,toASCII:y,toUnicode:m},r=function(){return b}.call(e,n,e,t),!(void 0!==r&&(t.exports=r))}(this)}).call(e,n(61)(t),function(){return this}())},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children=[],t.webpackPolyfill=1),t}}]);