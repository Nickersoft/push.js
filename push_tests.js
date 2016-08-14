var
TEST_TITLE = 'title',
TEST_BODY = 'body',
TEST_TIMEOUT = 1000,
TEST_TIMEOUT_LONG = 50000,
TEST_TAG = 'foo',
TEST_TAG_2 = 'bar',
TEST_ICON = 'icon',
TEST_ICON_ARRAY = { x16: TEST_ICON, x32: TEST_ICON },
TEST_SW = 'customServiceWorker.js',
TEST_SW_DEFAULT = "sw.js"
NOOP = function () {}; // NO OPerator (empty function)

describe('initialization', function () {

    it('should create a new instance', function () {
        expect(window.Push !== undefined).toBeTruthy();
    });

    it('isSupported should return a boolean', function () {
        expect(typeof Push.isSupported).toBe('boolean');
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
        spyOn(window.Notification, 'requestPermission').and.callFake(function (cb) {
            cb(Push.Permission.DENIED);
        });
        Push.Permission.request(NOOP, callback);
        setTimeout(function () {
            expect(Push.Permission.has()).toBe(false);
            expect(callback).toHaveBeenCalled();
            done();
        }, 500);
    });

    it('should request permission if permission is not granted', function () {
        spyOn(window.Notification, 'requestPermission').and.callFake(function (cb) {
            cb(Push.Permission.DENIED);
        });
        Push.Permission.request();
        Push.create(TEST_TITLE);
        expect(window.Notification.requestPermission).toHaveBeenCalled();
    });


    it('should update permission value if permission is granted and execute callback', function (done) {
        spyOn(window.Notification, 'requestPermission').and.callFake(function (cb) {
            cb(Push.Permission.GRANTED);
        });
        Push.Permission.request(callback, NOOP);
        setTimeout(function () {
            expect(Push.Permission.has()).toBe(true);
            expect(callback).toHaveBeenCalled();
            done();
        }, 500);
    });

});

describe('creating notifications', function () {
    beforeAll(function () {
        jasmine.clock().install();
        spyOn(window.Notification, 'requestPermission').and.callFake(function (cb) {
            cb(Push.Permission.GRANTED);
        });
    });

    beforeEach(function () {
        Push.clear();
    });

    it('should throw exception if no title is provided', function () {
        expect(function() {
            Push.create();
        }).toThrow();
    });

    it('should return a valid notification wrapper', function(done) {
        var promise = Push.create(TEST_TITLE);
        promise.then(function(wrapper) {
            expect(wrapper).not.toBe(undefined);
            expect(wrapper.get).not.toBe(undefined);
            expect(wrapper.close).not.toBe(undefined);
            done();
        });
    });

    it('should return promise successfully', function () {
        var promise = Push.create(TEST_TITLE);
        expect(promise.then).not.toBe(undefined);
    });

    it('should pass in all API options correctly', function(done) {
        // Vibrate omitted because Firefox will default to using the Notification API, not service workers
        // Timeout, requestPermission, and event listeners also omitted from this test :(
        var promise = Push.create(TEST_TITLE, {
            body: TEST_BODY,
            icon: TEST_ICON,
            tag: TEST_TAG,
            serviceWorker: TEST_SW
        });

        promise.then(function(wrapper) {
            var notification = wrapper.get();
            expect(notification.title).toBe(TEST_TITLE);
            expect(notification.body).toBe(TEST_BODY);
            expect(notification.icon).toBe(TEST_ICON);
            expect(notification.tag).toBe(TEST_TAG);
            expect(Push.__lastWorkerPath()).toBe(TEST_SW);
            done();
        });
    });

    it('should use "sw.js" as a service worker path if one is not specified', function(done) {
        var promise = Push.create(TEST_TITLE);
        promise.then(function(wrapper) {
            expect(Push.__lastWorkerPath()).toBe(TEST_SW_DEFAULT);
            done();
        });
    });

    it('should return the increase the notification count', function () {
        var count;
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
        promise.then(function(wrapper) {
            var notification = wrapper.get();
            notification.dispatchEvent(event);
            expect(callback).toHaveBeenCalled();
            cb();
        });
    };

    beforeAll(function () {
        spyOn(window.Notification, 'requestPermission').and.callFake(function (cb) {
            cb(Push.Permission.GRANTED);
        });
    });

    beforeEach(function () {
        callback = jasmine.createSpy('callback');
    });

    it('should execute onClick listener correctly', function(done) {
        testListener('click', done);
    });

    it('should execute onShow listener correctly', function(done) {
        testListener('show', done);
    });

    it('should execute onError listener correctly', function(done) {
        testListener('error', done);
    });

    it('should execute onClose listener correctly', function(done) {
        testListener('close', done);
    });
});

describe('closing notifications', function () {
    beforeAll(function () {
        spyOn(window.Notification, 'requestPermission').and.callFake(function (cb) {
            cb(Push.Permission.GRANTED);
        });
    });

    beforeEach(function () {
        spyOn(window.Notification.prototype, 'close');
        Push.clear();
    });

    it('should close notifications using wrapper', function (done) {
        var promise;
        promise = Push.create(TEST_TITLE, {
            onClose: callback
        });
        expect(Push.count()).toBe(1);
        promise.then(function(wrapper) {
            wrapper.close();
            expect(window.Notification.prototype.close).toHaveBeenCalled();
            expect(Push.count()).toBe(0);
            done();
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
        var count, promise;
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
        expect(Push.count()).toBe(2);
        expect(Push.clear()).toBeTruthy();
        expect(window.Notification.prototype.close).toHaveBeenCalled();
        expect(Push.count()).toBe(0);
    });
});
