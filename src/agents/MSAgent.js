// @flow
import { AbstractAgent } from 'agents';
import { Util } from 'push';
import type { PushOptions, Global } from 'types';

/**
 * Notification agent for IE9
 */
export default class MSAgent extends AbstractAgent {
    _win: Global;

    /**
     * Returns a boolean denoting support
     * @returns {Boolean} boolean denoting whether webkit notifications are supported
     */
    isSupported() {
        return (
            this._win.external !== undefined &&
            this._win.external.msIsSiteMode !== undefined
        );
    }

    /**
     * Creates a new notification
     * @param title - notification title
     * @param options - notification options array
     * @returns {Notification}
     */
    create(title: string, options: PushOptions) {
        /* Clear any previous notifications */
        this._win.external.msSiteModeClearIconOverlay();

        this._win.external.msSiteModeSetIconOverlay(
            Util.isString(options.icon) || Util.isUndefined(options.icon)
                ? options.icon
                : options.icon.x16,
            title
        );

        this._win.external.msSiteModeActivate();

        return null;
    }

    /**
     * Close a given notification
     * @param notification - notification to close
     */
    close() {
        this._win.external.msSiteModeClearIconOverlay();
    }
}
