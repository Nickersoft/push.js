---
layout: documentation
title: Permissions | Push v1.0
---

# Permissions
While Push automatically requests permissions before displaying a notification, you may sometimes wish to either manually request permission or view whether or not Push already has received permission to show notifications. Push uses an array of constants to keep track of its current permission level. These constants are as follows:

```javascript
Push.Permission.DEFAULT; // 'default'
Push.Permission.GRANTED; // 'granted'
Push.Permission.DENIED; // 'denied'
```

## Requesting Permission
To manually request notification permission, simply call:

```javascript
Push.Permission.request(onGranted, onDenied);
```

where `onGranted` is a callback function for if permision is granted, and `onDenied` is a callback function for if, you guessed it, the permission is denied. Note that if `Permission.DEFAULT` is returned, no callback is executed.

## Reading Permission 
To find out whether or not Push has permission to show notifications, just call:

```javascript
Push.Permission.has();
```

which will return a boolean value denoting permission.

## Native Permission Levels
You can also get the raw permission level from the native API itself using:

```javascript
Push.Permission.get();
```

This returns a string value which may or may not coincidentally be represented by Push's constants. Use this info as you please.