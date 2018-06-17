// type GenericNotification = Notification | webkitNotifications;

interface Global {
    Notification?: Notification,
    // webkitNotifications?: webkitNotifications
}

interface PushOptions {
    body?: string,
    icon?: string,
    link?: string,
    timeout?: number,
    tag?: string,
    requireInteraction?: boolean,
    vibrate?: boolean,
    silent?: boolean,
    onClick?: Function,
    onError?: Function
}

interface PluginManifest {
    plugin: {},
    config?: {}
}
