// @flow
import type { Global } from 'types';

export default class Permission {
    // Private members
    _permissions: string[];
    _win: Global;

    // Public members
    GRANTED: string;
    DEFAULT: string;
    DENIED: string;

    constructor(win: Global) {
        this._win = win;
        this.GRANTED = 'granted';
        this.DEFAULT = 'default';
        this.DENIED = 'denied';
        this._permissions = [this.GRANTED, this.DEFAULT, this.DENIED];
    }

    /**
   * Requests permission for desktop notifications
   * @param {Function} onGranted - Function to execute once permission is granted
   * @param {Function} onDenied - Function to execute once permission is denied
   * @return {void, Promise}
   */
    request(onGranted: () => void, onDenied: () => void) {
        return arguments.length > 0
            ? this._requestWithCallback(...arguments)
            : this._requestAsPromise();
    }

    /**
   * Old permissions implementation deprecated in favor of a promise based one
   * @deprecated Since V1.0.4
   * @param {Function} onGranted - Function to execute once permission is granted
   * @param {Function} onDenied - Function to execute once permission is denied
   * @return {void}
   */
    _requestWithCallback(onGranted: () => void, onDenied: () => void) {
        const existing = this.get();

        var resolve = (result = this._win.Notification.permission) => {
            if (typeof result === 'undefined' && this._win.webkitNotifications)
                result = this._win.webkitNotifications.checkPermission();
            if (result === this.GRANTED || result === 0) {
                if (onGranted) onGranted();
            } else if (onDenied) onDenied();
        };

        /* Permissions already set */
        if (existing !== this.DEFAULT) {
            resolve(existing);
        } else if (
            this._win.webkitNotifications &&
            this._win.webkitNotifications.checkPermission
        ) {
            /* Safari 6+, Legacy webkit browsers */
            this._win.webkitNotifications.requestPermission(resolve);
        } else if (
            this._win.Notification &&
            this._win.Notification.requestPermission
        ) {
            /* Chrome 23+ */
            this._win.Notification
                .requestPermission()
                .then(resolve)
                .catch(function() {
                    if (onDenied) onDenied();
                });
        } else if (onGranted) {
            /* Let the user continue by default */
            onGranted();
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
            this._win.Notification && this._win.Notification.requestPermission;

        /* Legacy webkit browsers */
        var isWebkitAPI =
            this._win.webkitNotifications &&
            this._win.webkitNotifications.checkPermission;

        return new Promise((resolvePromise, rejectPromise) => {
            var resolver = result =>
                isGranted(result) ? resolvePromise() : rejectPromise();

            if (hasPermissions) {
                resolver(existing);
            } else if (isWebkitAPI) {
                this._win.webkitNotifications.requestPermission(result => {
                    resolver(result);
                });
            } else if (isModernAPI) {
                this._win.Notification
                    .requestPermission()
                    .then(result => {
                        resolver(result);
                    })
                    .catch(rejectPromise);
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

    /**
   * Gets the permission level
   * @return {Permission} The permission level
   */
    get() {
        let permission;

        /* Safari 6+, Chrome 23+ */
        if (this._win.Notification && this._win.Notification.permission)
            permission = this._win.Notification.permission;
        else if (
            this._win.webkitNotifications &&
            this._win.webkitNotifications.checkPermission
        )
            /* Legacy webkit browsers */
            permission = this._permissions[
                this._win.webkitNotifications.checkPermission()
            ];
        else if (navigator.mozNotification)
            /* Firefox Mobile */
            permission = this.GRANTED;
        else if (this._win.external && this._win.external.msIsSiteMode)
            /* IE9+ */
            permission = this._win.external.msIsSiteMode()
                ? this.GRANTED
                : this.DEFAULT;
        else permission = this.GRANTED;

        return permission;
    }
}
