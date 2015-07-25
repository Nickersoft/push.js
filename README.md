# Push [![Build Status](https://travis-ci.org/Nickersoft/push.js.svg?branch=master)](https://travis-ci.org/Nickersoft/push.js)

### What is Push? ###

Push is the fastest way to get up and running with Javascript desktop notifications. A fairly new addition to the official specification, the Notification API allows modern browsers such as Chrome, Safari, and IE 9+ to push notifications to a user's desktop. Push acts as a cross-browser solution to this API, falling back to use  older implementations if the user's browser does not support the new API.

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

#### Closing Notifications ####
When it comes to closing notifications, you have a few options. You can either set a timeout (see "Options"), call Push's close() method, or pass around the notification object and call close() directly. Push's close() method will only work with newer browsers, taking in a notification's unique tag name and closing the first notification it finds with that tag:

```javascript
Push.create('Hello World!', {
    tag: 'foo'
});

// Somewhere later in your code...

Push.close('foo');
```

Alternatively, you can assign the Notification wrapper returned by Push to a variable and close it directly:

```javascript
var notification = Push.create('Hello World!');

// Somewhere later in your code...

notification.close();
```

When it comes to clearing all open notifications, that's just as easy as well:

```javascript
Push.clear();
```

### Options ###

The only required argument in a Push call is a title. However, that doesn't mean you can't add a little something extra. You can pass in options to Push as well, like so:

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
* __icon__: Can be either the URL to an icon image or an array containing 16x16 and 32x32 pixel icon images (see above).
* __onClick__: Callback to execute when the notification is clicked.
* __onClose__: Callback to execute when the notification is closed (obsolete).
* __onError__: Callback to execute when if the notification throws an error.
* __onShow__: Callback to execute when the notification is shown (obsolete).
* __tag__: Unique tag used to identify the notification. Can be used to later close the notification manually.
* __timeout__: Time in milliseconds until notification closes automatically.
