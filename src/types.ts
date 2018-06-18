type GenericNotification = Notification | webkitNotifications;

interface LegacyNavigator extends Navigator {
    mozNotification: {
        createNotification: Function
    }
}

interface NotificationWrapper {
    get: Function,
    close: Function
}

interface LegacyNotification extends Notification {
    requestPermission: Function,
    vibrate: boolean
}

interface Global {
    Notification?: LegacyNotification,
    navigator?: LegacyNavigator,
    webkitNotifications?: webkitNotifications,
    external?: {
        msIsSiteMode?: Function,
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
