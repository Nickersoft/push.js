type GenericNotification = Notification | webkitNotifications;

interface Global {
    Notification?: Notification,
    navigator?: Navigator,
    webkitNotifications?: webkitNotifications,
    external?: {
        msIsSiteMode?: boolean,
        msSiteModeClearIconOverlay?: Function,
        msSiteModeSetIconOverlay?: Function,
        msSiteModeActivate?: Function
    }
}

interface PushOptions {
    body?: string,
    icon?: string | {
        x16?: string
    },
    title?: string,
    link?: string,
    timeout?: number,
    tag?: string,
    data?: object,
    requireInteraction?: boolean,
    vibrate?: boolean,
    silent?: boolean,
    onShow?: Function,
    onClose?: Function,
    onClick?: Function,
    onError?: Function
}

interface PluginManifest {
    plugin: {},
    config?: {}
}
