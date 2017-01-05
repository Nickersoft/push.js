self.addEventListener('message', function(event){
    self.link = JSON.parse(event.data).link || '';
});

self.onnotificationclick = function(event) {
    event.notification.close();

    // This looks to see if the current is already open and focuses if it is
    event.waitUntil(clients.matchAll({
        type: "window"
    }).then(function(clientList) {
        var client;

        for (var i = 0; i < clientList.length; i++) {
            client = clientList[i];

            if ((client.url == '/' + self.link) && ('focus' in client))
                return client.focus();
        }

        if (clients.openWindow)
            return clients.openWindow('/' + self.link);
    }));
};
