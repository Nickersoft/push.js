(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Push = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var errorPrefix = "PushError:";exports.default = { errors: { incompatible: "PushError: Push.js is incompatible with browser.", invalid_plugin: "PushError: plugin class missing from plugin manifest (invalid plugin). Please check the documentation.", invalid_title: "PushError: title of notification must be a string", permission_denied: "PushError: permission request declined", sw_notification_error: "PushError: could not show a ServiceWorker notification due to the following reason: ", sw_registration_error: "PushError: could not register the ServiceWorker due to the following reason: ", unknown_interface: "PushError: unable to create notification: unknown interface" } };

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Permission = function () {
  function Permission(i) {
    _classCallCheck(this, Permission);

    this._win = i, this.DEFAULT = "default", this.GRANTED = "granted", this.DENIED = "denied", this._permissions = [this.GRANTED, this.DEFAULT, this.DENIED];
  }

  _createClass(Permission, [{
    key: "request",
    value: function request(i, t) {
      var _this = this;

      var s = this.get();var n = function n(s) {
        s === _this.GRANTED || 0 === s ? i && i() : t && t();
      };s !== this.DEFAULT ? n(s) : this._win.Notification && this._win.Notification.requestPermission ? this._win.Notification.requestPermission().then(n).catch(function () {
        t && t();
      }) : this._win.webkitNotifications && this._win.webkitNotifications.checkPermission ? this._win.webkitNotifications.requestPermission(n) : i && i();
    }
  }, {
    key: "has",
    value: function has() {
      return this.get() === this.GRANTED;
    }
  }, {
    key: "get",
    value: function get() {
      var i = void 0;return i = this._win.Notification && this._win.Notification.permission ? this._win.Notification.permission : this._win.webkitNotifications && this._win.webkitNotifications.checkPermission ? this._permissions[this._win.webkitNotifications.checkPermission()] : navigator.mozNotification ? this.GRANTED : this._win.external && this._win.external.msIsSiteMode ? this._win.external.msIsSiteMode() ? this.GRANTED : this.DEFAULT : this.GRANTED;
    }
  }]);

  return Permission;
}();

exports.default = Permission;
;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Messages = require("./Messages");

var _Messages2 = _interopRequireDefault(_Messages);

var _Permission = require("./Permission");

var _Permission2 = _interopRequireDefault(_Permission);

var _Util = require("./Util");

var _Util2 = _interopRequireDefault(_Util);

var _DesktopAgent = require("./agents/DesktopAgent");

var _DesktopAgent2 = _interopRequireDefault(_DesktopAgent);

var _MobileChromeAgent = require("./agents/MobileChromeAgent");

var _MobileChromeAgent2 = _interopRequireDefault(_MobileChromeAgent);

var _MobileFirefoxAgent = require("./agents/MobileFirefoxAgent");

var _MobileFirefoxAgent2 = _interopRequireDefault(_MobileFirefoxAgent);

var _MSAgent = require("./agents/MSAgent");

var _MSAgent2 = _interopRequireDefault(_MSAgent);

var _WebKitAgent = require("./agents/WebKitAgent");

var _WebKitAgent2 = _interopRequireDefault(_WebKitAgent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Push = function () {
  function Push(t) {
    _classCallCheck(this, Push);

    this._currentId = 0, this._notifications = {}, this._win = t, this.Permission = new _Permission2.default(t), this._agents = { desktop: new _DesktopAgent2.default(t), chrome: new _MobileChromeAgent2.default(t), firefox: new _MobileFirefoxAgent2.default(t), ms: new _MSAgent2.default(t), webkit: new _WebKitAgent2.default(t) }, this._configuration = { serviceWorker: "./serviceWorker.min.js", fallback: function fallback(t) {} };
  }

  _createClass(Push, [{
    key: "_closeNotification",
    value: function _closeNotification(t) {
      var i = !0;var e = this._notifications[t];if (void 0 !== e) {
        if (i = this._removeNotification(t), this._agents.desktop.isSupported()) this._agents.desktop.close(e);else if (this._agents.webkit.isSupported()) this._agents.webkit.close(e);else {
          if (!this._agents.ms.isSupported()) throw i = !1, new Error(_Messages2.default.errors.unknown_interface);this._agents.ms.close();
        }return i;
      }return !1;
    }
  }, {
    key: "_addNotification",
    value: function _addNotification(t) {
      var i = this._currentId;return this._notifications[i] = t, this._currentId++, i;
    }
  }, {
    key: "_removeNotification",
    value: function _removeNotification(t) {
      var i = !1;return this._notifications.hasOwnProperty(t) && (delete this._notifications[t], i = !0), i;
    }
  }, {
    key: "_prepareNotification",
    value: function _prepareNotification(t, i) {
      var _this = this;

      var e = void 0;return e = { get: function get() {
          return _this._notifications[t];
        }, close: function close() {
          _this._closeNotification(t);
        } }, i.timeout && setTimeout(function () {
        e.close();
      }, i.timeout), e;
    }
  }, {
    key: "_serviceWorkerCallback",
    value: function _serviceWorkerCallback(t, i, e) {
      var _this2 = this;

      var s = this._addNotification(t[t.length - 1]);navigator.serviceWorker.addEventListener("message", function (t) {
        var i = JSON.parse(t.data);"close" === i.action && Number.isInteger(i.id) && _this2._removeNotification(i.id);
      }), e(this._prepareNotification(s, i));
    }
  }, {
    key: "_createCallback",
    value: function _createCallback(t, i, e) {
      var _this3 = this;

      var s = void 0,
          o = null;if (i = i || {}, s = function s(t) {
        _this3._removeNotification(t), _Util2.default.isFunction(i.onClose) && i.onClose.call(_this3, o);
      }, this._agents.desktop.isSupported()) try {
        o = this._agents.desktop.create(t, i);
      } catch (s) {
        var _o = this._currentId,
            n = this.config().serviceWorker,
            r = function r(t) {
          return _this3._serviceWorkerCallback(t, i, e);
        };this._agents.chrome.isSupported() && this._agents.chrome.create(_o, t, i, n, r);
      } else this._agents.webkit.isSupported() ? o = this._agents.webkit.create(t, i) : this._agents.firefox.isSupported() ? this._agents.firefox.create(t, i) : this._agents.ms.isSupported() ? o = this._agents.ms.create(t, i) : (i.title = t, this.config().fallback(i));if (null !== o) {
        var _t = this._addNotification(o),
            _n = this._prepareNotification(_t, i);_Util2.default.isFunction(i.onShow) && o.addEventListener("show", i.onShow), _Util2.default.isFunction(i.onError) && o.addEventListener("error", i.onError), _Util2.default.isFunction(i.onClick) && o.addEventListener("click", i.onClick), o.addEventListener("close", function () {
          s(_t);
        }), o.addEventListener("cancel", function () {
          s(_t);
        }), e(_n);
      }e(null);
    }
  }, {
    key: "create",
    value: function create(t, i) {
      var _this4 = this;

      var e = void 0;if (!_Util2.default.isString(t)) throw new Error(_Messages2.default.errors.invalid_title);return e = this.Permission.has() ? function (e, s) {
        try {
          _this4._createCallback(t, i, e);
        } catch (t) {
          s(t);
        }
      } : function (e, s) {
        _this4.Permission.request(function () {
          try {
            _this4._createCallback(t, i, e);
          } catch (t) {
            s(t);
          }
        }, function () {
          s(_Messages2.default.errors.permission_denied);
        });
      }, new Promise(e);
    }
  }, {
    key: "count",
    value: function count() {
      var t = void 0,
          i = 0;for (t in this._notifications) {
        this._notifications.hasOwnProperty(t) && i++;
      }return i;
    }
  }, {
    key: "close",
    value: function close(t) {
      var i = void 0,
          e = void 0;for (i in this._notifications) {
        if (this._notifications.hasOwnProperty(i) && (e = this._notifications[i]).tag === t) return this._closeNotification(i);
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      var t = void 0,
          i = !0;for (t in this._notifications) {
        this._notifications.hasOwnProperty(t) && (i = i && this._closeNotification(t));
      }return i;
    }
  }, {
    key: "supported",
    value: function supported() {
      var t = !1;for (var i in this._agents) {
        this._agents.hasOwnProperty(i) && (t = t || this._agents[i].isSupported());
      }return t;
    }
  }, {
    key: "config",
    value: function config(t) {
      return (void 0 !== t || null !== t && _Util2.default.isObject(t)) && _Util2.default.objectMerge(this._configuration, t), this._configuration;
    }
  }, {
    key: "extend",
    value: function extend(t) {
      var i,
          e = {}.hasOwnProperty;if (!e.call(t, "plugin")) throw new Error(_Messages2.default.errors.invalid_plugin);e.call(t, "config") && _Util2.default.isObject(t.config) && null !== t.config && this.config(t.config), i = new (0, t.plugin)(this.config());for (var s in i) {
        e.call(i, s) && _Util2.default.isFunction(i[s]) && (this[s] = i[s]);
      }
    }
  }]);

  return Push;
}();

exports.default = Push;
;

},{"./Messages":1,"./Permission":2,"./Util":4,"./agents/DesktopAgent":6,"./agents/MSAgent":7,"./agents/MobileChromeAgent":8,"./agents/MobileFirefoxAgent":9,"./agents/WebKitAgent":10}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Util = function () {
  function Util() {
    _classCallCheck(this, Util);
  }

  _createClass(Util, null, [{
    key: "isUndefined",
    value: function isUndefined(t) {
      return void 0 === t;
    }
  }, {
    key: "isString",
    value: function isString(t) {
      return "string" == typeof t;
    }
  }, {
    key: "isFunction",
    value: function isFunction(t) {
      return t && "[object Function]" === {}.toString.call(t);
    }
  }, {
    key: "isObject",
    value: function isObject(t) {
      return "object" == (typeof t === "undefined" ? "undefined" : _typeof(t));
    }
  }, {
    key: "objectMerge",
    value: function objectMerge(t, i) {
      for (var e in i) {
        t.hasOwnProperty(e) && this.isObject(t[e]) && this.isObject(i[e]) ? this.objectMerge(t[e], i[e]) : t[e] = i[e];
      }
    }
  }]);

  return Util;
}();

exports.default = Util;
;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractAgent = function AbstractAgent(t) {
  _classCallCheck(this, AbstractAgent);

  this._win = t;
};

exports.default = AbstractAgent;
;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractAgent2 = require("./AbstractAgent");

var _AbstractAgent3 = _interopRequireDefault(_AbstractAgent2);

var _Util = require("../Util");

var _Util2 = _interopRequireDefault(_Util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DesktopAgent = function (_AbstractAgent) {
  _inherits(DesktopAgent, _AbstractAgent);

  function DesktopAgent() {
    _classCallCheck(this, DesktopAgent);

    return _possibleConstructorReturn(this, (DesktopAgent.__proto__ || Object.getPrototypeOf(DesktopAgent)).apply(this, arguments));
  }

  _createClass(DesktopAgent, [{
    key: "isSupported",
    value: function isSupported() {
      return void 0 !== this._win.Notification;
    }
  }, {
    key: "create",
    value: function create(t, i) {
      return new this._win.Notification(t, { icon: _Util2.default.isString(i.icon) || _Util2.default.isUndefined(i.icon) ? i.icon : i.icon.x32, body: i.body, tag: i.tag, requireInteraction: i.requireInteraction });
    }
  }, {
    key: "close",
    value: function close(t) {
      t.close();
    }
  }]);

  return DesktopAgent;
}(_AbstractAgent3.default);

exports.default = DesktopAgent;
;

},{"../Util":4,"./AbstractAgent":5}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractAgent2 = require("./AbstractAgent");

var _AbstractAgent3 = _interopRequireDefault(_AbstractAgent2);

var _Util = require("../Util");

var _Util2 = _interopRequireDefault(_Util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MSAgent = function (_AbstractAgent) {
  _inherits(MSAgent, _AbstractAgent);

  function MSAgent() {
    _classCallCheck(this, MSAgent);

    return _possibleConstructorReturn(this, (MSAgent.__proto__ || Object.getPrototypeOf(MSAgent)).apply(this, arguments));
  }

  _createClass(MSAgent, [{
    key: "isSupported",
    value: function isSupported() {
      return void 0 !== this._win.external && void 0 !== this._win.external.msIsSiteMode;
    }
  }, {
    key: "create",
    value: function create(e, t) {
      return this._win.external.msSiteModeClearIconOverlay(), this._win.external.msSiteModeSetIconOverlay(_Util2.default.isString(t.icon) || _Util2.default.isUndefined(t.icon) ? t.icon : t.icon.x16, e), this._win.external.msSiteModeActivate(), null;
    }
  }, {
    key: "close",
    value: function close() {
      this._win.external.msSiteModeClearIconOverlay();
    }
  }]);

  return MSAgent;
}(_AbstractAgent3.default);

exports.default = MSAgent;
;

},{"../Util":4,"./AbstractAgent":5}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractAgent2 = require("./AbstractAgent");

var _AbstractAgent3 = _interopRequireDefault(_AbstractAgent2);

var _Util = require("../Util");

var _Util2 = _interopRequireDefault(_Util);

var _Messages = require("../Messages");

var _Messages2 = _interopRequireDefault(_Messages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MobileChromeAgent = function (_AbstractAgent) {
  _inherits(MobileChromeAgent, _AbstractAgent);

  function MobileChromeAgent() {
    _classCallCheck(this, MobileChromeAgent);

    return _possibleConstructorReturn(this, (MobileChromeAgent.__proto__ || Object.getPrototypeOf(MobileChromeAgent)).apply(this, arguments));
  }

  _createClass(MobileChromeAgent, [{
    key: "isSupported",
    value: function isSupported() {
      return void 0 !== this._win.navigator && void 0 !== this._win.navigator.serviceWorker;
    }
  }, {
    key: "getFunctionBody",
    value: function getFunctionBody(t) {
      return t.toString().match(/function[^{]+{([\s\S]*)}$/)[1];
    }
  }, {
    key: "create",
    value: function create(t, e, i, o, r) {
      var _this2 = this;

      this._win.navigator.serviceWorker.register(o), this._win.navigator.serviceWorker.ready.then(function (o) {
        var n = { id: t, link: i.link, origin: document.location.href, onClick: _Util2.default.isFunction(i.onClick) ? _this2.getFunctionBody(i.onClick) : "", onClose: _Util2.default.isFunction(i.onClose) ? _this2.getFunctionBody(i.onClose) : "" };void 0 !== i.data && null !== i.data && (n = Object.assign(n, i.data)), o.showNotification(e, { icon: i.icon, body: i.body, vibrate: i.vibrate, tag: i.tag, data: n, requireInteraction: i.requireInteraction, silent: i.silent }).then(function () {
          o.getNotifications().then(function (t) {
            o.active.postMessage(""), r(t);
          });
        }).catch(function (t) {
          throw new Error(_Messages2.default.errors.sw_notification_error + t.message);
        });
      }).catch(function (t) {
        throw new Error(_Messages2.default.errors.sw_registration_error + t.message);
      });
    }
  }, {
    key: "close",
    value: function close() {
      this._win.external.msSiteModeClearIconOverlay();
    }
  }]);

  return MobileChromeAgent;
}(_AbstractAgent3.default);

exports.default = MobileChromeAgent;
;

},{"../Messages":1,"../Util":4,"./AbstractAgent":5}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractAgent2 = require("./AbstractAgent");

var _AbstractAgent3 = _interopRequireDefault(_AbstractAgent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MobileFirefoxAgent = function (_AbstractAgent) {
  _inherits(MobileFirefoxAgent, _AbstractAgent);

  function MobileFirefoxAgent() {
    _classCallCheck(this, MobileFirefoxAgent);

    return _possibleConstructorReturn(this, (MobileFirefoxAgent.__proto__ || Object.getPrototypeOf(MobileFirefoxAgent)).apply(this, arguments));
  }

  _createClass(MobileFirefoxAgent, [{
    key: "isSupported",
    value: function isSupported() {
      return void 0 !== this._win.navigator.mozNotification;
    }
  }, {
    key: "create",
    value: function create(t, i) {
      var o = this._win.navigator.mozNotification.createNotification(t, i.body, i.icon);return o.show(), o;
    }
  }]);

  return MobileFirefoxAgent;
}(_AbstractAgent3.default);

exports.default = MobileFirefoxAgent;
;

},{"./AbstractAgent":5}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractAgent2 = require("./AbstractAgent");

var _AbstractAgent3 = _interopRequireDefault(_AbstractAgent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WebKitAgent = function (_AbstractAgent) {
  _inherits(WebKitAgent, _AbstractAgent);

  function WebKitAgent() {
    _classCallCheck(this, WebKitAgent);

    return _possibleConstructorReturn(this, (WebKitAgent.__proto__ || Object.getPrototypeOf(WebKitAgent)).apply(this, arguments));
  }

  _createClass(WebKitAgent, [{
    key: "isSupported",
    value: function isSupported() {
      return void 0 !== this._win.webkitNotifications;
    }
  }, {
    key: "create",
    value: function create(t, e) {
      var i = this._win.webkitNotifications.createNotification(e.icon, t, e.body);return i.show(), i;
    }
  }, {
    key: "close",
    value: function close(t) {
      t.cancel();
    }
  }]);

  return WebKitAgent;
}(_AbstractAgent3.default);

exports.default = WebKitAgent;
;

},{"./AbstractAgent":5}],11:[function(require,module,exports){
"use strict";

var _Push = require("./classes/Push");

var _Push2 = _interopRequireDefault(_Push);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = new _Push2.default("undefined" != typeof window ? window : undefined);

},{"./classes/Push":3}]},{},[11])(11)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2xhc3Nlcy9NZXNzYWdlcy5qcyIsInNyYy9jbGFzc2VzL1Blcm1pc3Npb24uanMiLCJzcmMvY2xhc3Nlcy9QdXNoLmpzIiwic3JjL2NsYXNzZXMvVXRpbC5qcyIsInNyYy9jbGFzc2VzL2FnZW50cy9BYnN0cmFjdEFnZW50LmpzIiwic3JjL2NsYXNzZXMvYWdlbnRzL0Rlc2t0b3BBZ2VudC5qcyIsInNyYy9jbGFzc2VzL2FnZW50cy9NU0FnZW50LmpzIiwic3JjL2NsYXNzZXMvYWdlbnRzL01vYmlsZUNocm9tZUFnZW50LmpzIiwic3JjL2NsYXNzZXMvYWdlbnRzL01vYmlsZUZpcmVmb3hBZ2VudC5qcyIsInNyYy9jbGFzc2VzL2FnZW50cy9XZWJLaXRBZ2VudC5qcyIsInNyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FDQUEsSUFBTSxjQUFjLGlDQUdsQixVQUNFLGtFQUNBLDBIQUNBLG9FQUNBLDZEQUNBLCtHQUNBLHdHQUNBOzs7Ozs7Ozs7Ozs7O0lDVmlCO0FBRW5CLHNCQUFZOzs7QUFDVixTQUFLLE9BQU8sR0FDWixLQUFLLFVBQVUsV0FDZixLQUFLLFVBQVUsV0FDZixLQUFLLFNBQVMsVUFDZCxLQUFLLGdCQUNILEtBQUssU0FDTCxLQUFLLFNBQ0wsS0FBSztBQVVUOzs7OzRCQUFRLEdBQVc7OztBQUNqQixVQUFNLElBQVcsS0FBSyxVQUVsQixJQUFXO0FBQ1QsY0FBVyxNQUFLLFdBQXNCLE1BQVgsSUFDekIsS0FBVyxNQUNOLEtBQVU7T0FIdkIsQ0FPSSxNQUFhLEtBQUssVUFDcEIsRUFBUSxVQUdJLEtBQUssZ0JBQWdCLEtBQUssS0FBSyxhQUFhLHlCQUNuRCxLQUFLLGFBQWEsb0JBQW9CLEtBQUssR0FBUyxNQUFNO0FBQ3pELGFBQVU7T0FEaEIsQ0FETyxHQU1BLEtBQUssS0FBSyx1QkFBdUIsS0FBSyxLQUFLLG9CQUFvQixr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c0NHLE1BQU0sVUFBUztBQUNoQixjQUFNLElBQUksTUFBTSxtQkFBUyxPQUFPLHdCQUF3QixFQUFNOztBQU9sRTs7OztBQUNFLFdBQUssS0FBSyxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEZoQixBQUFtQjs7Ozs7Ozs7Ozs7O0lBTUwsQUFBMkIsQUFNOUM7Ozs7Ozs7Ozs7OztBQUNFLGtCQUErQyxNQUF4QyxLQUFLLEtBQUssVUFBVTtBQVM3Qjs7OzJCQUFPLEdBQU87QUFDWixVQUFJLElBQWUsS0FBSyxLQUFLLFVBQVUsZ0JBQWdCLG1CQUNyRCxHQUNBLEVBQVEsTUFDUixFQUFRLE1BS1YsT0FGQSxFQUFhLFFBRU47Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvQkosQUFBbUI7Ozs7Ozs7Ozs7OztJQUtMLEFBQW9CLEFBTXZDOzs7Ozs7Ozs7Ozs7QUFDRSxrQkFBeUMsTUFBbEMsS0FBSyxLQUFLO0FBU25COzs7MkJBQU8sR0FBTztBQUNaLFVBQUksSUFBZSxLQUFLLEtBQUssb0JBQW9CLG1CQUMvQyxFQUFRLE1BQ1IsR0FDQSxFQUFRLE1BS1YsT0FGQSxFQUFhLFFBRU47QUFPVDs7OzBCQUFNO0FBQ0osUUFBYTs7Ozs7Ozs7Ozs7OztBQ3RDVixBQUFVOzs7Ozs7QUFFakIsT0FBTyxVQUFVLEFBQUksbUJBQXVCLHNCQUFYLFNBQXlCLEFBQVMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgZXJyb3JQcmVmaXggPSAnUHVzaEVycm9yOic7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZXJyb3JzOiB7XG4gICAgaW5jb21wYXRpYmxlOiBgJHtlcnJvclByZWZpeH0gUHVzaC5qcyBpcyBpbmNvbXBhdGlibGUgd2l0aCBicm93c2VyLmAsXG4gICAgaW52YWxpZF9wbHVnaW46IGAke2Vycm9yUHJlZml4fSBwbHVnaW4gY2xhc3MgbWlzc2luZyBmcm9tIHBsdWdpbiBtYW5pZmVzdCAoaW52YWxpZCBwbHVnaW4pLiBQbGVhc2UgY2hlY2sgdGhlIGRvY3VtZW50YXRpb24uYCxcbiAgICBpbnZhbGlkX3RpdGxlOiBgJHtlcnJvclByZWZpeH0gdGl0bGUgb2Ygbm90aWZpY2F0aW9uIG11c3QgYmUgYSBzdHJpbmdgLFxuICAgIHBlcm1pc3Npb25fZGVuaWVkOiBgJHtlcnJvclByZWZpeH0gcGVybWlzc2lvbiByZXF1ZXN0IGRlY2xpbmVkYCxcbiAgICBzd19ub3RpZmljYXRpb25fZXJyb3I6IGAke2Vycm9yUHJlZml4fSBjb3VsZCBub3Qgc2hvdyBhIFNlcnZpY2VXb3JrZXIgbm90aWZpY2F0aW9uIGR1ZSB0byB0aGUgZm9sbG93aW5nIHJlYXNvbjogYCxcbiAgICBzd19yZWdpc3RyYXRpb25fZXJyb3I6IGAke2Vycm9yUHJlZml4fSBjb3VsZCBub3QgcmVnaXN0ZXIgdGhlIFNlcnZpY2VXb3JrZXIgZHVlIHRvIHRoZSBmb2xsb3dpbmcgcmVhc29uOiBgLFxuICAgIHVua25vd25faW50ZXJmYWNlOiBgJHtlcnJvclByZWZpeH0gdW5hYmxlIHRvIGNyZWF0ZSBub3RpZmljYXRpb246IHVua25vd24gaW50ZXJmYWNlYCxcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGVybWlzc2lvbiB7XG5cbiAgY29uc3RydWN0b3Iod2luKSB7XG4gICAgdGhpcy5fd2luID0gd2luO1xuICAgIHRoaXMuREVGQVVMVCA9ICdkZWZhdWx0JztcbiAgICB0aGlzLkdSQU5URUQgPSAnZ3JhbnRlZCc7XG4gICAgdGhpcy5ERU5JRUQgPSAnZGVuaWVkJztcbiAgICB0aGlzLl9wZXJtaXNzaW9ucyA9IFtcbiAgICAgIHRoaXMuR1JBTlRFRCxcbiAgICAgIHRoaXMuREVGQVVMVCxcbiAgICAgIHRoaXMuREVOSUVEXG4gICAgXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXF1ZXN0cyBwZXJtaXNzaW9uIGZvciBkZXNrdG9wIG5vdGlmaWNhdGlvbnNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gb25HcmFudGVkIC0gRnVuY3Rpb24gdG8gZXhlY3V0ZSBvbmNlIHBlcm1pc3Npb24gaXMgZ3JhbnRlZFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvbkRlbmllZCAtIEZ1bmN0aW9uIHRvIGV4ZWN1dGUgb25jZSBwZXJtaXNzaW9uIGlzIGRlbmllZFxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgcmVxdWVzdChvbkdyYW50ZWQsIG9uRGVuaWVkKSB7XG4gICAgY29uc3QgZXhpc3RpbmcgPSB0aGlzLmdldCgpO1xuXG4gICAgdmFyIHJlc29sdmUgPSAocmVzdWx0KSA9PiB7XG4gICAgICBpZiAocmVzdWx0ID09PSB0aGlzLkdSQU5URUQgfHwgcmVzdWx0ID09PSAwKSB7XG4gICAgICAgIGlmIChvbkdyYW50ZWQpIG9uR3JhbnRlZCgpO1xuICAgICAgfSBlbHNlIGlmIChvbkRlbmllZCkgb25EZW5pZWQoKTtcbiAgICB9XG5cbiAgICAvKiBQZXJtaXNzaW9ucyBhbHJlYWR5IHNldCAqL1xuICAgIGlmIChleGlzdGluZyAhPT0gdGhpcy5ERUZBVUxUKSB7XG4gICAgICByZXNvbHZlKGV4aXN0aW5nKTtcbiAgICB9XG4gICAgLyogU2FmYXJpIDYrLCBDaHJvbWUgMjMrICovXG4gICAgZWxzZSBpZiAodGhpcy5fd2luLk5vdGlmaWNhdGlvbiAmJiB0aGlzLl93aW4uTm90aWZpY2F0aW9uLnJlcXVlc3RQZXJtaXNzaW9uKSB7XG4gICAgICB0aGlzLl93aW4uTm90aWZpY2F0aW9uLnJlcXVlc3RQZXJtaXNzaW9uKCkudGhlbihyZXNvbHZlKS5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChvbkRlbmllZCkgb25EZW5pZWQoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvKiBMZWdhY3kgd2Via2l0IGJyb3dzZXJzICovXG4gICAgZWxzZSBpZiAodGhpcy5fd2luLndlYmtpdE5vdGlmaWNhdGlvbnMgJiYgdGhpcy5fd2luLndlYmtpdE5vdGlmaWNhdGlvbnMuY2hlY2tQZXJtaXNzaW9uKVxuICAgICAgdGhpcy5fd2luLndlYmtpdE5vdGlmaWNhdGlvbnMucmVxdWVzdFBlcm1pc3Npb24ocmVzb2x2ZSk7XG4gICAgLyogTGV0IHRoZSB1c2VyIGNvbnRpbnVlIGJ5IGRlZmF1bHQgKi9cbiAgICBlbHNlIGlmIChvbkdyYW50ZWQpIG9uR3JhbnRlZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciBQdXNoIGhhcyBiZWVuIGdyYW50ZWQgcGVybWlzc2lvbiB0byBydW5cbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIGhhcygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoKSA9PT0gdGhpcy5HUkFOVEVEO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHBlcm1pc3Npb24gbGV2ZWxcbiAgICogQHJldHVybiB7UGVybWlzc2lvbn0gVGhlIHBlcm1pc3Npb24gbGV2ZWxcbiAgICovXG4gIGdldCgpIHtcbiAgICBsZXQgcGVybWlzc2lvbjtcblxuICAgIC8qIFNhZmFyaSA2KywgQ2hyb21lIDIzKyAqL1xuICAgIGlmICh0aGlzLl93aW4uTm90aWZpY2F0aW9uICYmIHRoaXMuX3dpbi5Ob3RpZmljYXRpb24ucGVybWlzc2lvbilcbiAgICAgIHBlcm1pc3Npb24gPSB0aGlzLl93aW4uTm90aWZpY2F0aW9uLnBlcm1pc3Npb247XG5cbiAgICAvKiBMZWdhY3kgd2Via2l0IGJyb3dzZXJzICovXG4gICAgZWxzZSBpZiAodGhpcy5fd2luLndlYmtpdE5vdGlmaWNhdGlvbnMgJiYgdGhpcy5fd2luLndlYmtpdE5vdGlmaWNhdGlvbnMuY2hlY2tQZXJtaXNzaW9uKVxuICAgICAgcGVybWlzc2lvbiA9IHRoaXMuX3Blcm1pc3Npb25zW3RoaXMuX3dpbi53ZWJraXROb3RpZmljYXRpb25zLmNoZWNrUGVybWlzc2lvbigpXTtcblxuICAgIC8qIEZpcmVmb3ggTW9iaWxlICovXG4gICAgZWxzZSBpZiAobmF2aWdhdG9yLm1vek5vdGlmaWNhdGlvbilcbiAgICAgIHBlcm1pc3Npb24gPSB0aGlzLkdSQU5URUQ7XG5cbiAgICAvKiBJRTkrICovXG4gICAgZWxzZSBpZiAodGhpcy5fd2luLmV4dGVybmFsICYmIHRoaXMuX3dpbi5leHRlcm5hbC5tc0lzU2l0ZU1vZGUpXG4gICAgICBwZXJtaXNzaW9uID0gdGhpcy5fd2luLmV4dGVybmFsLm1zSXNTaXRlTW9kZSgpID8gdGhpcy5HUkFOVEVEIDogdGhpcy5ERUZBVUxUO1xuXG4gICAgZWxzZVxuICAgICAgcGVybWlzc2lvbiA9IHRoaXMuR1JBTlRFRDtcblxuICAgIHJldHVybiBwZXJtaXNzaW9uO1xuICB9XG59XG4iLCJpbXBvcnQgTWVzc2FnZXMgZnJvbSBcIi4vTWVzc2FnZXNcIjtcbmltcG9ydCBQZXJtaXNzaW9uIGZyb20gXCIuL1Blcm1pc3Npb25cIjtcbmltcG9ydCBVdGlsIGZyb20gXCIuL1V0aWxcIjtcbi8qIEltcG9ydCBub3RpZmljYXRpb24gYWdlbnRzICovXG5pbXBvcnQgRGVza3RvcEFnZW50IGZyb20gXCIuL2FnZW50cy9EZXNrdG9wQWdlbnRcIjtcbmltcG9ydCBNb2JpbGVDaHJvbWVBZ2VudCBmcm9tIFwiLi9hZ2VudHMvTW9iaWxlQ2hyb21lQWdlbnRcIjtcbmltcG9ydCBNb2JpbGVGaXJlZm94QWdlbnQgZnJvbSBcIi4vYWdlbnRzL01vYmlsZUZpcmVmb3hBZ2VudFwiO1xuaW1wb3J0IE1TQWdlbnQgZnJvbSBcIi4vYWdlbnRzL01TQWdlbnRcIjtcbmltcG9ydCBXZWJLaXRBZ2VudCBmcm9tIFwiLi9hZ2VudHMvV2ViS2l0QWdlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHVzaCB7XG5cbiAgY29uc3RydWN0b3Iod2luKSB7XG4gICAgLyogUHJpdmF0ZSB2YXJpYWJsZXMgKi9cblxuICAgIC8qIElEIHRvIHVzZSBmb3IgbmV3IG5vdGlmaWNhdGlvbnMgKi9cbiAgICB0aGlzLl9jdXJyZW50SWQgPSAwO1xuXG4gICAgLyogTWFwIG9mIG9wZW4gbm90aWZpY2F0aW9ucyAqL1xuICAgIHRoaXMuX25vdGlmaWNhdGlvbnMgPSB7fTtcblxuICAgIC8qIFdpbmRvdyBvYmplY3QgKi9cbiAgICB0aGlzLl93aW4gPSB3aW47XG5cbiAgICAvKiBQdWJsaWMgdmFyaWFibGVzICovXG4gICAgdGhpcy5QZXJtaXNzaW9uID0gbmV3IFBlcm1pc3Npb24od2luKTtcblxuICAgIC8qIEFnZW50cyAqL1xuICAgIHRoaXMuX2FnZW50cyA9IHtcbiAgICAgIGRlc2t0b3A6IG5ldyBEZXNrdG9wQWdlbnQod2luKSxcbiAgICAgIGNocm9tZTogbmV3IE1vYmlsZUNocm9tZUFnZW50KHdpbiksXG4gICAgICBmaXJlZm94OiBuZXcgTW9iaWxlRmlyZWZveEFnZW50KHdpbiksXG4gICAgICBtczogbmV3IE1TQWdlbnQod2luKSxcbiAgICAgIHdlYmtpdDogbmV3IFdlYktpdEFnZW50KHdpbilcbiAgICB9O1xuXG4gICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IHtcbiAgICAgIHNlcnZpY2VXb3JrZXI6ICcuL3NlcnZpY2VXb3JrZXIubWluLmpzJyxcbiAgICAgIGZhbGxiYWNrOiBmdW5jdGlvbihwYXlsb2FkKSB7fVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgYSBub3RpZmljYXRpb25cbiAgICogQHBhcmFtIHtOb3RpZmljYXRpb259IG5vdGlmaWNhdGlvblxuICAgKiBAcmV0dXJuIHtCb29sZWFufSBib29sZWFuIGRlbm90aW5nIHdoZXRoZXIgdGhlIG9wZXJhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2Nsb3NlTm90aWZpY2F0aW9uKGlkKSB7XG4gICAgbGV0IHN1Y2Nlc3MgPSB0cnVlO1xuICAgIGNvbnN0IG5vdGlmaWNhdGlvbiA9IHRoaXMuX25vdGlmaWNhdGlvbnNbaWRdO1xuXG4gICAgaWYgKG5vdGlmaWNhdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBzdWNjZXNzID0gdGhpcy5fcmVtb3ZlTm90aWZpY2F0aW9uKGlkKTtcblxuICAgICAgLyogU2FmYXJpIDYrLCBGaXJlZm94IDIyKywgQ2hyb21lIDIyKywgT3BlcmEgMjUrICovXG4gICAgICBpZiAodGhpcy5fYWdlbnRzLmRlc2t0b3AuaXNTdXBwb3J0ZWQoKSlcbiAgICAgICAgdGhpcy5fYWdlbnRzLmRlc2t0b3AuY2xvc2Uobm90aWZpY2F0aW9uKTtcblxuICAgICAgLyogTGVnYWN5IFdlYktpdCBicm93c2VycyAqL1xuICAgICAgZWxzZSBpZiAodGhpcy5fYWdlbnRzLndlYmtpdC5pc1N1cHBvcnRlZCgpKVxuICAgICAgICB0aGlzLl9hZ2VudHMud2Via2l0LmNsb3NlKG5vdGlmaWNhdGlvbik7XG5cbiAgICAgIC8qIElFOSAqL1xuICAgICAgZWxzZSBpZiAodGhpcy5fYWdlbnRzLm1zLmlzU3VwcG9ydGVkKCkpXG4gICAgICAgIHRoaXMuX2FnZW50cy5tcy5jbG9zZSgpO1xuXG4gICAgICBlbHNlIHtcbiAgICAgICAgc3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoTWVzc2FnZXMuZXJyb3JzLnVua25vd25faW50ZXJmYWNlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN1Y2Nlc3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBub3RpZmljYXRpb24gdG8gdGhlIGdsb2JhbCBkaWN0aW9uYXJ5IG9mIG5vdGlmaWNhdGlvbnNcbiAgICogQHBhcmFtIHtOb3RpZmljYXRpb259IG5vdGlmaWNhdGlvblxuICAgKiBAcmV0dXJuIHtJbnRlZ2VyfSBEaWN0aW9uYXJ5IGtleSBvZiB0aGUgbm90aWZpY2F0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYWRkTm90aWZpY2F0aW9uKG5vdGlmaWNhdGlvbikge1xuICAgIGNvbnN0IGlkID0gdGhpcy5fY3VycmVudElkO1xuICAgIHRoaXMuX25vdGlmaWNhdGlvbnNbaWRdID0gbm90aWZpY2F0aW9uO1xuICAgIHRoaXMuX2N1cnJlbnRJZCsrO1xuICAgIHJldHVybiBpZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgbm90aWZpY2F0aW9uIHdpdGggdGhlIGdpdmVuIElEXG4gICAqIEBwYXJhbSAge0ludGVnZXJ9IGlkIC0gRGljdGlvbmFyeSBrZXkvSUQgb2YgdGhlIG5vdGlmaWNhdGlvbiB0byByZW1vdmVcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gYm9vbGVhbiBkZW5vdGluZyBzdWNjZXNzXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfcmVtb3ZlTm90aWZpY2F0aW9uKGlkKSB7XG4gICAgbGV0IHN1Y2Nlc3MgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLl9ub3RpZmljYXRpb25zLmhhc093blByb3BlcnR5KGlkKSkge1xuICAgICAgLyogV2UncmUgc3VjY2Vzc2Z1bCBpZiB3ZSBvbWl0IHRoZSBnaXZlbiBJRCBmcm9tIHRoZSBuZXcgYXJyYXkgKi9cbiAgICAgIGRlbGV0ZSB0aGlzLl9ub3RpZmljYXRpb25zW2lkXTtcbiAgICAgIHN1Y2Nlc3MgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBzdWNjZXNzO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIHdyYXBwZXIgZm9yIGEgZ2l2ZW4gbm90aWZpY2F0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7SW50ZWdlcn0gaWQgLSBEaWN0aW9uYXJ5IGtleS9JRCBvZiB0aGUgbm90aWZpY2F0aW9uXG4gICAqIEBwYXJhbSB7TWFwfSBvcHRpb25zIC0gT3B0aW9ucyB1c2VkIHRvIGNyZWF0ZSB0aGUgbm90aWZpY2F0aW9uXG4gICAqIEByZXR1cm5zIHtNYXB9IHdyYXBwZXIgaGFzaG1hcCBvYmplY3RcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9wcmVwYXJlTm90aWZpY2F0aW9uKGlkLCBvcHRpb25zKSB7XG4gICAgbGV0IHdyYXBwZXI7XG5cbiAgICAvKiBXcmFwcGVyIHVzZWQgdG8gZ2V0L2Nsb3NlIG5vdGlmaWNhdGlvbiBsYXRlciBvbiAqL1xuICAgIHdyYXBwZXIgPSB7XG4gICAgICBnZXQ6ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25vdGlmaWNhdGlvbnNbaWRdO1xuICAgICAgfSxcblxuICAgICAgY2xvc2U6ICgpID0+IHtcbiAgICAgICAgdGhpcy5fY2xvc2VOb3RpZmljYXRpb24oaWQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvKiBBdXRvY2xvc2UgdGltZW91dCAqL1xuICAgIGlmIChvcHRpb25zLnRpbWVvdXQpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB3cmFwcGVyLmNsb3NlKCk7XG4gICAgICB9LCBvcHRpb25zLnRpbWVvdXQpO1xuICAgIH1cblxuICAgIHJldHVybiB3cmFwcGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIG1vc3QgcmVjZW50IG5vdGlmaWNhdGlvbiBmcm9tIGEgU2VydmljZVdvcmtlciBhbmQgYWRkIGl0IHRvIHRoZSBnbG9iYWwgYXJyYXlcbiAgICogQHBhcmFtIG5vdGlmaWNhdGlvbnNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9zZXJ2aWNlV29ya2VyQ2FsbGJhY2sobm90aWZpY2F0aW9ucywgb3B0aW9ucywgcmVzb2x2ZSkge1xuICAgIGxldCBpZCA9IHRoaXMuX2FkZE5vdGlmaWNhdGlvbihub3RpZmljYXRpb25zW25vdGlmaWNhdGlvbnMubGVuZ3RoIC0gMV0pO1xuXG4gICAgLyogTGlzdGVuIGZvciBjbG9zZSByZXF1ZXN0cyBmcm9tIHRoZSBTZXJ2aWNlV29ya2VyICovXG4gICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGV2ZW50ID0+IHtcbiAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuXG4gICAgICBpZiAoZGF0YS5hY3Rpb24gPT09ICdjbG9zZScgJiYgTnVtYmVyLmlzSW50ZWdlcihkYXRhLmlkKSlcbiAgICAgICAgdGhpcy5fcmVtb3ZlTm90aWZpY2F0aW9uKGRhdGEuaWQpO1xuICAgIH0pO1xuXG4gICAgcmVzb2x2ZSh0aGlzLl9wcmVwYXJlTm90aWZpY2F0aW9uKGlkLCBvcHRpb25zKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZnVuY3Rpb24gZm9yIHRoZSAnY3JlYXRlJyBtZXRob2RcbiAgICogQHJldHVybiB7dm9pZH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jcmVhdGVDYWxsYmFjayh0aXRsZSwgb3B0aW9ucywgcmVzb2x2ZSkge1xuICAgIGxldCBub3RpZmljYXRpb24gPSBudWxsO1xuICAgIGxldCBvbkNsb3NlO1xuXG4gICAgLyogU2V0IGVtcHR5IHNldHRpbmdzIGlmIG5vbmUgYXJlIHNwZWNpZmllZCAqL1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgLyogb25DbG9zZSBldmVudCBoYW5kbGVyICovXG4gICAgb25DbG9zZSA9IChpZCkgPT4ge1xuICAgICAgLyogQSBiaXQgcmVkdW5kYW50LCBidXQgY292ZXJzIHRoZSBjYXNlcyB3aGVuIGNsb3NlKCkgaXNuJ3QgZXhwbGljaXRseSBjYWxsZWQgKi9cbiAgICAgIHRoaXMuX3JlbW92ZU5vdGlmaWNhdGlvbihpZCk7XG4gICAgICBpZiAoVXRpbC5pc0Z1bmN0aW9uKG9wdGlvbnMub25DbG9zZSkpIHtcbiAgICAgICAgb3B0aW9ucy5vbkNsb3NlLmNhbGwodGhpcywgbm90aWZpY2F0aW9uKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLyogU2FmYXJpIDYrLCBGaXJlZm94IDIyKywgQ2hyb21lIDIyKywgT3BlcmEgMjUrICovXG4gICAgaWYgKHRoaXMuX2FnZW50cy5kZXNrdG9wLmlzU3VwcG9ydGVkKCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8qIENyZWF0ZSBhIG5vdGlmaWNhdGlvbiB1c2luZyB0aGUgQVBJIGlmIHBvc3NpYmxlICovXG4gICAgICAgIG5vdGlmaWNhdGlvbiA9IHRoaXMuX2FnZW50cy5kZXNrdG9wLmNyZWF0ZSh0aXRsZSwgb3B0aW9ucyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnN0IGlkID0gdGhpcy5fY3VycmVudElkO1xuICAgICAgICBjb25zdCBzdyA9IHRoaXMuY29uZmlnKCkuc2VydmljZVdvcmtlcjtcbiAgICAgICAgY29uc3QgY2IgPSAobm90aWZpY2F0aW9ucykgPT4gdGhpcy5fc2VydmljZVdvcmtlckNhbGxiYWNrKG5vdGlmaWNhdGlvbnMsIG9wdGlvbnMsIHJlc29sdmUpO1xuICAgICAgICAvKiBDcmVhdGUgYSBDaHJvbWUgU2VydmljZVdvcmtlciBub3RpZmljYXRpb24gaWYgaXQgaXNuJ3Qgc3VwcG9ydGVkICovXG4gICAgICAgIGlmICh0aGlzLl9hZ2VudHMuY2hyb21lLmlzU3VwcG9ydGVkKCkpIHtcbiAgICAgICAgICB0aGlzLl9hZ2VudHMuY2hyb21lLmNyZWF0ZShpZCwgdGl0bGUsIG9wdGlvbnMsIHN3LCBjYik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8qIExlZ2FjeSBXZWJLaXQgYnJvd3NlcnMgKi9cbiAgICB9IGVsc2UgaWYgKHRoaXMuX2FnZW50cy53ZWJraXQuaXNTdXBwb3J0ZWQoKSlcbiAgICAgIG5vdGlmaWNhdGlvbiA9IHRoaXMuX2FnZW50cy53ZWJraXQuY3JlYXRlKHRpdGxlLCBvcHRpb25zKTtcblxuICAgIC8qIEZpcmVmb3ggTW9iaWxlICovXG4gICAgZWxzZSBpZiAodGhpcy5fYWdlbnRzLmZpcmVmb3guaXNTdXBwb3J0ZWQoKSlcbiAgICAgIHRoaXMuX2FnZW50cy5maXJlZm94LmNyZWF0ZSh0aXRsZSwgb3B0aW9ucyk7XG5cbiAgICAvKiBJRTkgKi9cbiAgICBlbHNlIGlmICh0aGlzLl9hZ2VudHMubXMuaXNTdXBwb3J0ZWQoKSlcbiAgICAgIG5vdGlmaWNhdGlvbiA9IHRoaXMuX2FnZW50cy5tcy5jcmVhdGUodGl0bGUsIG9wdGlvbnMpO1xuXG4gICAgLyogRGVmYXVsdCBmYWxsYmFjayAqL1xuICAgIGVsc2Uge1xuICAgICAgb3B0aW9ucy50aXRsZSA9IHRpdGxlO1xuICAgICAgdGhpcy5jb25maWcoKS5mYWxsYmFjayhvcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZiAobm90aWZpY2F0aW9uICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBpZCA9IHRoaXMuX2FkZE5vdGlmaWNhdGlvbihub3RpZmljYXRpb24pO1xuICAgICAgY29uc3Qgd3JhcHBlciA9IHRoaXMuX3ByZXBhcmVOb3RpZmljYXRpb24oaWQsIG9wdGlvbnMpO1xuXG4gICAgICAvKiBOb3RpZmljYXRpb24gY2FsbGJhY2tzICovXG4gICAgICBpZiAoVXRpbC5pc0Z1bmN0aW9uKG9wdGlvbnMub25TaG93KSlcbiAgICAgICAgbm90aWZpY2F0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ3Nob3cnLCBvcHRpb25zLm9uU2hvdyk7XG5cbiAgICAgIGlmIChVdGlsLmlzRnVuY3Rpb24ob3B0aW9ucy5vbkVycm9yKSlcbiAgICAgICAgbm90aWZpY2F0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgb3B0aW9ucy5vbkVycm9yKTtcblxuICAgICAgaWYgKFV0aWwuaXNGdW5jdGlvbihvcHRpb25zLm9uQ2xpY2spKVxuICAgICAgICBub3RpZmljYXRpb24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvcHRpb25zLm9uQ2xpY2spO1xuXG4gICAgICBub3RpZmljYXRpb24uYWRkRXZlbnRMaXN0ZW5lcignY2xvc2UnLCAoKSA9PiB7XG4gICAgICAgIG9uQ2xvc2UoaWQpO1xuICAgICAgfSk7XG5cbiAgICAgIG5vdGlmaWNhdGlvbi5hZGRFdmVudExpc3RlbmVyKCdjYW5jZWwnLCAoKSA9PiB7XG4gICAgICAgIG9uQ2xvc2UoaWQpO1xuICAgICAgfSk7XG5cbiAgICAgIC8qIFJldHVybiB0aGUgd3JhcHBlciBzbyB0aGUgdXNlciBjYW4gY2FsbCBjbG9zZSgpICovXG4gICAgICByZXNvbHZlKHdyYXBwZXIpO1xuICAgIH1cblxuICAgIC8qIEJ5IGRlZmF1bHQsIHBhc3MgYW4gZW1wdHkgd3JhcHBlciAqL1xuICAgIHJlc29sdmUobnVsbCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbmQgZGlzcGxheXMgYSBuZXcgbm90aWZpY2F0aW9uXG4gICAqIEBwYXJhbSB7QXJyYXl9IG9wdGlvbnNcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIGNyZWF0ZSh0aXRsZSwgb3B0aW9ucykge1xuICAgIGxldCBwcm9taXNlQ2FsbGJhY2s7XG5cbiAgICAvKiBGYWlsIGlmIG5vIG9yIGFuIGludmFsaWQgdGl0bGUgaXMgcHJvdmlkZWQgKi9cbiAgICBpZiAoIVV0aWwuaXNTdHJpbmcodGl0bGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoTWVzc2FnZXMuZXJyb3JzLmludmFsaWRfdGl0bGUpO1xuICAgIH1cblxuICAgIC8qIFJlcXVlc3QgcGVybWlzc2lvbiBpZiBpdCBpc24ndCBncmFudGVkICovXG4gICAgaWYgKCF0aGlzLlBlcm1pc3Npb24uaGFzKCkpIHtcbiAgICAgIHByb21pc2VDYWxsYmFjayA9IChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdGhpcy5QZXJtaXNzaW9uLnJlcXVlc3QoKCkgPT4ge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLl9jcmVhdGVDYWxsYmFjayh0aXRsZSwgb3B0aW9ucywgcmVzb2x2ZSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgIHJlamVjdChNZXNzYWdlcy5lcnJvcnMucGVybWlzc2lvbl9kZW5pZWQpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb21pc2VDYWxsYmFjayA9IChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGlzLl9jcmVhdGVDYWxsYmFjayh0aXRsZSwgb3B0aW9ucywgcmVzb2x2ZSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHByb21pc2VDYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbm90aWZpY2F0aW9uIGNvdW50XG4gICAqIEByZXR1cm4ge0ludGVnZXJ9IFRoZSBub3RpZmljYXRpb24gY291bnRcbiAgICovXG4gIGNvdW50KCkge1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgbGV0IGtleTtcblxuICAgIGZvciAoa2V5IGluIHRoaXMuX25vdGlmaWNhdGlvbnMpXG4gICAgICBpZiAodGhpcy5fbm90aWZpY2F0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb3VudCsrO1xuXG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyBhIG5vdGlmaWNhdGlvbiB3aXRoIHRoZSBnaXZlbiB0YWdcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRhZyAtIFRhZyBvZiB0aGUgbm90aWZpY2F0aW9uIHRvIGNsb3NlXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IGJvb2xlYW4gZGVub3Rpbmcgc3VjY2Vzc1xuICAgKi9cbiAgY2xvc2UodGFnKSB7XG4gICAgbGV0IGtleSwgbm90aWZpY2F0aW9uO1xuXG4gICAgZm9yIChrZXkgaW4gdGhpcy5fbm90aWZpY2F0aW9ucykge1xuICAgICAgaWYgKHRoaXMuX25vdGlmaWNhdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBub3RpZmljYXRpb24gPSB0aGlzLl9ub3RpZmljYXRpb25zW2tleV07XG5cbiAgICAgICAgLyogUnVuIG9ubHkgaWYgdGhlIHRhZ3MgbWF0Y2ggKi9cbiAgICAgICAgaWYgKG5vdGlmaWNhdGlvbi50YWcgPT09IHRhZykge1xuXG4gICAgICAgICAgLyogQ2FsbCB0aGUgbm90aWZpY2F0aW9uJ3MgY2xvc2UoKSBtZXRob2QgKi9cbiAgICAgICAgICByZXR1cm4gdGhpcy5fY2xvc2VOb3RpZmljYXRpb24oa2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgYWxsIG5vdGlmaWNhdGlvbnNcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gYm9vbGVhbiBkZW5vdGluZyB3aGV0aGVyIHRoZSBjbGVhciB3YXMgc3VjY2Vzc2Z1bCBpbiBjbG9zaW5nIGFsbCBub3RpZmljYXRpb25zXG4gICAqL1xuICBjbGVhcigpIHtcbiAgICBsZXQga2V5LCBzdWNjZXNzID0gdHJ1ZTtcblxuICAgIGZvciAoa2V5IGluIHRoaXMuX25vdGlmaWNhdGlvbnMpXG4gICAgICBpZiAodGhpcy5fbm90aWZpY2F0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKVxuICAgICAgICBzdWNjZXNzID0gc3VjY2VzcyAmJiB0aGlzLl9jbG9zZU5vdGlmaWNhdGlvbihrZXkpO1xuXG4gICAgcmV0dXJuIHN1Y2Nlc3M7XG4gIH1cblxuICAvKipcbiAgICogRGVub3RlcyB3aGV0aGVyIFB1c2ggaXMgc3VwcG9ydGVkIGluIHRoZSBjdXJyZW50IGJyb3dzZXJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBzdXBwb3J0ZWQoKSB7XG4gICAgbGV0IHN1cHBvcnRlZCA9IGZhbHNlO1xuXG4gICAgZm9yICh2YXIgYWdlbnQgaW4gdGhpcy5fYWdlbnRzKVxuICAgICAgaWYgKHRoaXMuX2FnZW50cy5oYXNPd25Qcm9wZXJ0eShhZ2VudCkpXG4gICAgICAgIHN1cHBvcnRlZCA9IHN1cHBvcnRlZCB8fCB0aGlzLl9hZ2VudHNbYWdlbnRdLmlzU3VwcG9ydGVkKClcblxuICAgIHJldHVybiBzdXBwb3J0ZWQ7XG4gIH1cblxuICAvKipcbiAgICogTW9kaWZpZXMgc2V0dGluZ3Mgb3IgcmV0dXJucyBhbGwgc2V0dGluZ3MgaWYgbm8gcGFyYW1ldGVyIHBhc3NlZFxuICAgKiBAcGFyYW0gc2V0dGluZ3NcbiAgICovXG4gIGNvbmZpZyhzZXR0aW5ncykge1xuICAgIGlmICh0eXBlb2Ygc2V0dGluZ3MgIT09ICd1bmRlZmluZWQnIHx8IHNldHRpbmdzICE9PSBudWxsICYmIFV0aWwuaXNPYmplY3Qoc2V0dGluZ3MpKVxuICAgICAgVXRpbC5vYmplY3RNZXJnZSh0aGlzLl9jb25maWd1cmF0aW9uLCBzZXR0aW5ncyk7XG4gICAgcmV0dXJuIHRoaXMuX2NvbmZpZ3VyYXRpb247XG4gIH1cblxuICAvKipcbiAgICogQ29waWVzIHRoZSBmdW5jdGlvbnMgZnJvbSBhIHBsdWdpbiB0byB0aGUgbWFpbiBsaWJyYXJ5XG4gICAqIEBwYXJhbSBwbHVnaW5cbiAgICovXG4gIGV4dGVuZChtYW5pZmVzdCkge1xuICAgIHZhciBwbHVnaW4sIFBsdWdpbixcbiAgICAgIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuICAgIGlmICghaGFzUHJvcC5jYWxsKG1hbmlmZXN0LCAncGx1Z2luJykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihNZXNzYWdlcy5lcnJvcnMuaW52YWxpZF9wbHVnaW4pO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaGFzUHJvcC5jYWxsKG1hbmlmZXN0LCAnY29uZmlnJykgJiYgVXRpbC5pc09iamVjdChtYW5pZmVzdC5jb25maWcpICYmIG1hbmlmZXN0LmNvbmZpZyAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNvbmZpZyhtYW5pZmVzdC5jb25maWcpO1xuICAgICAgfVxuXG4gICAgICBQbHVnaW4gPSBtYW5pZmVzdC5wbHVnaW47XG4gICAgICBwbHVnaW4gPSBuZXcgUGx1Z2luKHRoaXMuY29uZmlnKCkpXG5cbiAgICAgIGZvciAodmFyIG1lbWJlciBpbiBwbHVnaW4pIHtcbiAgICAgICAgaWYgKGhhc1Byb3AuY2FsbChwbHVnaW4sIG1lbWJlcikgJiYgVXRpbC5pc0Z1bmN0aW9uKHBsdWdpblttZW1iZXJdKSlcbiAgICAgICAgICB0aGlzW21lbWJlcl0gPSBwbHVnaW5bbWVtYmVyXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFV0aWwge1xuICBzdGF0aWMgaXNVbmRlZmluZWQob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgc3RhdGljIGlzU3RyaW5nKG9iaikge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnc3RyaW5nJztcbiAgfVxuXG4gIHN0YXRpYyBpc0Z1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogJiYge30udG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuICB9XG5cbiAgc3RhdGljIGlzT2JqZWN0KG9iaikge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0J1xuICB9XG5cbiAgc3RhdGljIG9iamVjdE1lcmdlKHRhcmdldCwgc291cmNlKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgaWYgKHRhcmdldC5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIHRoaXMuaXNPYmplY3QodGFyZ2V0W2tleV0pICYmIHRoaXMuaXNPYmplY3Qoc291cmNlW2tleV0pKSB7XG4gICAgICAgIHRoaXMub2JqZWN0TWVyZ2UodGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEFic3RyYWN0QWdlbnQge1xuICBjb25zdHJ1Y3Rvcih3aW4pIHtcbiAgICB0aGlzLl93aW4gPSB3aW47XG4gIH1cbn1cbiIsImltcG9ydCBBYnN0cmFjdEFnZW50IGZyb20gJy4vQWJzdHJhY3RBZ2VudCc7XG5pbXBvcnQgVXRpbCBmcm9tICcuLi9VdGlsJztcblxuLyoqXG4gKiBOb3RpZmljYXRpb24gYWdlbnQgZm9yIG1vZGVybiBkZXNrdG9wIGJyb3dzZXJzOlxuICogU2FmYXJpIDYrLCBGaXJlZm94IDIyKywgQ2hyb21lIDIyKywgT3BlcmEgMjUrXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlc2t0b3BBZ2VudCBleHRlbmRzIEFic3RyYWN0QWdlbnQge1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgYm9vbGVhbiBkZW5vdGluZyBzdXBwb3J0XG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBib29sZWFuIGRlbm90aW5nIHdoZXRoZXIgd2Via2l0IG5vdGlmaWNhdGlvbnMgYXJlIHN1cHBvcnRlZFxuICAgKi9cbiAgaXNTdXBwb3J0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dpbi5Ob3RpZmljYXRpb24gIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IG5vdGlmaWNhdGlvblxuICAgKiBAcGFyYW0gdGl0bGUgLSBub3RpZmljYXRpb24gdGl0bGVcbiAgICogQHBhcmFtIG9wdGlvbnMgLSBub3RpZmljYXRpb24gb3B0aW9ucyBhcnJheVxuICAgKiBAcmV0dXJucyB7Tm90aWZpY2F0aW9ufVxuICAgKi9cbiAgY3JlYXRlKHRpdGxlLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzLl93aW4uTm90aWZpY2F0aW9uKFxuICAgICAgdGl0bGUsXG4gICAgICB7XG4gICAgICAgIGljb246IChVdGlsLmlzU3RyaW5nKG9wdGlvbnMuaWNvbikgfHwgVXRpbC5pc1VuZGVmaW5lZChvcHRpb25zLmljb24pKSA/IG9wdGlvbnMuaWNvbiA6IG9wdGlvbnMuaWNvbi54MzIsXG4gICAgICAgIGJvZHk6IG9wdGlvbnMuYm9keSxcbiAgICAgICAgdGFnOiBvcHRpb25zLnRhZyxcbiAgICAgICAgcmVxdWlyZUludGVyYWN0aW9uOiBvcHRpb25zLnJlcXVpcmVJbnRlcmFjdGlvblxuICAgICAgfVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2UgYSBnaXZlbiBub3RpZmljYXRpb25cbiAgICogQHBhcmFtIG5vdGlmaWNhdGlvbiAtIG5vdGlmaWNhdGlvbiB0byBjbG9zZVxuICAgKi9cbiAgY2xvc2Uobm90aWZpY2F0aW9uKSB7XG4gICAgbm90aWZpY2F0aW9uLmNsb3NlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBBYnN0cmFjdEFnZW50IGZyb20gJy4vQWJzdHJhY3RBZ2VudCc7XG5pbXBvcnQgVXRpbCBmcm9tICcuLi9VdGlsJztcblxuLyoqXG4gKiBOb3RpZmljYXRpb24gYWdlbnQgZm9yIElFOVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNU0FnZW50IGV4dGVuZHMgQWJzdHJhY3RBZ2VudCB7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBib29sZWFuIGRlbm90aW5nIHN1cHBvcnRcbiAgICogQHJldHVybnMge0Jvb2xlYW59IGJvb2xlYW4gZGVub3Rpbmcgd2hldGhlciB3ZWJraXQgbm90aWZpY2F0aW9ucyBhcmUgc3VwcG9ydGVkXG4gICAqL1xuICBpc1N1cHBvcnRlZCgpIHtcbiAgICByZXR1cm4gKHRoaXMuX3dpbi5leHRlcm5hbCAhPT0gdW5kZWZpbmVkKSAmJiAodGhpcy5fd2luLmV4dGVybmFsLm1zSXNTaXRlTW9kZSAhPT0gdW5kZWZpbmVkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IG5vdGlmaWNhdGlvblxuICAgKiBAcGFyYW0gdGl0bGUgLSBub3RpZmljYXRpb24gdGl0bGVcbiAgICogQHBhcmFtIG9wdGlvbnMgLSBub3RpZmljYXRpb24gb3B0aW9ucyBhcnJheVxuICAgKiBAcmV0dXJucyB7Tm90aWZpY2F0aW9ufVxuICAgKi9cbiAgY3JlYXRlKHRpdGxlLCBvcHRpb25zKSB7XG4gICAgLyogQ2xlYXIgYW55IHByZXZpb3VzIG5vdGlmaWNhdGlvbnMgKi9cbiAgICB0aGlzLl93aW4uZXh0ZXJuYWwubXNTaXRlTW9kZUNsZWFySWNvbk92ZXJsYXkoKTtcblxuICAgIHRoaXMuX3dpbi5leHRlcm5hbC5tc1NpdGVNb2RlU2V0SWNvbk92ZXJsYXkoXG4gICAgICAoKFV0aWwuaXNTdHJpbmcob3B0aW9ucy5pY29uKSB8fCBVdGlsLmlzVW5kZWZpbmVkKG9wdGlvbnMuaWNvbikpXG4gICAgICAgID8gb3B0aW9ucy5pY29uXG4gICAgICAgIDogb3B0aW9ucy5pY29uLngxNiksIHRpdGxlXG4gICAgKTtcblxuICAgIHRoaXMuX3dpbi5leHRlcm5hbC5tc1NpdGVNb2RlQWN0aXZhdGUoKTtcblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlIGEgZ2l2ZW4gbm90aWZpY2F0aW9uXG4gICAqIEBwYXJhbSBub3RpZmljYXRpb24gLSBub3RpZmljYXRpb24gdG8gY2xvc2VcbiAgICovXG4gIGNsb3NlKCkge1xuICAgIHRoaXMuX3dpbi5leHRlcm5hbC5tc1NpdGVNb2RlQ2xlYXJJY29uT3ZlcmxheSgpXG4gIH1cbn1cbiIsImltcG9ydCBBYnN0cmFjdEFnZW50IGZyb20gJy4vQWJzdHJhY3RBZ2VudCc7XG5pbXBvcnQgVXRpbCBmcm9tICcuLi9VdGlsJztcbmltcG9ydCBNZXNzYWdlcyBmcm9tICcuLi9NZXNzYWdlcyc7XG5cbi8qKlxuICogTm90aWZpY2F0aW9uIGFnZW50IGZvciBtb2Rlcm4gZGVza3RvcCBicm93c2VyczpcbiAqIFNhZmFyaSA2KywgRmlyZWZveCAyMissIENocm9tZSAyMissIE9wZXJhIDI1K1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb2JpbGVDaHJvbWVBZ2VudCBleHRlbmRzIEFic3RyYWN0QWdlbnQge1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgYm9vbGVhbiBkZW5vdGluZyBzdXBwb3J0XG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBib29sZWFuIGRlbm90aW5nIHdoZXRoZXIgd2Via2l0IG5vdGlmaWNhdGlvbnMgYXJlIHN1cHBvcnRlZFxuICAgKi9cbiAgaXNTdXBwb3J0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dpbi5uYXZpZ2F0b3IgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgdGhpcy5fd2luLm5hdmlnYXRvci5zZXJ2aWNlV29ya2VyICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZnVuY3Rpb24gYm9keSBhcyBhIHN0cmluZ1xuICAgKiBAcGFyYW0gZnVuY1xuICAgKi9cbiAgZ2V0RnVuY3Rpb25Cb2R5KGZ1bmMpIHtcbiAgICByZXR1cm4gZnVuYy50b1N0cmluZygpLm1hdGNoKC9mdW5jdGlvbltee10reyhbXFxzXFxTXSopfSQvKVsxXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IG5vdGlmaWNhdGlvblxuICAgKiBAcGFyYW0gdGl0bGUgLSBub3RpZmljYXRpb24gdGl0bGVcbiAgICogQHBhcmFtIG9wdGlvbnMgLSBub3RpZmljYXRpb24gb3B0aW9ucyBhcnJheVxuICAgKiBAcmV0dXJucyB7Tm90aWZpY2F0aW9ufVxuICAgKi9cbiAgY3JlYXRlKGlkLCB0aXRsZSwgb3B0aW9ucywgc2VydmljZVdvcmtlciwgY2FsbGJhY2spIHtcbiAgICAvKiBSZWdpc3RlciBTZXJ2aWNlV29ya2VyICovXG4gICAgdGhpcy5fd2luLm5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKHNlcnZpY2VXb3JrZXIpO1xuXG4gICAgdGhpcy5fd2luLm5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlYWR5LnRoZW4ocmVnaXN0cmF0aW9uID0+IHtcbiAgICAgIC8qIExvY2FsIGRhdGEgdGhlIHNlcnZpY2Ugd29ya2VyIHdpbGwgdXNlICovXG4gICAgICBsZXQgbG9jYWxEYXRhID0ge1xuICAgICAgICBpZDogaWQsXG4gICAgICAgIGxpbms6IG9wdGlvbnMubGluayxcbiAgICAgICAgb3JpZ2luOiBkb2N1bWVudC5sb2NhdGlvbi5ocmVmLFxuICAgICAgICBvbkNsaWNrOiAoVXRpbC5pc0Z1bmN0aW9uKG9wdGlvbnMub25DbGljaykpID8gdGhpcy5nZXRGdW5jdGlvbkJvZHkob3B0aW9ucy5vbkNsaWNrKSA6ICcnLFxuICAgICAgICBvbkNsb3NlOiAoVXRpbC5pc0Z1bmN0aW9uKG9wdGlvbnMub25DbG9zZSkpID8gdGhpcy5nZXRGdW5jdGlvbkJvZHkob3B0aW9ucy5vbkNsb3NlKSA6ICcnXG4gICAgICB9O1xuXG4gICAgICAvKiBNZXJnZSB0aGUgbG9jYWwgZGF0YSB3aXRoIHVzZXItcHJvdmlkZWQgZGF0YSAqL1xuICAgICAgaWYgKG9wdGlvbnMuZGF0YSAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMuZGF0YSAhPT0gbnVsbClcbiAgICAgICAgbG9jYWxEYXRhID0gT2JqZWN0LmFzc2lnbihsb2NhbERhdGEsIG9wdGlvbnMuZGF0YSk7XG5cbiAgICAgIC8qIFNob3cgdGhlIG5vdGlmaWNhdGlvbiAqL1xuICAgICAgcmVnaXN0cmF0aW9uLnNob3dOb3RpZmljYXRpb24oXG4gICAgICAgIHRpdGxlLFxuICAgICAgICB7XG4gICAgICAgICAgaWNvbjogb3B0aW9ucy5pY29uLFxuICAgICAgICAgIGJvZHk6IG9wdGlvbnMuYm9keSxcbiAgICAgICAgICB2aWJyYXRlOiBvcHRpb25zLnZpYnJhdGUsXG4gICAgICAgICAgdGFnOiBvcHRpb25zLnRhZyxcbiAgICAgICAgICBkYXRhOiBsb2NhbERhdGEsXG4gICAgICAgICAgcmVxdWlyZUludGVyYWN0aW9uOiBvcHRpb25zLnJlcXVpcmVJbnRlcmFjdGlvbixcbiAgICAgICAgICBzaWxlbnQ6IG9wdGlvbnMuc2lsZW50XG4gICAgICAgIH1cbiAgICAgICkudGhlbigoKSA9PiB7XG5cbiAgICAgICAgcmVnaXN0cmF0aW9uLmdldE5vdGlmaWNhdGlvbnMoKS50aGVuKG5vdGlmaWNhdGlvbnMgPT4ge1xuICAgICAgICAgIC8qIFNlbmQgYW4gZW1wdHkgbWVzc2FnZSBzbyB0aGUgU2VydmljZVdvcmtlciBrbm93cyB3aG8gdGhlIGNsaWVudCBpcyAqL1xuICAgICAgICAgIHJlZ2lzdHJhdGlvbi5hY3RpdmUucG9zdE1lc3NhZ2UoJycpO1xuXG4gICAgICAgICAgLyogVHJpZ2dlciBjYWxsYmFjayAqL1xuICAgICAgICAgIGNhbGxiYWNrKG5vdGlmaWNhdGlvbnMpO1xuICAgICAgICB9KTtcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihNZXNzYWdlcy5lcnJvcnMuc3dfbm90aWZpY2F0aW9uX2Vycm9yICsgZXJyb3IubWVzc2FnZSk7XG4gICAgICB9KTtcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKE1lc3NhZ2VzLmVycm9ycy5zd19yZWdpc3RyYXRpb25fZXJyb3IgKyBlcnJvci5tZXNzYWdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZSBhbGwgbm90aWZpY2F0aW9uXG4gICAqL1xuICBjbG9zZSgpIHtcbiAgICB0aGlzLl93aW4uZXh0ZXJuYWwubXNTaXRlTW9kZUNsZWFySWNvbk92ZXJsYXkoKVxuICB9XG59XG4iLCJpbXBvcnQgQWJzdHJhY3RBZ2VudCBmcm9tICcuL0Fic3RyYWN0QWdlbnQnO1xuXG4vKipcbiAqIE5vdGlmaWNhdGlvbiBhZ2VudCBmb3IgbW9kZXJuIGRlc2t0b3AgYnJvd3NlcnM6XG4gKiBTYWZhcmkgNissIEZpcmVmb3ggMjIrLCBDaHJvbWUgMjIrLCBPcGVyYSAyNStcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9iaWxlRmlyZWZveEFnZW50IGV4dGVuZHMgQWJzdHJhY3RBZ2VudCB7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBib29sZWFuIGRlbm90aW5nIHN1cHBvcnRcbiAgICogQHJldHVybnMge0Jvb2xlYW59IGJvb2xlYW4gZGVub3Rpbmcgd2hldGhlciB3ZWJraXQgbm90aWZpY2F0aW9ucyBhcmUgc3VwcG9ydGVkXG4gICAqL1xuICBpc1N1cHBvcnRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fd2luLm5hdmlnYXRvci5tb3pOb3RpZmljYXRpb24gIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IG5vdGlmaWNhdGlvblxuICAgKiBAcGFyYW0gdGl0bGUgLSBub3RpZmljYXRpb24gdGl0bGVcbiAgICogQHBhcmFtIG9wdGlvbnMgLSBub3RpZmljYXRpb24gb3B0aW9ucyBhcnJheVxuICAgKiBAcmV0dXJucyB7Tm90aWZpY2F0aW9ufVxuICAgKi9cbiAgY3JlYXRlKHRpdGxlLCBvcHRpb25zKSB7XG4gICAgbGV0IG5vdGlmaWNhdGlvbiA9IHRoaXMuX3dpbi5uYXZpZ2F0b3IubW96Tm90aWZpY2F0aW9uLmNyZWF0ZU5vdGlmaWNhdGlvbihcbiAgICAgIHRpdGxlLFxuICAgICAgb3B0aW9ucy5ib2R5LFxuICAgICAgb3B0aW9ucy5pY29uXG4gICAgKTtcblxuICAgIG5vdGlmaWNhdGlvbi5zaG93KCk7XG5cbiAgICByZXR1cm4gbm90aWZpY2F0aW9uO1xuICB9XG59XG4iLCJpbXBvcnQgQWJzdHJhY3RBZ2VudCBmcm9tICcuL0Fic3RyYWN0QWdlbnQnO1xuXG4vKipcbiAqIE5vdGlmaWNhdGlvbiBhZ2VudCBmb3Igb2xkIENocm9tZSB2ZXJzaW9ucyAoYW5kIHNvbWUpIEZpcmVmb3hcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViS2l0QWdlbnQgZXh0ZW5kcyBBYnN0cmFjdEFnZW50IHtcblxuICAvKipcbiAgICogUmV0dXJucyBhIGJvb2xlYW4gZGVub3Rpbmcgc3VwcG9ydFxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gYm9vbGVhbiBkZW5vdGluZyB3aGV0aGVyIHdlYmtpdCBub3RpZmljYXRpb25zIGFyZSBzdXBwb3J0ZWRcbiAgICovXG4gIGlzU3VwcG9ydGVkKCkge1xuICAgIHJldHVybiB0aGlzLl93aW4ud2Via2l0Tm90aWZpY2F0aW9ucyAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgbm90aWZpY2F0aW9uXG4gICAqIEBwYXJhbSB0aXRsZSAtIG5vdGlmaWNhdGlvbiB0aXRsZVxuICAgKiBAcGFyYW0gb3B0aW9ucyAtIG5vdGlmaWNhdGlvbiBvcHRpb25zIGFycmF5XG4gICAqIEByZXR1cm5zIHtOb3RpZmljYXRpb259XG4gICAqL1xuICBjcmVhdGUodGl0bGUsIG9wdGlvbnMpIHtcbiAgICBsZXQgbm90aWZpY2F0aW9uID0gdGhpcy5fd2luLndlYmtpdE5vdGlmaWNhdGlvbnMuY3JlYXRlTm90aWZpY2F0aW9uKFxuICAgICAgb3B0aW9ucy5pY29uLFxuICAgICAgdGl0bGUsXG4gICAgICBvcHRpb25zLmJvZHlcbiAgICApO1xuXG4gICAgbm90aWZpY2F0aW9uLnNob3coKTtcblxuICAgIHJldHVybiBub3RpZmljYXRpb247XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2UgYSBnaXZlbiBub3RpZmljYXRpb25cbiAgICogQHBhcmFtIG5vdGlmaWNhdGlvbiAtIG5vdGlmaWNhdGlvbiB0byBjbG9zZVxuICAgKi9cbiAgY2xvc2Uobm90aWZpY2F0aW9uKSB7XG4gICAgbm90aWZpY2F0aW9uLmNhbmNlbCgpO1xuICB9XG59XG4iLCJpbXBvcnQgUHVzaCBmcm9tICcuL2NsYXNzZXMvUHVzaCc7XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFB1c2godHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB0aGlzKTtcbiJdfQ==
