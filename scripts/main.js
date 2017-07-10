var button = document.getElementById("demo_button");

function demo() {
    Push.create('Hello world!', {
        body: 'How\'s it hangin\'?',
        icon: '/images/icon.png',
        link: '/',
        timeout: 4000,
        onClick: function () {
            console.log("Fired!");
            window.focus();
            this.close();
        },
        vibrate: [200, 100, 200, 100, 200, 100, 200]
    });
}

if (button !== null) {
    button.onclick = demo;
}

