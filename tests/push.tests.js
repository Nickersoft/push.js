var
  BROWSER_CHROME = 'Chrome',
  BROWSER_FIREFOX = 'Firefox',

  TEST_TITLE = 'title',
  TEST_BODY = 'body',
  TEST_TIMEOUT = 1000,
  TEST_TAG = 'foo',
  TEST_TAG_2 = 'bar',
  TEST_ICON = 'icon',
  TEST_SW_DEFAULT = "./base/src/serviceWorker.js",

  NOOP = function () {
    return null;
  };

describe('proper support detection', function () {
  function isBrowser(browser) {
    return platform.name === browser;
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
});

if (Push.supported()) {
  Push.config({
    serviceWorker: TEST_SW_DEFAULT
  });

  function initRequestSpy(granted) {
    var spy, param = (granted) ? Push.Permission.GRANTED : Push.Permission.DENIED;

    /* Safari 6+, Chrome 23+ */
    if (window.Notification && window.Notification.requestPermission)
      spy = spyOn(window.Notification, 'requestPermission');

    /* Legacy webkit browsers */
    else if (window.webkitNotifications && window.webkitNotifications.checkPermission)
      spy = spyOn(window.webkitNotifications, 'requestPermission');

    if (spy)
      spy.and.callFake(function (cb) {
        cb(param);
      });
  }

  function getRequestObject() {
    var obj = {};

    /* Safari 6+, Chrome 23+ */
    if (window.Notification && window.Notification.requestPermission)
      return window.Notification.requestPermission;

    /* Legacy webkit browsers */
    else if (window.webkitNotifications && window.webkitNotifications.checkPermission)
      return window.webkitNotifications.requestPermission;

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

    it('should update permission value if permission is denied and execute callback', function (done) {
      initRequestSpy(false);

      Push.Permission.request(NOOP, callback);

      setTimeout(function () {
        expect(Push.Permission.has()).toBe(false);
        expect(callback).toHaveBeenCalled();
        done();
      }, 500);
    });

    it('should request permission if permission is not granted', function () {
      initRequestSpy(false);

      Push.Permission.request();
      Push.create(TEST_TITLE);

      expect(getRequestObject()).toHaveBeenCalled();
    });

    it('should update permission value if permission is granted and execute callback', function (done) {
      spyOn(Push.Permission, 'get').and.returnValue(Push.Permission.GRANTED);
      initRequestSpy(true);

      Push.Permission.request(callback, NOOP);

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
      Push.create(TEST_TITLE);

      expect(getRequestObject()).not.toHaveBeenCalled();
    });
  });

  describe('creating notifications', function () {
    beforeAll(function () {
      jasmine.clock().install();
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
      var promise = Push.create(TEST_TITLE);

      promise.then(function (wrapper) {
        expect(wrapper).not.toBe(undefined);
        expect(wrapper.get).not.toBe(undefined);
        expect(wrapper.close).not.toBe(undefined);
        done();
      }).catch(function () {
      });
    });

    it('should return promise successfully', function () {
      var promise = Push.create(TEST_TITLE);
      expect(promise.then).not.toBe(undefined);
    });

    it('should pass in all API options correctly', function (done) {
      // Vibrate omitted because Firefox will default to using the Notification API, not service workers
      // Timeout, requestPermission, and event listeners also omitted from this src :(
      var promise = Push.create(TEST_TITLE, {
        body: TEST_BODY,
        icon: TEST_ICON,
        tag: TEST_TAG,
        silent: true
      });

      promise.then(function (wrapper) {
        var notification = wrapper.get();

        expect(notification.title).toBe(TEST_TITLE);
        expect(notification.body).toBe(TEST_BODY);
        expect(notification.icon).toContain(TEST_ICON); // Some browsers append the document location, so we gotta use toContain()
        expect(notification.tag).toBe(TEST_TAG);

        if (notification.hasOwnProperty('silent'))
          expect(notification.silent).toBe(true);

        done();
      }).catch(function () {
      });
    });

    it('should return the increase the notification count', function () {
      expect(Push.count()).toBe(0);

      Push.create(TEST_TITLE);

      expect(Push.count()).toBe(1);
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

        promise = Push.create(TEST_TITLE, options);
        promise.then(function (wrapper) {
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
      Push.clear();
      callback = jasmine.createSpy('callback');
    });

    it('should close notifications on close callback', function (done) {
      var promise;

      promise = Push.create(TEST_TITLE, {
        onClose: callback
      });

      expect(Push.count()).toBe(1);

      promise.then(function (wrapper) {
        var notification = wrapper.get();
        notification.dispatchEvent(new Event('close'));
        expect(Push.count()).toBe(0);
        done();
      }).catch(function () {
      });
    });

    it('should close notifications using wrapper', function (done) {
      var promise;

      promise = Push.create(TEST_TITLE, {
        onClose: callback
      });

      expect(Push.count()).toBe(1);

      promise.then(function (wrapper) {
        wrapper.close();
        expect(window.Notification.prototype.close).toHaveBeenCalled();
        expect(Push.count()).toBe(0);
        done();
      }).catch(function () {
      });
    });

    it('should close notifications using given timeout', function () {
      Push.create(TEST_TITLE, {
        timeout: TEST_TIMEOUT
      });

      expect(Push.count()).toBe(1);
      expect(window.Notification.prototype.close).not.toHaveBeenCalled();

      jasmine.clock().tick(TEST_TIMEOUT);

      expect(window.Notification.prototype.close).toHaveBeenCalled();
      expect(Push.count()).toBe(0);
    });

    it('should close a notification given a tag', function () {
      Push.create(TEST_TITLE, {
        tag: TEST_TAG
      });

      expect(Push.count()).toBe(1);
      expect(Push.close(TEST_TAG)).toBeTruthy();
      expect(window.Notification.prototype.close).toHaveBeenCalled();
      expect(Push.count()).toBe(0);
    });

    it('should close all notifications when cleared', function () {
      Push.create(TEST_TITLE, {
        tag: TEST_TAG
      });

      Push.create('hello world!', {
        tag: TEST_TAG_2
      });

      expect(Push.count()).toBeGreaterThan(0);
      expect(Push.clear()).toBeTruthy();
      expect(window.Notification.prototype.close).toHaveBeenCalled();
      expect(Push.count()).toBe(0);
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
        serviceWorker: TEST_SW_DEFAULT
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
}
