// @flow
import { Util, Messages } from 'push';
import { AbstractAgent } from 'agents';
import type { Global, GenericNotification, PushOptions } from 'types';

/**
 * Notification agent for modern desktop browsers:
 * Safari 6+, Firefox 22+, Chrome 22+, Opera 25+
 */
export default class MobileChromeAgent extends AbstractAgent {
    _win: Global;

    /**
     * Returns a boolean denoting support
     * @returns {Boolean} boolean denoting whether webkit notifications are supported
     */
    isSupported() {
        return (
            this._win.navigator !== undefined &&
            this._win.navigator.serviceWorker !== undefined
        );
    }

    /**
     * Returns the function body as a string
     * @param func
     */
    getFunctionBody(func: () => void) {
        const str = func.toString().match(/function[^{]+{([\s\S]*)}$/);
        return typeof str !== 'undefined' && str !== null && str.length > 1
            ? str[1]
            : null;
    }

    /**
     * Creates a new notification
     * @param id                ID of notification
     * @param title             Title of notification
     * @param options           Options object
     * @param serviceWorker     ServiceWorker path
     * @param callback          Callback function
     */
    create(
        id: number,
        title: string,
        options: PushOptions,
        serviceWorker: string,
        callback: (GenericNotification[]) => void
    ) {
        /* Register ServiceWorker */
        this._win.navigator.serviceWorker.register(serviceWorker);

        this._win.navigator.serviceWorker.ready
            .then(registration => {
                /* Local data the service worker will use */
                let localData = {
                    id: id,
                    link: options.link,
                    origin: document.location.href,
                    onClick: Util.isFunction(options.onClick)
                        ? this.getFunctionBody(options.onClick)
                        : '',
                    onClose: Util.isFunction(options.onClose)
                        ? this.getFunctionBody(options.onClose)
                        : ''
                };

                /* Merge the local data with user-provided data */
                if (options.data !== undefined && options.data !== null)
                    localData = Object.assign(localData, options.data);

                /* Show the notification */
                registration
                    .showNotification(title, {
                        icon: options.icon,
                        body: options.body,
                        vibrate: options.vibrate,
                        tag: options.tag,
                        data: localData,
                        requireInteraction: options.requireInteraction,
                        silent: options.silent
                    })
                    .then(() => {
                        registration.getNotifications().then(notifications => {
                            /* Send an empty message so the ServiceWorker knows who the client is */
                            registration.active.postMessage('');

                            /* Trigger callback */
                            callback(notifications);
                        });
                    })
                    .catch(function(error) {
                        throw new Error(
                            Messages.errors.sw_notification_error +
                                error.message
                        );
                    });
            })
            .catch(function(error) {
                throw new Error(
                    Messages.errors.sw_registration_error + error.message
                );
            });
    }

    /**
     * Close all notification
     */
    close() {
        // Can't do this with service workers
    }
}
