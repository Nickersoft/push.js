import AbstractAgent from './AbstractAgent';
import Util from '../Util';
import Messages from '../Messages';

/**
 * Notification agent for modern desktop browsers:
 * Safari 6+, Firefox 22+, Chrome 22+, Opera 25+
 */
export default class MobileChromeAgent extends AbstractAgent {

  /**
   * Returns a boolean denoting support
   * @returns {Boolean} boolean denoting whether webkit notifications are supported
   */
  isSupported() {
    return this._win.navigator !== undefined &&
      this._win.navigator.serviceWorker !== undefined;
  }

  /**
   * Creates a new notification
   * @param title - notification title
   * @param options - notification options array
   * @returns {Notification}
   */
  create(id, title, options, lastWorkerPath, callback) {
    /* Register ServiceWorker using lastWorkerPath */
    this._win.navigator.serviceWorker.register(lastWorkerPath);

    this._win.navigator.serviceWorker.ready.then(registration => {
      /* Local data the service worker will use */
      let localData = {
        id: id,
        link: options.link,
        origin: document.location.href,
        onClick: (Util.isFunction(options.onClick)) ? options.onClick.toString() : '',
        onClose: (Util.isFunction(options.onClose)) ? options.onClose.toString() : ''
      };

      /* Merge the local data with user-provided data */
      if (options.data !== undefined && options.data !== null)
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
          requireInteraction: options.requireInteraction,
          silent: options.silent
        }
      ).then(() => {
        registration.getNotifications().then(notifications => {
          /* Send an empty message so the ServiceWorker knows who the client is */
          registration.active.postMessage('');

          /* Trigger callback */
          callback(notifications);
        });
      }).catch(function(error) {
        console.error(Messages.sw_notification_error + error.message);
      });
    }).catch(function(error) {
      console.error(Messages.sw_registration_error + error.message);
    });
  }

  /**
   * Close all notification
   */
  close() {
    this._win.external.msSiteModeClearIconOverlay()
  }
}
