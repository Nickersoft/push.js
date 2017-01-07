var isFunction = function (obj) { return obj && {}.toString.call(obj) === '[object Function]'; },

runFunctionString = function(funcStr) {
    if (funcStr.trim().length > 0) {
        eval('var func = ' + funcStr);
        if (isFunction(func))
            func();
    }
};

self.addEventListener('message', function(event) {
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
    var link;

    runFunctionString(event.notification.data.onClick);

    if (typeof event.notification.data.link !== 'undefined' && event.notification.data.link !== null) {
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

                console.log(link);

                if ((client.url == '/' + link) && ('focus' in client))
                    return client.focus();
            }

            if (clients.openWindow)
                return clients.openWindow('/' + link);
        }));
    }
};
