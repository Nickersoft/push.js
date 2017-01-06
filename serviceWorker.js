var isFunction = function (obj) { return obj && {}.toString.call(obj) === '[object Function]'; };

self.addEventListener('message', function(event) {
    var data = JSON.parse(event.data);

    console.log(data);
    self.client = event.source;

    if (typeof data.link !== 'undefined' && data.link !== null && !self.hasOwnProperty('link'))
        self.link = data.link;

    if (typeof data.id !== 'undefined' && data.id !== null && !self.hasOwnProperty('id'))
        self.id = data.id;
});

self.onnotificationclose = function (event) {
    if (event.notification.hasOwnProperty('data') && isFunction(event.notification.data.onClose))
        event.notification.data.onClose();

    /* Tell Push to execute close callback */
    self.client.postMessage(JSON.stringify({
        id: event.notification.data.id,
        action: 'close'
    }));
};

self.onnotificationclick = function (event) {
    var link;

    if (typeof event.notification.data !== 'undefined' &&
        isFunction(event.notification.data.onClick))
        event.notification.data.onClick();

    if (typeof event.notification.data !== 'undefined' &&
        typeof event.notification.data.link !== 'undefined') {
        link = event.notification.data.link;

        event.notification.close();

        // This looks to see if the current is already open and focuses if it is
        event.waitUntil(clients.matchAll({
            type: "window"
        }).then(function (clientList) {
            var client;

            for (var i = 0; i < clientList.length; i++) {
                client = clientList[i];

                if (link[link.length - 1] !== '/' && client.url[client.url.length - 1] == '/')
                    link = link + '/';

                if ((client.url == '/' + link) && ('focus' in client))
                    return client.focus();
            }

            if (clients.openWindow)
                return clients.openWindow('/' + link);
        }));
    }
};
