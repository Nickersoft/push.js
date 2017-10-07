---
layout: documentation
title: Plugins | Push v1.0
---

# Plugins

New in version 1.0 is Push's ability to support third-party plugins that are capable of extending Push's functionality
to support external notification providers. Plugins can be installed via `Push.extend()` 
(see ["Writing Plugins"](#writing-plugins) for more info).

## Using Plugins

If you load Push and its plugins in the browser, the plugin should automatically call `.extend()` for you, making the
 plugin immediately available to you. Let's take a look at the official 
 [Push plugin for Firebase Cloud Messaging](https://github.com/Nickersoft/pushjs-fcm-plugin). We can import it alongside
 Push in the browser (please note that the plugin must be imported *after* Push and Firebase must already be imported 
 into your project):
 
 ```html
<script src="./push.min.js"></script>
<script src="./push.fcm.min.js"></script>
```

You'll notice a new method now exists in the `Push` variable: `.FCM()`. This initializes Firebase Cloud Messaging. 
However, running this you'll get a series of errors of the following format:

```text
Null values exists for config value ... Please make sure all values are set properly in Push.config().FCM before continuing.
```

These errors occur because the plugin requires the correct configuration variables in order to run. These can be set via:

```javascript
Push.config({
    FCM: {} //options go here
})
```

Once the configuration has been set properly, `Push.FCM()` should initialize properly and expose the other functions
available in the plugin. For more information on using the FCM plugin, 
[read the docs](https://github.com/Nickersoft/pushjs-fcm-plugin/blob/master/README.md).

## Writing Plugins

As you might have guessed, plugins can hook into Push's configuration, as well as Push itself. By default,
  `Push.extend()` expects what is referred to as a *plugin manifest*, a dictionary object that contains two keys: 
  `config` and `plugin`. `config` contains a dictionary object filled with empty configuration values. In the FCM plugin,
  this dictionary looks like the following:
  
```javascript
// some keys truncated for brevity
var configuration = {
    FCM: {
        apiKey: null,
        authDomain: null,
        databaseURL: null,
        projectId: null,
        storageBucket: null,
        messagingSenderId: null,
    }
}
```

The `plugin` option, on the other hand, is a class object that takes a single configuration object as a constructor parameter. 
This configuration object will contain all of your configuration keys after they are merged with the default Push 
configuration. All public class methods will be merged into Push once `Push.extend()` is called on your manifest. If you 
wish to hide certain functionality until an initialize method is called, simply return a dictionary containing these 
methods from your initialization method. For example, in FCM:

```javascript
/**
 * Initialization method of the FCM plugin.
 * Should be the first thing called.
 * @constructor
 */
self.FCM = function () {
    // ...method body...
    
    return { 
        // all methods local functions inside the class
        getToken: getToken,
        deleteToken: deleteToken,
        isTokenSentToServer: isTokenSentToServer
    };
}
```

Lastly, it is, by convention, required that your plugin automatically call `Push.extend()` if possible. If your plugin 
requires a different setup, please specify in its documentation. In the FCM plugin, this is handled by an opening conditional:

```javascript
/* Use AMD */
if (typeof define === 'function' && define.amd) {
    define(['firebase'], function (firebase) {
        return factory(root, firebase);
    });
}
/* Use CommonJS */
else if (typeof module !== 'undefined' && module.exports) {
    var firebase = require('firebase/app');
    require('firebase/messaging');
    module.exports = factory(root, firebase)();
}
/* Use Browser */
else {
    if (typeof root.Push === 'undefined' || root.Push === null)
        console.error(ERR_NO_PUSH);
    else
        // Note this line
        root.Push.extend(factory(root, root.firebase));
}
```

For a full example of a working plugin, just look at the
 [FCM plugin source](https://github.com/Nickersoft/push-fcm-plugin/blob/master/push.fcm.js).
