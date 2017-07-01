const errorPrefix = 'PushError:';

export default {
  errors: {
    incompatible: `${errorPrefix} Push.js is incompatible with browser.`,
    unknown_interface: `${errorPrefix} unable to create notification: unknown interface`,
    invalid_plugin: `${errorPrefix} plugin class missing from plugin manifest (invalid plugin). Please check the documentation.`,
    sw_notification_error: `${errorPrefix} could not show a ServiceWorker notification due to the following reason: `,
    sw_registration_error: `${errorPrefix} could not register the ServiceWorker due to the following reason: `
  }
}
