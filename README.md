# Push.js

[![Build Status](https://travis-ci.org/Nickersoft/push.js.svg?branch=master)](https://travis-ci.org/Nickersoft/push.js) [![npm version](https://badge.fury.io/js/push.js.svg)](https://npmjs.com/package/push.js) [![npm](https://img.shields.io/npm/dt/push.js.svg)](https://npmjs.com/package/push.js) [![Coverage Status](https://coveralls.io/repos/github/Nickersoft/push.js/badge.svg?branch=master)](https://coveralls.io/github/Nickersoft/push.js?branch=master) [![Known Vulnerabilities](https://snyk.io/test/github/nickersoft/push.js/badge.svg)](https://snyk.io/test/github/nickersoft/push.js) 

### What is Push? ###

Push is the fastest way to get up and running with Javascript desktop notifications. A fairly new addition to the
official specification, the Notification API allows modern browsers such as Chrome, Safari, Firefox, and IE 9+ to push
notifications to a user's desktop. Push acts as a cross-browser solution to this API, falling back to use  older
implementations if the user's browser does not support the new API.

You can quickly install Push via [npm](http://npmjs.com):

```
npm install push.js --save
```

Or, if you want something a little more lightweight, you can give [Bower](http://bower.io) a try:

```
bower install push.js --save
```

For more information regarding the Push NPM package, [see here](https://www.npmjs.com/package/push.js).

#### Creating Notifications ####
So just how easy is it to create a notification using Push? We can do it in just one line, actually:

```javascript
Push.create('Hello World!')
```

No constructors, just a universal API you can access from anywhere. Push is even compatible with AMD as well:

```javascript
define(['pushjs'], function (Push) {
   Push.create('Hello World!');
});
```

If the browser does not have permission to send push notifications, Push will automatically request permission as soon
as create() is called. Simple as that. If you wish to know how many notifications are currently open, simply call:

```javascript
Push.count();
```

#### Closing Notifications ####
When it comes to closing notifications, you have a few options. You can either set a timeout (see "Options"), call
Push's close() method, or pass around the notification's promise object and then call close() directly. Push's close()
method will only work with newer browsers, taking in a notification's unique tag name and closing the first notification
it finds with that tag:

```javascript
Push.create('Hello World!', {
    tag: 'foo'
});

// Somewhere later in your code...

Push.close('foo');
```

Alternatively, you can assign the notification promise returned by Push to a variable and close it directly using the
promise's then() method:

```javascript
var promise = Push.create('Hello World!');

// Somewhere later in your code...

promise.then(function(notification) {
    notification.close();
});
```

When it comes to clearing all open notifications, that's just as easy as well:

```javascript
Push.clear();
```

**Important:** Although Javascript promises are [decently supported](http://caniuse.com/#search=promises) across
browsers, there are still some browsers that lack support. If you find that you are trying to support a browser that
doesn't support promises, chances are it won't support notifications either. However, if you are really determined, I
encourage you to checkout the lightweight [promise-polyfill](https://github.com/taylorhakes/promise-polyfill) library
by Taylor Hakes (or something similar). This library used to be bundled with Push, until it was decided that it'd be
better to leave that sort of dependency to the user's discretion.

### Permissions ###
While Push automatically requests permissions before displaying a notification, you may sometimes wish to either
manually request permission or view whether or not Push already has received permission to show notifications.
Push uses an array of constants to keep track of its current permission level. These constants are as follows:

```javascript
Push.Permission.DEFAULT; // 'default'
Push.Permission.GRANTED; // 'granted'
Push.Permission.DENIED; // 'denied'
```

#### Requesting Permission ####

To manually request notification permission, simply call:

```javascript
Push.Permission.request(onGranted, onDenied);
```

where `onGranted` is a callback function for if permision is granted, and `onDenied` is a callback function for if, you
guessed it, the permission is denied. Note that if `Permission.DEFAULT` is returned, no callback is executed.

#### Reading Permission ####

To find out whether or not Push has permission to show notifications, just call:

```javascript
Push.Permission.has();
```

which will return a boolean value denoting permission.

#### Native Permission Levels ####

If you feel like being *really* geeky, you can get the raw permission level from native API itself (scary stuff, I know)
using:

```javascript
Push.Permission.get();
```

This returns a string value which may or may not coincidentally be represented by Push's constants. Use this info as you
please.

### Options ###

The only required argument in a Push call is a title. However, that doesn't mean you can't add a little something extra.
You can pass in options to Push as well, like so:

```javascript
Push.create('Hello World!', {
    body: 'This is some body content!',
    icon: {
        x16: 'images/icon-x16.png',
        x32: 'images/icon-x32.png'
    },
    timeout: 5000
});
```

#### Available Options ####

* __body__: The body text of the notification.
* __data__: Data to pass to ServiceWorker notifications
* __icon__: Can be either the URL to an icon image or an array containing 16x16 and 32x32 pixel icon images (see above).
* __link__: A relative URL path to navigate to when the user clicks on the notification on mobile (e.g. if you want users to navigate to your page `http://example.com/page`, then the relative URL is just `page`). If the page is already open in the background, then the browser window will automatically become focused. Requires the `serviceWorker.js` file to be present on your server to work.
* __onClick__: Callback to execute when the notification is clicked.
* __onClose__: Callback to execute when the notification is closed (obsolete).
* __onError__: Callback to execute when if the notification throws an error.
* __onShow__: Callback to execute when the notification is shown (obsolete).
* __requireInteraction__: When set to true, the notification will not close unless the user manually closes or clicks on it.
* __serviceWorker__: Path to the [service worker](https://developers.google.com/web/fundamentals/getting-started/push-notifications/step-03?hl=en) script registered on Push mobile. Defaults to "serviceWorker.js" if a path is not specified.
* __tag__: Unique tag used to identify the notification. Can be used to later close the notification manually.
* __timeout__: Time in milliseconds until the notification closes automatically.
* __vibrate__: An array of durations for a mobile device receiving the notification to vibrate. For example, [200, 100] would vibrate first for 200 milliseconds, pause, then continue for 100 milliseconds. For more information, see below.

#### Mobile Support ####

Push can be used on Android Chrome (apparently Safari on iOS does not have notification support), but the website in
which it is running on ***must*** use have a valid SSL certificate (HTTPS only!!) otherwise it will not work. This is
due to Google's
[decision to drop the Notification constructor](https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/BygptYClroM)
from mobile Chrome. Sucks but hey, that's life, am I right?

### Development ###

If you feel like this library is your jam and you want to contribute (or you think I'm an idiot who missed something),
check out Push's neat [contributing guidelines](CONTRIBUTING.md) on how you can make your mark.

### Credits ###
Push is based off work the following work:

1. [HTML5-Desktop-Notifications](https://github.com/ttsvetko/HTML5-Desktop-Notifications) by [Tsvetan Tsvetkov](https://github.com/ttsvetko)
2. [notify.js](https://github.com/alexgibson/notify.js) by [Alex Gibson](https://github.com/alexgibson)

### Additional Resources ###
Feel free to expand this list as you find more cool Push.js resources online, or a tutorial in your language:

- [Push.js: An Introduction](https://blog.tylernickerson.com/push-js-an-introduction-49291ac986e8#.t7o5izwi9)
- [Push.js by Keen Dev](https://techstory.shma.so/push-js-897d5d467f94#.3m6cp34ok) (Korean Tutorial)
- [Web Push Notification with Push.js](https://www.youtube.com/watch?v=s19Mr5AzrmA) (Spanish Video Tutorial)
