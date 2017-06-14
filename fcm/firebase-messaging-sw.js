importScripts('https://www.gstatic.com/firebasejs/4.1.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.2/firebase-messaging.js');

if (firebase.apps.length > 0)
    firebase.messaging();

self.addEventListener('message', function (event) {
    if (firebase.apps.length === 0) {
        firebase.initializeApp(event.data);
        firebase.messaging();
    }

    event.ports[0].postMessage(event.data);
});