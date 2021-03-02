/**
 * @license
 *
 * Push v1.0.9
 * =========
 * A compact, cross-browser solution for the JavaScript Notifications API
 *
 * Credits
 * -------
 * Tsvetan Tsvetkov (ttsvetko)
 * Alex Gibson (alexgibson)
 *
 * License
 * -------
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015-2017 Tyler Nickerson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * @license
 *
 * Push v1.0.9
 * =========
 * A compact, cross-browser solution for the JavaScript Notifications API
 *
 * Credits
 * -------
 * Tsvetan Tsvetkov (ttsvetko)
 * Alex Gibson (alexgibson)
 *
 * License
 * -------
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015-2017 Tyler Nickerson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?module.exports=i():"function"==typeof define&&define.amd?define(i):(t=t||self).Push=i()}(this,(function(){"use strict";var t={errors:{incompatible:"".concat("PushError:"," Push.js is incompatible with browser."),invalid_plugin:"".concat("PushError:"," plugin class missing from plugin manifest (invalid plugin). Please check the documentation."),invalid_title:"".concat("PushError:"," title of notification must be a string"),permission_denied:"".concat("PushError:"," permission request declined"),sw_notification_error:"".concat("PushError:"," could not show a ServiceWorker notification due to the following reason: "),sw_registration_error:"".concat("PushError:"," could not register the ServiceWorker due to the following reason: "),unknown_interface:"".concat("PushError:"," unable to create notification: unknown interface")}};function i(t){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function n(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}function e(t,i){for(var n=0;n<i.length;n++){var e=i[n];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(t,e.key,e)}}function o(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}function r(t,i){if("function"!=typeof i&&null!==i)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(i&&i.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),i&&c(t,i)}function s(t){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function c(t,i){return(c=Object.setPrototypeOf||function(t,i){return t.__proto__=i,t})(t,i)}function a(t,i){return!i||"object"!=typeof i&&"function"!=typeof i?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):i}function u(t){var i=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,e=s(t);if(i){var o=s(this).constructor;n=Reflect.construct(e,arguments,o)}else n=e.apply(this,arguments);return a(this,n)}}var f=function(){function t(i){n(this,t),this._win=i,this.GRANTED="granted",this.DEFAULT="default",this.DENIED="denied",this._permissions=[this.GRANTED,this.DEFAULT,this.DENIED]}return o(t,[{key:"request",value:function(t,i){return arguments.length>0?this._requestWithCallback.apply(this,arguments):this._requestAsPromise()}},{key:"_requestWithCallback",value:function(t,i){var n,e=this,o=this.get(),r=!1,s=function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:e._win.Notification.permission;r||(r=!0,void 0===n&&e._win.webkitNotifications&&(n=e._win.webkitNotifications.checkPermission()),n===e.GRANTED||0===n?t&&t():i&&i())};o!==this.DEFAULT?s(o):this._win.webkitNotifications&&this._win.webkitNotifications.checkPermission?this._win.webkitNotifications.requestPermission(s):this._win.Notification&&this._win.Notification.requestPermission?(n=this._win.Notification.requestPermission(s))&&n.then&&n.then(s).catch((function(){i&&i()})):t&&t()}},{key:"_requestAsPromise",value:function(){var t=this,i=this.get(),n=i!==this.DEFAULT,e=this._win.Notification&&this._win.Notification.requestPermission,o=this._win.webkitNotifications&&this._win.webkitNotifications.checkPermission;return new Promise((function(r,s){var c,a=!1,u=function(i){a||(a=!0,!function(i){return i===t.GRANTED||0===i}(i)?s():r())};n?u(i):o?t._win.webkitNotifications.requestPermission((function(t){u(t)})):e?(c=t._win.Notification.requestPermission(u))&&c.then&&c.then(u).catch(s):r()}))}},{key:"has",value:function(){return this.get()===this.GRANTED}},{key:"get",value:function(){return this._win.Notification&&this._win.Notification.permission?this._win.Notification.permission:this._win.webkitNotifications&&this._win.webkitNotifications.checkPermission?this._permissions[this._win.webkitNotifications.checkPermission()]:navigator.mozNotification?this.GRANTED:this._win.external&&this._win.external.msIsSiteMode?this._win.external.msIsSiteMode()?this.GRANTED:this.DEFAULT:this.GRANTED}}]),t}(),l=function(){function t(){n(this,t)}return o(t,null,[{key:"isUndefined",value:function(t){return void 0===t}},{key:"isNull",value:function(t){return null===obj}},{key:"isString",value:function(t){return"string"==typeof t}},{key:"isFunction",value:function(t){return t&&"[object Function]"==={}.toString.call(t)}},{key:"isObject",value:function(t){return"object"===i(t)}},{key:"objectMerge",value:function(t,i){for(var n in i)t.hasOwnProperty(n)&&this.isObject(t[n])&&this.isObject(i[n])?this.objectMerge(t[n],i[n]):t[n]=i[n]}}]),t}(),h=function t(i){n(this,t),this._win=i},v=function(t){r(e,t);var i=u(e);function e(){return n(this,e),i.apply(this,arguments)}return o(e,[{key:"isSupported",value:function(){return void 0!==this._win.Notification}},{key:"create",value:function(t,i){return new this._win.Notification(t,{icon:l.isString(i.icon)||l.isUndefined(i.icon)||l.isNull(i.icon)?i.icon:i.icon.x32,body:i.body,tag:i.tag,requireInteraction:i.requireInteraction})}},{key:"close",value:function(t){t.close()}}]),e}(h),_=function(i){r(s,i);var e=u(s);function s(){return n(this,s),e.apply(this,arguments)}return o(s,[{key:"isSupported",value:function(){return void 0!==this._win.navigator&&void 0!==this._win.navigator.serviceWorker}},{key:"getFunctionBody",value:function(t){var i=t.toString().match(/function[^{]+{([\s\S]*)}$/);return null!=i&&i.length>1?i[1]:null}},{key:"create",value:function(i,n,e,o,r){var s=this;this._win.navigator.serviceWorker.register(o),this._win.navigator.serviceWorker.ready.then((function(o){var c={id:i,link:e.link,origin:document.location.href,onClick:l.isFunction(e.onClick)?s.getFunctionBody(e.onClick):"",onClose:l.isFunction(e.onClose)?s.getFunctionBody(e.onClose):""};void 0!==e.data&&null!==e.data&&(c=Object.assign(c,e.data)),o.showNotification(n,{icon:e.icon,body:e.body,vibrate:e.vibrate,tag:e.tag,data:c,requireInteraction:e.requireInteraction,silent:e.silent}).then((function(){o.getNotifications().then((function(t){o.active.postMessage(""),r(t)}))})).catch((function(i){throw new Error(t.errors.sw_notification_error+i.message)}))})).catch((function(i){throw new Error(t.errors.sw_registration_error+i.message)}))}},{key:"close",value:function(){}}]),s}(h),d=function(t){r(e,t);var i=u(e);function e(){return n(this,e),i.apply(this,arguments)}return o(e,[{key:"isSupported",value:function(){return void 0!==this._win.navigator.mozNotification}},{key:"create",value:function(t,i){var n=this._win.navigator.mozNotification.createNotification(t,i.body,i.icon);return n.show(),n}}]),e}(h),p=function(t){r(e,t);var i=u(e);function e(){return n(this,e),i.apply(this,arguments)}return o(e,[{key:"isSupported",value:function(){return void 0!==this._win.external&&void 0!==this._win.external.msIsSiteMode}},{key:"create",value:function(t,i){return this._win.external.msSiteModeClearIconOverlay(),this._win.external.msSiteModeSetIconOverlay(l.isString(i.icon)||l.isUndefined(i.icon)?i.icon:i.icon.x16,t),this._win.external.msSiteModeActivate(),null}},{key:"close",value:function(){this._win.external.msSiteModeClearIconOverlay()}}]),e}(h),w=function(t){r(e,t);var i=u(e);function e(){return n(this,e),i.apply(this,arguments)}return o(e,[{key:"isSupported",value:function(){return void 0!==this._win.webkitNotifications}},{key:"create",value:function(t,i){var n=this._win.webkitNotifications.createNotification(i.icon,t,i.body);return n.show(),n}},{key:"close",value:function(t){t.cancel()}}]),e}(h);return new(function(){function i(t){n(this,i),this._currentId=0,this._notifications={},this._win=t,this.Permission=new f(t),this._agents={desktop:new v(t),chrome:new _(t),firefox:new d(t),ms:new p(t),webkit:new w(t)},this._configuration={serviceWorker:"/serviceWorker.min.js",fallback:function(t){}}}return o(i,[{key:"_closeNotification",value:function(i){var n=!0,e=this._notifications[i];if(void 0!==e){if(n=this._removeNotification(i),this._agents.desktop.isSupported())this._agents.desktop.close(e);else if(this._agents.webkit.isSupported())this._agents.webkit.close(e);else{if(!this._agents.ms.isSupported())throw n=!1,new Error(t.errors.unknown_interface);this._agents.ms.close()}return n}return!1}},{key:"_addNotification",value:function(t){var i=this._currentId;return this._notifications[i]=t,this._currentId++,i}},{key:"_removeNotification",value:function(t){var i=!1;return this._notifications.hasOwnProperty(t)&&(delete this._notifications[t],i=!0),i}},{key:"_prepareNotification",value:function(t,i){var n,e=this;return n={get:function(){return e._notifications[t]},close:function(){e._closeNotification(t)}},i.timeout&&setTimeout((function(){n.close()}),i.timeout),n}},{key:"_serviceWorkerCallback",value:function(t,i,n){var e=this,o=this._addNotification(t[t.length-1]);navigator&&navigator.serviceWorker&&(navigator.serviceWorker.addEventListener("message",(function(t){var i=JSON.parse(t.data);"close"===i.action&&Number.isInteger(i.id)&&e._removeNotification(i.id)})),n(this._prepareNotification(o,i))),n(null)}},{key:"_createCallback",value:function(t,i,n){var e,o=this,r=null;if(i=i||{},e=function(t){o._removeNotification(t),l.isFunction(i.onClose)&&i.onClose.call(o,r)},this._agents.desktop.isSupported())try{r=this._agents.desktop.create(t,i)}catch(e){var s=this._currentId,c=this.config().serviceWorker;this._agents.chrome.isSupported()&&this._agents.chrome.create(s,t,i,c,(function(t){return o._serviceWorkerCallback(t,i,n)}))}else this._agents.webkit.isSupported()?r=this._agents.webkit.create(t,i):this._agents.firefox.isSupported()?this._agents.firefox.create(t,i):this._agents.ms.isSupported()?r=this._agents.ms.create(t,i):(i.title=t,this.config().fallback(i));if(null!==r){var a=this._addNotification(r),u=this._prepareNotification(a,i);l.isFunction(r.addEventListener)&&(l.isFunction(i.onShow)&&r.addEventListener("show",i.onShow),l.isFunction(i.onError)&&r.addEventListener("error",i.onError),l.isFunction(i.onClick)&&r.addEventListener("click",i.onClick),r.addEventListener("close",(function(){e(a)})),r.addEventListener("cancel",(function(){e(a)}))),n(u)}n(null)}},{key:"create",value:function(i,n){var e,o=this;if(!l.isString(i))throw new Error(t.errors.invalid_title);return e=this.Permission.has()?function(t,e){try{o._createCallback(i,n,t)}catch(t){e(t)}}:function(e,r){o.Permission.request().then((function(){o._createCallback(i,n,e)})).catch((function(){r(t.errors.permission_denied)}))},new Promise(e)}},{key:"count",value:function(){var t,i=0;for(t in this._notifications)this._notifications.hasOwnProperty(t)&&i++;return i}},{key:"close",value:function(t){var i;for(i in this._notifications)if(this._notifications.hasOwnProperty(i)&&this._notifications[i].tag===t)return this._closeNotification(i)}},{key:"clear",value:function(){var t,i=!0;for(t in this._notifications)this._notifications.hasOwnProperty(t)&&(i=i&&this._closeNotification(t));return i}},{key:"supported",value:function(){var t=!1;for(var i in this._agents)this._agents.hasOwnProperty(i)&&(t=t||this._agents[i].isSupported());return t}},{key:"config",value:function(t){return(void 0!==t||null!==t&&l.isObject(t))&&l.objectMerge(this._configuration,t),this._configuration}},{key:"extend",value:function(i){var n,e={}.hasOwnProperty;if(!e.call(i,"plugin"))throw new Error(t.errors.invalid_plugin);for(var o in e.call(i,"config")&&l.isObject(i.config)&&null!==i.config&&this.config(i.config),n=new(0,i.plugin)(this.config()))e.call(n,o)&&l.isFunction(n[o])&&(this[o]=n[o])}}]),i}())("undefined"!=typeof window?window:global)}));
//# sourceMappingURL=push.js.map
