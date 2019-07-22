type GenericNotification = Notification | WebkitNotifications;

interface NotificationWrapper {
  get: Function;
  close: Function;
}

interface MozNavigation {
  show: () => void;
}

interface MozNavigator extends Navigator {
  mozNotification: {
    createNotification: (
      title: string,
      content: string,
      icon: string | object
    ) => MozNavigation;
  };
}

interface WebkitNotifications {
  cancel: () => void;
  checkPermission: () => number;
  requestPermission: () => void;
  createNotification: (icon: string, title: string, content: string) => void;
}

interface Global {
  Notification?: Notification;
  navigator?: Navigator;
  webkitNotifications?: any;
  external?: {
    msIsSiteMode?: Function;
    msSiteModeClearIconOverlay?: Function;
    msSiteModeSetIconOverlay?: Function;
    msSiteModeActivate?: Function;
  };
}

interface PushOptions {
  body?: string;
  icon?:
    | string
    | {
        x16?: string;
        x32?: string;
      };
  title?: string;
  link?: string;
  timeout?: number;
  tag?: string;
  data?: object;
  requireInteraction?: boolean;
  vibrate?: boolean;
  silent?: boolean;
  onShow?: Function;
  onClose?: Function;
  onClick?: Function;
  onError?: Function;
}

interface PluginManifest {
  plugin: {};
  config?: {};
}
