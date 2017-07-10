---
layout: documentation
title: Options & Configuration | Push v1.0
---

# Options & Configuration

## Notification Options

| Option               	| Description                                                                                                                                                                                                                                                                                                                                                                                    |
|----------------------	|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `body`               	| The body text of the notification                                                                                                                                                                                                                                                                                                                                                              |
| `data`               	| Data to pass to ServiceWorker notifications                                                                                                                                                                                                                                                                                                                                                    |
| `icon`               	| Can be either the URL to an icon image or an array containing 16x16 and 32x32 pixel icon images (see above).                                                                                                                                                                                                                                                                                   |
| `link`               	| A relative URL path to navigate to when the user clicks on the notification on mobile (e.g. if you want users to navigate to your page `http://example.com/page`, then the relative URL is just `page`). If the page is already open in the background, then the browser window will automatically become focused. Requires the `serviceWorker.js` file to be present on your server to work.  |
| `requireInteraction` 	| When set to true, the notification will not close unless the user manually closes or clicks on it                                                                                                                                                                                                                                                                                              |
| `tag`                	| Unique tag used to identify the notification. Can be used to later close the notification manually.                                                                                                                                                                                                                                                                                            |
| `timeout`            	| Time in milliseconds until the notification closes automatically                                                                                                                                                                                                                                                                                                                               |
| `vibrate`            	| An array of durations for a mobile device receiving the notification to vibrate. For example, [200, 100] would vibrate first for 200 milliseconds, pause, then continue for 100 milliseconds. For more information, see below.<br/><br/> Available in  Mobile Chrome only.                                                                                                                     |
| `silent`             	| Specifies whether the notification should be silent, i.e. no sounds or vibrations should be issued, regardless of the device settings.<br/><br/>Supported only in [Chrome 43.0 or higher](https://developer.mozilla.org/en-US/docs/Web/API/notification#Browser_compatibility).                                                                                                                |

### Callback Options

| Option      	| Description                                                  	| Notes    	|
|-------------	|--------------------------------------------------------------	|----------	|
| `onClick()` 	| Callback to execute when the notification is clicked         	|          	|
| `onClose()` 	| Callback to execute when the notification is closed          	| Obsolete 	|
| `onError()` 	| Callback to execute when if the notification throws an error 	|          	|
| `onShow()`  	| Callback to execute when the notification is shown           	| Obsolete 	|

## Configuration Options
Global configuration options can be set via Push's special `.config()` method. If no options are passed to it, all 
current configuration properties are returned. If a configuration object is passed to the function, the properties are
automatically merged with Push's current configuration. For example:

```javascript
Push.config({
    serviceWorker: './customServiceWorker.js', // Sets a custom service worker script
    fallback: function(payload) {
        // Code that executes on browsers with no notification support
        // "payload" is an object containing the 
        // title, body, tag, and icon of the notification 
    }
});
```

By default, `serviceWorker` and `fallback` are the only available configuration
options (more available via [plugins](/docs/plugins)). If not specified, `serviceWorker` will automatically
look for the *minified* service worker file in the root of your webserver. So if your
JavaScript executes on `https://example.com/johndoe`,  it will look for the script at 
`https://example.com/serviceWorker.min.js`. It is encouraged to make your service worker
available at this location, as provides a global scope in which the service worker can operate.

**You will probably need to set the `serviceWorker` option if your Push installation
 cannot find its service worker file.**