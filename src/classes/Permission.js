export default class Permission {

  constructor(win) {
    this._win = win;
    this.GRANTED = 'granted';
    this.DEFAULT = 'default';
    this.DENIED = 'denied';
    this._permissions = [
      this.GRANTED,
      this.DEFAULT,
      this.DENIED
    ];
  }

  /**
   * Requests permission for desktop notifications
   * @return Promise
   */
  request() {
    const existing = this.get();

    var isGranted = result => (result === this.GRANTED || result === 0);

    /* Permissions already set */
    var hasPermissions = (existing !== this.DEFAULT);

    /* Safari 6+, Chrome 23+ */
    var isModernAPI = (this._win.Notification && this._win.Notification.requestPermission);

    /* Legacy webkit browsers */
    var isWebkitAPI = (this._win.webkitNotifications && this._win.webkitNotifications.checkPermission);

    return new Promise((resolvePromise, rejectPromise) => {

      var resolver = result => (isGranted(result)) ? resolvePromise() : rejectPromise();

      if (hasPermissions) {
       resolver(existing)
      }
      else if (isModernAPI) {
        this._win.Notification.requestPermission().then(result => { resolver(result) }).catch(rejectPromise)
      }
      else if (isWebkitAPI) {
        this._win.webkitNotifications.requestPermission(result => { resolver(result) });
      }
      else resolvePromise()
    })
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

    /* Legacy webkit browsers */
    else if (this._win.webkitNotifications && this._win.webkitNotifications.checkPermission)
      permission = this._permissions[this._win.webkitNotifications.checkPermission()];

    /* Firefox Mobile */
    else if (navigator.mozNotification)
      permission = this.GRANTED;

    /* IE9+ */
    else if (this._win.external && this._win.external.msIsSiteMode)
      permission = this._win.external.msIsSiteMode() ? this.GRANTED : this.DEFAULT;

    else
      permission = this.GRANTED;

    return permission;
  }
}
