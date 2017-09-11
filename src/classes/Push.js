import Messages from "./Messages";
import Permission from "./Permission";
import Util from "./Util";
/* Import notification agents */
import DesktopAgent from "./agents/DesktopAgent";
import MobileChromeAgent from "./agents/MobileChromeAgent";
import MobileFirefoxAgent from "./agents/MobileFirefoxAgent";
import MSAgent from "./agents/MSAgent";
import WebKitAgent from "./agents/WebKitAgent";

export default class Push {

  constructor(win) {
    /* Private variables */

    /* ID to use for new notifications */
    this._currentId = 0;

    /* Map of open notifications */
    this._notifications = {};

    /* Window object */
    this._win = win;

    /* Public variables */
    this.Permission = new Permission(win);

    /* Agents */
    this._agents = {
      desktop: new DesktopAgent(win),
      chrome: new MobileChromeAgent(win),
      firefox: new MobileFirefoxAgent(win),
      ms: new MSAgent(win),
      webkit: new WebKitAgent(win)
    };

    this._configuration = {
      serviceWorker: '/serviceWorker.min.js',
      fallback: function(payload) {}
    }
  }

  /**
   * Closes a notification
   * @param {Notification} notification
   * @return {Boolean} boolean denoting whether the operation was successful
   * @private
   */
  _closeNotification(id) {
    let success = true;
    const notification = this._notifications[id];

    if (notification !== undefined) {
      success = this._removeNotification(id);

      /* Safari 6+, Firefox 22+, Chrome 22+, Opera 25+ */
      if (this._agents.desktop.isSupported())
        this._agents.desktop.close(notification);

      /* Legacy WebKit browsers */
      else if (this._agents.webkit.isSupported())
        this._agents.webkit.close(notification);

      /* IE9 */
      else if (this._agents.ms.isSupported())
        this._agents.ms.close();

      else {
        success = false;
        throw new Error(Messages.errors.unknown_interface);
      }

      return success;
    }

    return false;
  }

  /**
   * Adds a notification to the global dictionary of notifications
   * @param {Notification} notification
   * @return {Integer} Dictionary key of the notification
   * @private
   */
  _addNotification(notification) {
    const id = this._currentId;
    this._notifications[id] = notification;
    this._currentId++;
    return id;
  }

  /**
   * Removes a notification with the given ID
   * @param  {Integer} id - Dictionary key/ID of the notification to remove
   * @return {Boolean} boolean denoting success
   * @private
   */
  _removeNotification(id) {
    let success = false;

    if (this._notifications.hasOwnProperty(id)) {
      /* We're successful if we omit the given ID from the new array */
      delete this._notifications[id];
      success = true;
    }

    return success;
  }

  /**
   * Creates the wrapper for a given notification
   *
   * @param {Integer} id - Dictionary key/ID of the notification
   * @param {Map} options - Options used to create the notification
   * @returns {Map} wrapper hashmap object
   * @private
   */
  _prepareNotification(id, options) {
    let wrapper;

    /* Wrapper used to get/close notification later on */
    wrapper = {
      get: () => {
        return this._notifications[id];
      },

      close: () => {
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
  }

  /**
   * Find the most recent notification from a ServiceWorker and add it to the global array
   * @param notifications
   * @private
   */
  _serviceWorkerCallback(notifications, options, resolve) {
    let id = this._addNotification(notifications[notifications.length - 1]);

    /* Listen for close requests from the ServiceWorker */
    navigator.serviceWorker.addEventListener('message', event => {
      const data = JSON.parse(event.data);

      if (data.action === 'close' && Number.isInteger(data.id))
        this._removeNotification(data.id);
    });

    resolve(this._prepareNotification(id, options));
  }

  /**
   * Callback function for the 'create' method
   * @return {void}
   * @private
   */
  _createCallback(title, options, resolve) {
    let notification = null;
    let onClose;

    /* Set empty settings if none are specified */
    options = options || {};

    /* onClose event handler */
    onClose = (id) => {
      /* A bit redundant, but covers the cases when close() isn't explicitly called */
      this._removeNotification(id);
      if (Util.isFunction(options.onClose)) {
        options.onClose.call(this, notification);
      }
    };

    /* Safari 6+, Firefox 22+, Chrome 22+, Opera 25+ */
    if (this._agents.desktop.isSupported()) {
      try {
        /* Create a notification using the API if possible */
        notification = this._agents.desktop.create(title, options);
      } catch (e) {
        const id = this._currentId;
        const sw = this.config().serviceWorker;
        const cb = (notifications) => this._serviceWorkerCallback(notifications, options, resolve);
        /* Create a Chrome ServiceWorker notification if it isn't supported */
        if (this._agents.chrome.isSupported()) {
          this._agents.chrome.create(id, title, options, sw, cb);
        }
      }
      /* Legacy WebKit browsers */
    } else if (this._agents.webkit.isSupported())
      notification = this._agents.webkit.create(title, options);

    /* Firefox Mobile */
    else if (this._agents.firefox.isSupported())
      this._agents.firefox.create(title, options);

    /* IE9 */
    else if (this._agents.ms.isSupported())
      notification = this._agents.ms.create(title, options);

    /* Default fallback */
    else {
      options.title = title;
      this.config().fallback(options);
    }

    if (notification !== null) {
      const id = this._addNotification(notification);
      const wrapper = this._prepareNotification(id, options);

      /* Notification callbacks */
      if (Util.isFunction(options.onShow))
        notification.addEventListener('show', options.onShow);

      if (Util.isFunction(options.onError))
        notification.addEventListener('error', options.onError);

      if (Util.isFunction(options.onClick))
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

    /* By default, pass an empty wrapper */
    resolve(null);
  }

  /**
   * Creates and displays a new notification
   * @param {Array} options
   * @return {Promise}
   */
  create(title, options) {
    let promiseCallback;

    /* Fail if no or an invalid title is provided */
    if (!Util.isString(title)) {
      throw new Error(Messages.errors.invalid_title);
    }

    /* Request permission if it isn't granted */
    if (!this.Permission.has()) {
      promiseCallback = (resolve, reject) => {
        this.Permission.request().then(() => {
          this._createCallback(title, options, resolve);
        }).catch(() => {
          reject(Messages.errors.permission_denied);
        })
      };
    } else {
      promiseCallback = (resolve, reject) => {
        try {
          this._createCallback(title, options, resolve);
        } catch (e) {
          reject(e);
        }
      };
    }

    return new Promise(promiseCallback);
  }

  /**
   * Returns the notification count
   * @return {Integer} The notification count
   */
  count() {
    let count = 0;
    let key;

    for (key in this._notifications)
      if (this._notifications.hasOwnProperty(key)) count++;

    return count;
  }

  /**
   * Closes a notification with the given tag
   * @param {String} tag - Tag of the notification to close
   * @return {Boolean} boolean denoting success
   */
  close(tag) {
    let key, notification;

    for (key in this._notifications) {
      if (this._notifications.hasOwnProperty(key)) {
        notification = this._notifications[key];

        /* Run only if the tags match */
        if (notification.tag === tag) {

          /* Call the notification's close() method */
          return this._closeNotification(key);
        }
      }
    }
  }

  /**
   * Clears all notifications
   * @return {Boolean} boolean denoting whether the clear was successful in closing all notifications
   */
  clear() {
    let key, success = true;

    for (key in this._notifications)
      if (this._notifications.hasOwnProperty(key))
        success = success && this._closeNotification(key);

    return success;
  }

  /**
   * Denotes whether Push is supported in the current browser
   * @returns {boolean}
   */
  supported() {
    let supported = false;

    for (var agent in this._agents)
      if (this._agents.hasOwnProperty(agent))
        supported = supported || this._agents[agent].isSupported()

    return supported;
  }

  /**
   * Modifies settings or returns all settings if no parameter passed
   * @param settings
   */
  config(settings) {
    if (typeof settings !== 'undefined' || settings !== null && Util.isObject(settings))
      Util.objectMerge(this._configuration, settings);
    return this._configuration;
  }

  /**
   * Copies the functions from a plugin to the main library
   * @param plugin
   */
  extend(manifest) {
    var plugin, Plugin,
      hasProp = {}.hasOwnProperty;

    if (!hasProp.call(manifest, 'plugin')) {
      throw new Error(Messages.errors.invalid_plugin);
    } else {
      if (hasProp.call(manifest, 'config') && Util.isObject(manifest.config) && manifest.config !== null) {
        this.config(manifest.config);
      }

      Plugin = manifest.plugin;
      plugin = new Plugin(this.config())

      for (var member in plugin) {
        if (hasProp.call(plugin, member) && Util.isFunction(plugin[member]))
          this[member] = plugin[member];
      }
    }
  }
}
