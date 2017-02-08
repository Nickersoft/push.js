import Messages from './messages';

export default class Permission {

    constructor(win, doc) {
        this._win = win;
        this._doc = doc;
        this.DEFAULT = 'default';
        this.GRANTED = 'granted';
        this.DENIED = 'denied';
        this._permissions = [
            this.DEFAULT,
            this.GRANTED,
            this.DENIED
        ];
    }

    /**
     * Requests permission for desktop notifications
     * @param {Function} callback - Function to execute once permission is granted
     * @return {void}
     */
    request(onGranted, onDenied) {
        const existing = this.get();

        /* Default callback */
        callback = result => {
            switch (result) {

                case this.GRANTED:
                    if (onGranted) onGranted();
                    break;

                case this.DENIED:
                    if (onDenied) onDenied();
                    break;
            }
        };

        /* Permissions already set */
        if (existing !== this.DEFAULT)
            callback(existing);

        /* Safari 6+, Chrome 23+ */
        else if (this._win.Notification && this._win.Notification.requestPermission)
            this._win.Notification.requestPermission(callback);

        /* Legacy webkit browsers */
        else if (this._win.webkitNotifications && this._win.webkitNotifications.checkPermission)
            this._win.webkitNotifications.requestPermission(callback);

        else
            throw new Error(Messages.errors.incompatible);
    };

    /**
     * Returns whether Push has been granted permission to run
     * @return {Boolean}
     */
    has() {
        return this.get() === this.GRANTED;
    }

    /**
     * Gets the permission level
     * @return {Permission} The permission level
     */
    get() {
        let permission;

        /* Safari 6+, Chrome 23+ */
        if (this._win.Notification && this._win.Notification.permissionLevel)
            permission = this._win.Notification.permissionLevel;

        /* Legacy webkit browsers */
        else if (this._win.webkitNotifications && this._win.webkitNotifications.checkPermission)
            permission = this._permissions[this._win.webkitNotifications.checkPermission()];

        /* Firefox 23+ */
        else if (this._win.Notification && this._win.Notification.permission)
            permission = this._win.Notification.permission;

        /* Firefox Mobile */
        else if (navigator.mozNotification)
            permission = this.GRANTED;

        /* IE9+ */
        else if (this._win.external && this._win.external.msIsSiteMode() !== undefined)
            permission = this._win.external.msIsSiteMode() ? this.GRANTED : this.DEFAULT;

        else
            throw new Error(Messages.errors.incompatible);

        return permission;
    };
}
