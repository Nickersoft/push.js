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
    });

    beforeEach(function () {
        callback = jasmine.createSpy('callback');
    });

    it('should throw exception if no title is provided', function () {
        expect(function() {
            Push.create();
        }).toThrow();
    });

    it('should request permission if permission is not granted', function () {

        spyOn(window.Notification, 'requestPermission').and.callFake(function (cb) {
            cb(Push.Permission.DENIED);
        });

        Push.Permission.request();

        Push.create('hello world!');

        expect(window.Notification.requestPermission).toHaveBeenCalled();
    });

    it('should close notifications if a timeout is specified', function () {

        spyOn(window.Notification, 'requestPermission').and.callFake(function (cb) {
            cb(Push.Permission.GRANTED);
        });

        spyOn(window.Notification.prototype, 'close');

        Push.create('hello world!', {
            timeout: 1000
        });

        expect(window.Notification.prototype.close).not.toHaveBeenCalled();

        jasmine.clock().tick(1000);

        expect(window.Notification.prototype.close).toHaveBeenCalled();

    });
});
