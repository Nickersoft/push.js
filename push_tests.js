describe('initialization', function () {

    it('should create a new instance', function () {
        expect(window.Push !== undefined).toBeTruthy();
    });

    it('isSupported should return a boolean', function () {
        expect(typeof Push.isSupported).toBe('boolean');
    });

});

describe('permission', function () {
    var callback, // Empty callback
        noop; // No operator (empty function)

    beforeEach(function () {
        callback = jasmine.createSpy('callback');
        noop = function () {};
    });

    it('should have permission stored as a string constant', function () {
        expect(typeof Push.Permission.get()).toBe('string');
    });

    it('should update permission value if permission is denied and execute callback', function (done) {
        spyOn(window.Notification, 'requestPermission').and.callFake(function (cb) {
            cb(Push.Permission.DENIED);
        });
        Push.Permission.request(noop, callback);
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
        Push.create('hello world!');
        expect(window.Notification.requestPermission).toHaveBeenCalled();
    });


    it('should update permission value if permission is granted and execute callback', function (done) {
        spyOn(window.Notification, 'requestPermission').and.callFake(function (cb) {
            cb(Push.Permission.GRANTED);
        });
        Push.Permission.request(callback, noop);
        setTimeout(function () {
            expect(Push.Permission.has()).toBe(true);
            expect(callback).toHaveBeenCalled();
            done();
        }, 500);
    });

});

describe('creating notifications', function () {
    var callback;

    beforeAll(function () {
        jasmine.clock().install();
        spyOn(window.Notification, 'requestPermission').and.callFake(function (cb) {
            cb(Push.Permission.GRANTED);
        });
    });

    beforeEach(function () {
        callback = jasmine.createSpy('callback');
        Push.clear();
    });

    it('should throw exception if no title is provided', function () {
        expect(function() {
            Push.create();
        }).toThrow();
    });

    it('should return promise successfully', function () {
        var wrapper = Push.create('hello world');
        expect(wrapper.then).not.toBe(undefined);
    });

    it('should return the increase the notification count', function () {
        var count;
        expect(Push.count()).toBe(0);
        Push.create('hello world!');
        expect(Push.count()).toBe(1);
    });

});

describe('closing notifications', function () {

    beforeEach(function () {
        Push.clear();
    });

    it('should close notifications if a timeout is specified', function () {
        spyOn(window.Notification, 'requestPermission').and.callFake(function (cb) {
            cb(Push.Permission.GRANTED);
        });
        spyOn(window.Notification.prototype, 'close');
        Push.create('hello world!', {
            timeout: 1000
        });
        expect(Push.count()).toBe(1);
        expect(window.Notification.prototype.close).not.toHaveBeenCalled();
        jasmine.clock().tick(1000);
        expect(window.Notification.prototype.close).toHaveBeenCalled();
        expect(Push.count()).toBe(0);
    });

    it('should close a notification given a tag', function () {
        var count, promise;
        spyOn(window.Notification.prototype, 'close');
        Push.create('hello world!', {
            tag: 'foo'
        });
        expect(Push.count()).toBe(1);
        expect(Push.close('foo')).toBeTruthy();
        expect(window.Notification.prototype.close).toHaveBeenCalled();
        expect(Push.count()).toBe(0);
    });

    it('should close all notifications when cleared', function () {
        spyOn(window.Notification.prototype, 'close');
        Push.create('hello world!', {
            tag: 'foo'
        });
        Push.create('hello world!', {
            tag: 'bar'
        });
        expect(Push.count()).toBe(2);
        expect(Push.clear()).toBeTruthy();
        expect(window.Notification.prototype.close).toHaveBeenCalled();
        expect(Push.count()).toBe(0);
    });
});
