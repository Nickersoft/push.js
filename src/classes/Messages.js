const errorPrefix = 'PushError:';

export default {
    errors: {
        incompatible: `${errorPrefix} Push.js is incompatible with browser.`,
        unknown_interface: `${errorPrefix} unable to create notification: unknown interface`,
        invalid_plugin: `${errorPrefix} plugin class missing from plugin manifest (invalid plugin). Please check the documentation.`
    }
}
