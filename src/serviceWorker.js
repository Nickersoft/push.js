const isFunction = obj => obj && {}.toString.call(obj) === '[object Function]';

const runFunctionString = funcStr => {
    if (funcStr.trim().length > 0) {
        eval(`var func = ${funcStr}`);
        if (isFunction(func))
            func();
    }
};

self.addEventListener('message', event => {
    self.client = event.source;
});

self.onnotificationclose = event => {
    runFunctionString(event.notification.data.onClose);

    /* Tell Push to execute close callback */
    self.client.postMessage(JSON.stringify({
        id: event.notification.data.id,
        action: 'close'
    }));
};

self.onnotificationclick = event => {
    let link;
    let origin;
    let href;

    runFunctionString(event.notification.data.onClick);

    if (typeof event.notification.data.link !== 'undefined' && event.notification.data.link !== null) {
        origin = event.notification.data.origin;
        link = event.notification.data.link;
        href = `${origin.substring(0, origin.indexOf('/', 8))}/`;

        event.notification.close();

        /* This looks to see if the current is already open and focuses if it is */
        event.waitUntil(clients.matchAll({
            type: "window"
        }).then(clientList => {
            let client;
            let full_url;

            for (let i = 0; i < clientList.length; i++) {
                client = clientList[i];
                full_url = href + link;

                if (full_url[full_url.length - 1] !== '/' && client.url[client.url.length - 1] == '/')
                    full_url += '/';

                if ((client.url == full_url) && ('focus' in client))
                    return client.focus();
            }

            if (clients.openWindow)
                return clients.openWindow(`/${link}`);
        }));
    }
};
