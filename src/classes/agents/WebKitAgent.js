import AbstractAgent from './AbstractAgent';

/**
 * Notification agent for old Chrome versions (and some) Firefox
 */
export default class WebKitAgent extends AbstractAgent {

  /**
   * Returns a boolean denoting support
   * @returns {Boolean} boolean denoting whether webkit notifications are supported
   */
  isSupported() {
    return this._win.webkitNotifications !== undefined;
  }

  /**
   * Creates a new notification
   * @param title - notification title
   * @param options - notification options array
   * @returns {Notification}
   */
  create(title, options) {
    let notification = this._win.webkitNotifications.createNotification(
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
  close(notification) {
    notification.cancel();
  }
}
