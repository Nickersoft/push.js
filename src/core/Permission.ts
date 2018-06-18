export default class Permission {
    // Private members
    private permissions: string[];
    private win: Global;

    // Public members
    GRANTED: string;
    DEFAULT: string;
    DENIED: string;

    constructor(win: Global) {
        this.win = win;
        this.GRANTED = 'granted';
        this.DEFAULT = 'default';
        this.DENIED = 'denied';
        this.permissions = [this.GRANTED, this.DEFAULT, this.DENIED];
    }

    /**
     * Requests permission for desktop notifications
     * @param {Function} onGranted - Function to execute once permission is granted
     * @param {Function} onDenied - Function to execute once permission is denied
     * @return {void, Promise}
     */
    request(onGranted: () => void, onDenied: () => void) {
        return arguments.length > 0
            ? this.requestWithCallback(...arguments)
            : this._requestAsPromise();
    }

    /**
     * Old permissions implementation deprecated in favor of a promise based one
     * @deprecated Since V1.0.4
     * @param {Function} onGranted - Function to execute once permission is granted
     * @param {Function} onDenied - Function to execute once permission is denied
     * @return {void}
     */
    private requestWithCallback(onGranted: () => void, onDenied: () => void) {
        const existing = this.get();

        var resolved = false;
        var resolve = (result = this._win.Notification.permission) => {
            if (resolved) return;
            resolved = true;
            if (typeof result === 'undefined' && this._win.webkitNotifications)
                result = this._win.webkitNotifications.checkPermission();
            if (result === this.GRANTED || result === 0) {
                if (onGranted) onGranted();
            } else if (onDenied) onDenied();
        };
        var request;

        /* Permissions already set */
        if (existing !== this.DEFAULT) {
            resolve(existing);
        } else if (
            this.win.webkitNotifications &&
            this.win.webkitNotifications.checkPermission
        ) {
            /* Safari 6+, Legacy webkit browsers */
            this.win.webkitNotifications.requestPermission(resolve);
        } else if (
            this.win.Notification &&
            this.win.Notification.requestPermission
        ) {
            /* Safari 12+ */
            /* This resolve argument will only be used in Safari */
            /* CHrome, instead, returns a Promise */
            request = this._win.Notification.requestPermission(resolve);
            if (request && request.then) {
                /* Chrome 23+ */
                request.then(resolve).catch(function() {
                    if (onDenied) onDenied();
                });
            }
        } else if (onGranted) {
            /* Let the user continue by default */
            onGranted();
        }
    }
  }

    /**
     * Requests permission for desktop notifications in a promise based way
     * @return {Promise}
     */
    _requestAsPromise(): Promise<void> {
        const existing = this.get();

        let isGranted = result => result === this.GRANTED || result === 0;

        /* Permissions already set */
        var hasPermissions = existing !== this.DEFAULT;

        /* Safari 6+, Chrome 23+ */
        var isModernAPI =
            this.win.Notification && this.win.Notification.requestPermission;

        /* Legacy webkit browsers */
        var isWebkitAPI =
            this.win.webkitNotifications &&
            this.win.webkitNotifications.checkPermission;

        return new Promise((resolvePromise, rejectPromise) => {
            var resolved = false;
            var resolver = result => {
                if (resolved) return;
                resolved = true;
                isGranted(result) ? resolvePromise() : rejectPromise();
            };
            var request;

            if (hasPermissions) {
                resolver(existing);
            } else if (isWebkitAPI) {
                this.win.webkitNotifications.requestPermission(result => {
                    resolver(result);
                });
            } else if (isModernAPI) {
                /* Safari 12+ */
                /* This resolver argument will only be used in Safari */
                /* CHrome, instead, returns a Promise */
                request = this._win.Notification.requestPermission(resolver);
                if (request && request.then) {
                    /* Chrome 23+ */
                    request.then(resolver).catch(rejectPromise);
                }
            } else resolvePromise();
        });
    }

    /**
     * Returns whether Push has been granted permission to run
     * @return {Boolean}
     */
    has() {
        return this.get() === this.GRANTED;
    }

<<<<<<< HEAD
    /**
     * Gets the permission level
     * @return {Permission} The permission level
     */
    get() {
        let permission;

        /* Safari 6+, Chrome 23+ */
        if (this.win.Notification && this.win.Notification.permission)
            permission = this.win.Notification.permission;
        else if (
            this.win.webkitNotifications &&
            this.win.webkitNotifications.checkPermission
        )
            /* Legacy webkit browsers */
            permission = this.permissions[
                this.win.webkitNotifications.checkPermission()
            ];
        else if (navigator.mozNotification)
            /* Firefox Mobile */
            permission = this.GRANTED;
        else if (this.win.external && this.win.external.msIsSiteMode)
            /* IE9+ */
            permission = this.win.external.msIsSiteMode()
                ? this.GRANTED
                : this.DEFAULT;
        else permission = this.GRANTED;

        return permission;
    }
=======
  /**
   * Gets the permission level
   * @return {Permission} The permission level
   */
  get(): NotificationPermission {
    let permission: NotificationPermission;

    /* Safari 6+, Chrome 23+ */
    if (this.win.Notification && this.win.Notification.permission)
      permission = this.win.Notification.permission;
    else if (
      this.win.webkitNotifications &&
      this.win.webkitNotifications.checkPermission
    )
      /* Legacy webkit browsers */
      permission = this.permissions[
        this.win.webkitNotifications.checkPermission()
      ];
    else if (navigator.mozNotification)
      /* Firefox Mobile */
      permission = this.GRANTED;
    else if (this.win.external && this.win.external.msIsSiteMode)
      /* IE9+ */
      permission = this.win.external.msIsSiteMode()
        ? this.GRANTED
        : this.DEFAULT;
    else permission = this.GRANTED;

    return permission;
  }
>>>>>>> More improvements
}
