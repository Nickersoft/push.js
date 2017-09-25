var
  BROWSER_CHROME = 'Chrome',
  BROWSER_FIREFOX = 'Firefox',
  BROWSER_EDGE = 'Edge',
  BROWSER_OPERA = 'Opera',

  TEST_TITLE = 'title',
  TEST_BODY = 'body',
  TEST_TIMEOUT = 1000,
  TEST_TAG = 'foo',
  TEST_TAG_2 = 'bar',
  TEST_ICON = 'icon',
  TEST_SW_DEFAULT = "/serviceWorker.min.js",

  NOOP = function () {
    return null;
  };

describe('proper support detection', function () {
  function isBrowser(browser) {
    return platform.name.toLowerCase() === browser.toLowerCase();
  }

  function getVersion() {
    return parseFloat(platform.version);
  }

  function isSupported() {
    return Push.supported();
  }

  it('should detect Firefox support correctly', function () {
    if (isBrowser(BROWSER_FIREFOX)) {
      if (getVersion() > 21)
        expect(isSupported()).toBeTruthy();
      else
        expect(isSupported()).toBeFalsy();
    } else {
      pending();
    }
  });

  it('should detect Chrome support correctly', function () {
    if (isBrowser(BROWSER_CHROME)) {
      if (getVersion() > 4)
        expect(isSupported()).toBeTruthy();
      else
        expect(isSupported()).toBeFalsy();
    } else {
      pending();
    }
  });

  it('should detect Opera support correctly', function () {
    if (isBrowser(BROWSER_OPERA)) {
      if (getVersion() > 23)
        expect(isSupported()).toBeTruthy();
      else
        expect(isSupported()).toBeFalsy();
    } else {
      pending();
    }
  });

  it('should detect Edge support correctly', function () {
    if (isBrowser(BROWSER_EDGE)) {
      if (getVersion() > 14)
        expect(isSupported()).toBeTruthy();
      else
        expect(isSupported()).toBeFalsy();
    } else {
      pending();
    }
  });
});

describe('adding plugins', function () {
  it('reject invalid plugin manifests', function () {
    var testPlugin = function () {
      this.testFunc = function () {
      }
    };

    expect(Push.extend.bind(Push, testPlugin)).toThrow()
  });

  it('accept valid plugin manifests', function () {
    var testPlugin = {
      plugin: function () {
        this.testFunc = function () {
        }
      }
    };

    Push.extend(testPlugin);

    expect(Push.testFunc).toBeDefined()
  });

  it('only allow object-based configs', function () {
    spyOn(window.Push, 'config');

    var testPlugin = {
      config: null,
      plugin: function () {
        this.testFunc = function () {
        }
      }
    };

    Push.extend(testPlugin);

    expect(Push.config.calls.count()).toEqual(1); // config() is called one by default in extend()

    var testPlugin2 = {
      config: {},
      plugin: function () {
        this.testFunc = function () {
        }
      }
    };

    Push.extend(testPlugin2);

    expect(Push.config.calls.count()).toBeGreaterThan(1);
  });
});

describe('changing configuration', function () {
  it('returns the current configuration if no parameters passed', function () {
    var output = {
      serviceWorker: TEST_SW_DEFAULT,
      fallback: function (payload) {
      }
    };

    expect(JSON.stringify(Push.config())).toBe(JSON.stringify(output));
  });

  it('adds a configuration if one is specified', function () {
    Push.config({
      a: 1
    });

    expect(Push.config().a).toBeDefined();
    expect(Push.config().a).toBe(1);
  });

  it('should be capable of performing a deep merge', function () {
    var input1 = {
      b: {
        c: 1,
        d: {
          e: 2,
          f: 3
        }
      }
    };
    var input2 = {
      b: {
        d: {
          e: 2,
          f: 4
        },
        g: 5
      }
    };
    var output = {
      c: 1,
      d: {
        e: 2,
        f: 4,
      },
      g: 5
    };

    Push.config(input1);
    Push.config(input2);

    expect(Push.config().b).toBeDefined();
    expect(JSON.stringify(Push.config().b)).toBe(JSON.stringify(output));
  });
});

if (Push.supported()) {
  Push.config({
    serviceWorker: TEST_SW_DEFAULT
  });

  function initRequestSpy(granted) {
    var param_str, param_int;

    param_str = (granted) ? Push.Permission.GRANTED : Push.Permission.DEFAULT;
    param_int = (granted) ? 0 : 1;

    /* Safari 6+, Legacy webkit browsers */
    if (window.webkitNotifications && window.webkitNotifications.checkPermission) {
      spyOn(window.webkitNotifications, 'requestPermission').and.callFake(function (cb) {
        cb(param_int);
      });
    }
    /* Chrome 23+ */
    else if (window.Notification && window.Notification.requestPermission) {
      spyOn(window.Notification, 'requestPermission').and.callFake(function () {
        return new Promise(function (resolve) {
          resolve(param_str);
        });
      });
    }
  }

  function getRequestObject() {
    var obj = {};

    /* Safari 6+, Legacy webkit browsers */
    if (window.webkitNotifications && window.webkitNotifications.checkPermission)
      return window.webkitNotifications.requestPermission;

    /* Chrome 23+ */
    else if (window.Notification && window.Notification.requestPermission)
      return window.Notification.requestPermission;
    return null;
  }

  describe('initialization', function () {

    it('should create a new instance', function () {
      expect(window.Push !== undefined).toBeTruthy();
    });

    it('isSupported should return a boolean', function () {
      expect(typeof Push.supported()).toBe('boolean');
    });

  });

  describe('permission', function () {
    var callback; // Callback spy

    beforeEach(function () {
      callback = jasmine.createSpy('callback');
    });

    it('should have permission stored as a string constant', function () {
      expect(typeof Push.Permission.get()).toBe('string');
    });

    it('should update permission value if permission is denied and execute callback (deprecated)', function (done) {
      spyOn(Push.Permission, 'get').and.returnValue(Push.Permission.DEFAULT);
      initRequestSpy(false);

      Push.Permission.request(NOOP, callback);

      setTimeout(function () {
        expect(Push.Permission.has()).toBe(false);
        expect(callback).toHaveBeenCalled();
        done();
      }, 500);
    });

    it('should update permission value if permission is denied and execute callback (with promise)', function (done) {
      spyOn(Push.Permission, 'get').and.returnValue(Push.Permission.DEFAULT);
      initRequestSpy(false);

      Push.Permission.request().then(NOOP).catch(callback);

      setTimeout(function () {
        expect(Push.Permission.has()).toBe(false);
        expect(callback).toHaveBeenCalled();
        done();
      }, 500);
    });

    it('should request permission if permission is not granted', function () {
      spyOn(Push.Permission, 'get').and.returnValue(Push.Permission.DEFAULT);
      initRequestSpy(false);

      Push.create(TEST_TITLE).then(function () {
        expect(getRequestObject()).toHaveBeenCalled();
      }).catch(function () {
      });
    });

    it('should update permission value if permission is granted and execute callback (deprecated)', function (done) {
      spyOn(Push.Permission, 'get').and.returnValue(Push.Permission.GRANTED);
      initRequestSpy(true);

      Push.Permission.request(callback, NOOP);

      setTimeout(function () {
        expect(Push.Permission.has()).toBe(true);
        expect(callback).toHaveBeenCalled();
        done();
      }, 500);
    });

    it('should update permission value if permission is granted and execute callback (with promise)', function (done) {
      spyOn(Push.Permission, 'get').and.returnValue(Push.Permission.GRANTED);
      initRequestSpy(true);

      Push.Permission.request().then(callback).catch(NOOP);

      setTimeout(function () {
        expect(Push.Permission.has()).toBe(true);
        expect(callback).toHaveBeenCalled();
        done();
      }, 500);
    });

    it('should not request permission if permission is already granted', function () {
      spyOn(Push.Permission, 'get').and.returnValue(Push.Permission.GRANTED);
      initRequestSpy(true);

      Push.Permission.request();
      Push.create(TEST_TITLE).then(function () {
        expect(getRequestObject()).not.toHaveBeenCalled();
      }).catch(function () {
      });
    });
  });

  describe('creating notifications', function () {
    beforeAll(function () {
      jasmine.clock().install();
      spyOn(Push.Permission, 'get').and.returnValue(Push.Permission.DEFAULT);
      initRequestSpy(true);
    });

    beforeEach(function () {
      Push.clear();
    });

    it('should throw exception if no title is provided', function () {
      expect(function () {
        Push.create();
      }).toThrow();
    });

    it('should return a valid notification wrapper', function (done) {
      Push.create(TEST_TITLE).then(function (wrapper) {
        expect(wrapper).not.toBe(undefined);
        expect(wrapper.get).not.toBe(undefined);
        expect(wrapper.close).not.toBe(undefined);
        done();
      }).catch(function () {
      });
    });

    it('should return promise successfully', function () {
      var promise = Push.create(TEST_TITLE).then(function () {
        expect(promise.then).not.toBe(undefined);
      }).catch(function () {
      });
    });

    it('should pass in all API options correctly', function (done) {
      // Vibrate omitted because Firefox will default to using the Notification API, not service workers
      // Timeout, requestPermission, and event listeners also omitted from this src :(
      Push.create(TEST_TITLE, {
        body: TEST_BODY,
        icon: TEST_ICON,
        tag: TEST_TAG,
        silent: true
      }).then(function (wrapper) {
        var notification = wrapper.get();

        // Some browsers, like Safari, choose to omit this info
        if (notification.title) expect(notification.title).toBe(TEST_TITLE);
        if (notification.body) expect(notification.body).toBe(TEST_BODY);
        if (notification.icon) expect(notification.icon).toContain(TEST_ICON); // Some browsers append the document location, so we gotta use toContain()

        expect(notification.tag).toBe(TEST_TAG);

        if (notification.hasOwnProperty('silent'))
          expect(notification.silent).toBe(true);

        done();
      }).catch(function () {
      });
    });

    it('should return the increase the notification count', function (done) {
      expect(Push.count()).toBe(0);

      Push.create(TEST_TITLE).then(function () {
        expect(Push.count()).toBe(1);
        done();
      }).catch(function () {
      });
    });

  });

  describe('event listeners', function () {
    var callback, // callback spy

      testListener = function (name, cb) {
        var event = new Event(name),
          options = {},
          key,
          promise;

        key = 'on' + name[0].toUpperCase() + name.substr(1, name.length - 1);

        options[key] = callback;

        Push.create(TEST_TITLE, options).then(function (wrapper) {
          var notification = wrapper.get();
          notification.dispatchEvent(event);
          expect(callback).toHaveBeenCalled();
          cb();
        }).catch(function () {
        });
      };

    beforeAll(function () {
      initRequestSpy(true);
    });

    beforeEach(function () {
      callback = jasmine.createSpy('callback');
      spyOn(Push.Permission, 'get').and.returnValue(Push.Permission.DEFAULT);
    });

    it('should execute onClick listener correctly', function (done) {
      testListener('click', done);
    });

    it('should execute onShow listener correctly', function (done) {
      testListener('show', done);
    });

    it('should execute onError listener correctly', function (done) {
      testListener('error', done);
    });

    it('should execute onClose listener correctly', function (done) {
      testListener('close', done);
    });
  });

  describe('closing notifications', function () {
    var callback; // Callback spy

    beforeAll(function () {
      initRequestSpy(true);
    });

    beforeEach(function () {
      spyOn(window.Notification.prototype, 'close');
      spyOn(Push.Permission, 'get').and.returnValue(Push.Permission.DEFAULT);
      Push.clear();
      callback = jasmine.createSpy('callback');
    });

    it('should close notifications on close callback', function (done) {
      Push.create(TEST_TITLE, {
        onClose: callback
      }).then(function (wrapper) {
        var notification = wrapper.get();
        expect(Push.count()).toBe(1);
        notification.dispatchEvent(new Event('close'));
        expect(Push.count()).toBe(0);
        done();
      }).catch(function () {
      });
    });

    it('should close notifications using wrapper', function (done) {
      Push.create(TEST_TITLE, {
        onClose: callback
      }).then(function (wrapper) {
        expect(Push.count()).toBe(1);
        wrapper.close();
        expect(window.Notification.prototype.close).toHaveBeenCalled();
        expect(Push.count()).toBe(0);
        done();
      }).catch(function () {
      });
    });

    it('should close notifications using given timeout', function (done) {
      Push.create(TEST_TITLE, {
        timeout: TEST_TIMEOUT
      }).then(function () {
        expect(Push.count()).toBe(1);
        expect(window.Notification.prototype.close).not.toHaveBeenCalled();

        jasmine.clock().tick(TEST_TIMEOUT);

        expect(window.Notification.prototype.close).toHaveBeenCalled();
        expect(Push.count()).toBe(0);
        done();
      }).catch(function () {
      });
      ;
    });

    it('should close a notification given a tag', function (done) {
      Push.create(TEST_TITLE, {
        tag: TEST_TAG
      }).then(function () {
        expect(Push.count()).toBe(1);
        expect(Push.close(TEST_TAG)).toBeTruthy();
        expect(window.Notification.prototype.close).toHaveBeenCalled();
        expect(Push.count()).toBe(0);
        done();
      }).catch(function () {
      });
      ;
    });

    it('should close all notifications when cleared', function (done) {
      Push.create(TEST_TITLE, {
        tag: TEST_TAG
      }).then(function () {
        Push.create('hello world!', {
          tag: TEST_TAG_2
        }).then(function () {
          expect(Push.count()).toBeGreaterThan(0);
          expect(Push.clear()).toBeTruthy();
          expect(window.Notification.prototype.close).toHaveBeenCalled();
          expect(Push.count()).toBe(0);
          done();
        }).catch(function () {
        });
        ;
      }).catch(function () {
      });
      ;
    });
  });
} else {
  describe('fallback functionality', function () {
    it('should ensure fallback method fires correctly', function () {
      var fallback = jasmine.createSpy('fallback');

      Push.config({
        fallback: fallback
      });

      Push.create(TEST_TITLE).then(function (done) {
        expect(fallback).toHaveBeenCalled();
        done();
      }).catch(function() {
      });
    });

    it('should ensure all notification options are passed to the fallback', function (done) {
      Push.config({
        fallback: function(payload) {
          expect(payload.title).toBe(TEST_TITLE);
          expect(payload.body).toBe(TEST_BODY);
          expect(payload.icon).toBe(TEST_ICON);
          expect(payload.tag).toBe(TEST_TAG);
          done();
        }
      });

      Push.create(TEST_TITLE, {
        body: TEST_BODY,
        icon: TEST_ICON,
        tag: TEST_TAG
      }).catch(function() {
      });
    });
  });
}
