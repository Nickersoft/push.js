import Helpers from './Helpers';

export default class Push {
    constructor(win, doc) {
        this._currentId = 0; // ID to use for new notifications
        this._notifications = {}; // Map of open notifications
        this._lastWorkerPath = null; // Testing variable for the last service worker path used
        this.win = win;
        this.doc = doc;
    }

    /**
     * Closes a notification
     * @param {Notification} notification
     * @return {Boolean} boolean denoting whether the operation was successful
     * @private
     */
    _closeNotification = id => {
        let errored = false;
        const notification = this._notifications[id];

        if (typeof notification !== 'undefined') {

            /* Safari 6+, Chrome 23+ */
            if (notification.close)
                notification.close();

            /* Legacy webkit browsers */
            else if (notification.cancel)
                notification.cancel();

            /* IE9+ */
            else if (this.win.external && this.win.external.msIsSiteMode)
                this.win.external.msSiteModeClearIconOverlay();

            else {
                errored = true;
                throw new Error('Unable to close notification: unknown interface');
            }

            if (!errored) {
                return this._removeNotification(id);
            }
        }

        return false;
    };

    /**
     * Adds a notification to the global dictionary of notifications
     * @param {Notification} notification
     * @return {Integer} Dictionary key of the notification
     * @private
     */
    _addNotification = notification => {
        const id = currentId;
        this._notifications[id] = notification;
        this._currentId++;
        return id;
    };

    /**
     * Removes a notification with the given ID
     * @param  {Integer} id - Dictionary key/ID of the notification to remove
     * @return {Boolean} boolean denoting success
     * @private
     */
    _removeNotification = id => {
        const dict = {};
        let success = false;
        let key;

        for (key in this._notifications) {
            if (this._notifications.hasOwnProperty(key)) {
                if (key != id) {
                    dict[key] = this._notifications[key];
                } else {
                    // We're successful if we omit the given ID from the new array
                    success = true;
                }
            }
        }
        // Overwrite the current notifications dictionary with the filtered one
        this._notifications = dict;
        return success;
    };

    /**
     * Creates the wrapper for a given notification
     *
     * @param {Integer} id - Dictionary key/ID of the notification
     * @param {Map} options - Options used to create the notification
     * @returns {Map} wrapper hashmap object
     * @private
     */
    _prepareNotification = (id, options) => {
        let wrapper;

        /* Wrapper used to get/close notification later on */
        wrapper = {
            get() {
                return this._notifications[id];
            },

            close() {
                this._closeNotification(id);
            }
        };

        /* Autoclose timeout */
        if (options.timeout) {
            setTimeout(() => {
                wrapper.close();
            }, options.timeout);
        }

        return wrapper;
    };

    /**
     * Callback function for the 'create' method
     * @return {void}
     * @private
     */
    _createCallback = (title, options, resolve) => {
        let notification;
        let onClose;

        /* Set empty settings if none are specified */
        options = options || {};

        /* Set the last service worker path for testing */
        this._lastWorkerPath = options.serviceWorker || 'serviceWorker.js';

        /* onClose event handler */
        onClose = function (id) {
            /* A bit redundant, but covers the cases when close() isn't explicitly called */
            this._removeNotification(id);
            if (isFunction(options.onClose)) {
                options.onClose.call(this, notification);
            }
        };

        /* Safari 6+, Firefox 22+, Chrome 22+, Opera 25+ */
        if (this.win.Notification) {
            try {
                notification =  new this.win.Notification(
                    title,
                    {
                        icon: (Helpers.isString(options.icon) || Helpers.isUndefined(options.icon)) ? options.icon : options.icon.x32,
                        body: options.body,
                        tag: options.tag,
                        requireInteraction: options.requireInteraction
                    }
                );
            } catch (e) {
                if (this.win.navigator) {
                    /* Register ServiceWorker using lastWorkerPath */
                    this.win.navigator.serviceWorker.register(this._lastWorkerPath);
                    this.win.navigator.serviceWorker.ready.then(registration => {
                        let localData = {
                            id: this._currentId,
                            link: options.link,
                            origin: document.location.href,
                            onClick: (Helpers.isFunction(options.onClick)) ? options.onClick.toString() : '',
                            onClose: (Helpers.isFunction(options.onClose)) ? options.onClose.toString() : ''
                        };

                        if (typeof options.data !== 'undefined' && options.data !== null)
                            localData = Object.assign(localData, options.data);

                        /* Show the notification */
                        registration.showNotification(
                            title,
                            {
                                icon: options.icon,
                                body: options.body,
                                vibrate: options.vibrate,
                                tag: options.tag,
                                data: localData,
                                requireInteraction: options.requireInteraction
                            }
                        ).then(() => {
                            let id;

                            /* Find the most recent notification and add it to the global array */
                            registration.getNotifications().then(notifications => {
                                id = this._addNotification(notifications[notifications.length - 1]);

                                /* Send an empty message so the ServiceWorker knows who the client is */
                                registration.active.postMessage('');

                                /* Listen for close requests from the ServiceWorker */
                                navigator.serviceWorker.addEventListener('message', event => {
                                    const data = JSON.parse(event.data);

                                    if (data.action === 'close' && Number.isInteger(data.id))
                                        this._removeNotification(data.id);
                                });

                                resolve(this._prepareNotification(id, options));
                            });
                        });
                    });
                }
            }

            /* Legacy webkit browsers */
        } else if (this.win.webkitNotifications) {

            notification = this.win.webkitNotifications.createNotification(
                options.icon,
                title,
                options.body
            );

            notification.show();

            /* Firefox Mobile */
        } else if (navigator.mozNotification) {

            notification = navigator.mozNotification.createNotification(
                title,
                options.body,
                options.icon
            );

            notification.show();

            /* IE9+ */
        } else if (this.win.external && this.win.external.msIsSiteMode()) {

            //Clear any previous notifications
            this.win.external.msSiteModeClearIconOverlay();
            this.win.external.msSiteModeSetIconOverlay(
                ((Helpers.isString(options.icon) || Helpers.isUndefined(options.icon))
                    ? options.icon
                    : options.icon.x16), title
            );
            this.win.external.msSiteModeActivate();

            notification = {};
        } else {
            throw new Error('Unable to create notification: unknown interface');
        }

        if (typeof(notification) !== 'undefined') {
            const id = this._addNotification(notification);
            const wrapper = this._prepareNotification(id, options);

            /* Notification callbacks */
            if (isFunction(options.onShow))
                notification.addEventListener('show', options.onShow);

            if (isFunction(options.onError))
                notification.addEventListener('error', options.onError);

            if (isFunction(options.onClick))
                notification.addEventListener('click', options.onClick);

            notification.addEventListener('close', () => {
                onClose(id);
            });

            notification.addEventListener('cancel', () => {
                onClose(id);
            });

            /* Return the wrapper so the user can call close() */
            resolve(wrapper);
        }

        resolve({}); // By default, pass an empty wrapper
    };
}
