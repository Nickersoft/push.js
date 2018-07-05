// @flow
import { AbstractAgent } from 'agents';
import { Util } from 'push';
import type { PushOptions, GenericNotification, Global } from 'types';

/**
 * Notification agent for modern desktop browsers:
 * Safari 6+, Firefox 22+, Chrome 22+, Opera 25+
 */
export default class DesktopAgent extends AbstractAgent {
    _win: Global;

    /**
     * Returns a boolean denoting support
     * @returns {Boolean} boolean denoting whether webkit notifications are supported
     */
    isSupported() {
        return this._win.Notification !== undefined;
    }

    /**
     * Creates a new notification
     * @param title - notification title
     * @param options - notification options array
     * @returns {Notification}
     */
    create(title: string, options: PushOptions) {
        return new this._win.Notification(title, {
            icon:
                Util.isString(options.icon) ||
                Util.isUndefined(options.icon) ||
                Util.isNull(options.icon)
                    ? options.icon
                    : options.icon.x32,
            body: options.body,
            tag: options.tag,
            requireInteraction: options.requireInteraction
        });
    }

    /**
     * Close a given notification
     * @param notification - notification to close
     */
    close(notification: GenericNotification) {
        notification.close();
    }
}
