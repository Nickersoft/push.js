import { AbstractAgent } from 'agents';

/**
 * Notification agent for old Chrome versions (and some) Firefox
 */
export default class WebKitAgent extends AbstractAgent {
    private win: Global;

    /**
     * Returns a boolean denoting support
     * @returns {Boolean} boolean denoting whether webkit notifications are supported
     */
    isSupported() {
        return this.win.webkitNotifications !== undefined;
    }

    /**
     * Creates a new notification
     * @param title - notification title
     * @param options - notification options array
     * @returns {Notification}
     */
    create(title: string, options: PushOptions) {
        let notification = this.win.webkitNotifications.createNotification(
            options.icon,
            title,
            options.body
        );

        notification.show();

        return notification;
    }

    /**
     * Close a given notification
     * @param notification - notification to close
     */
    close(notification: GenericNotification) {
        notification.cancel();
    }
}
