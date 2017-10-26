export type GenericNotification = Notification | webkitNotifications;

export type Global = {
    Notification?: Notification,
    webkitNotifications?: webkitNotifications
};

export type PushOptions = {
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
};

export type PluginManifest = {
    plugin: {},
    config?: {}
};
