'use strict';

function isFunction(obj) {
  obj && {}.toString.call(obj) === '[object Function]';
};

function runFunctionString(funcStr) {
  if (funcStr.trim().length > 0) {
    eval('var func = ' + funcStr);
    if (isFunction(func)) func();
  }
};

self.addEventListener('message', function (event) {
  self.client = event.source;
});

self.onnotificationclose = function (event) {
  runFunctionString(event.notification.data.onClose);

  /* Tell Push to execute close callback */
  self.client.postMessage(JSON.stringify({
    id: event.notification.data.id,
    action: 'close'
  }));
};

self.onnotificationclick = function (event) {
  var link = void 0;
  var origin = void 0;
  var href = void 0;

  runFunctionString(event.notification.data.onClick);

  if (typeof event.notification.data.link !== 'undefined' && event.notification.data.link !== null) {
    origin = event.notification.data.origin;
    link = event.notification.data.link;
    href = origin.substring(0, origin.indexOf('/', 8)) + '/';

    event.notification.close();

    /* This looks to see if the current is already open and focuses if it is */
    event.waitUntil(clients.matchAll({
      type: "window"
    }).then(function (clientList) {
      var client = void 0;
      var full_url = void 0;

      for (var i = 0; i < clientList.length; i++) {
        client = clientList[i];
        full_url = href + link;

        if (full_url[full_url.length - 1] !== '/' && client.url[client.url.length - 1] == '/') full_url += '/';

        if (client.url == full_url && 'focus' in client) return client.focus();
      }

      if (clients.openWindow) return clients.openWindow('/' + link);
    }).catch(function (error) {
      console.error("A ServiceWorker error occurred: " + error.message);
    }));
  }
};
