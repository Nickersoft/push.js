import { AbstractAgent } from '@push/agents';
import { Util } from '@push/core';

/**
 * Notification agent for IE9
 */
export default class MSAgent extends AbstractAgent {
  /**
   * Returns a boolean denoting support
   * @returns {Boolean} boolean denoting whether webkit notifications are supported
   */
  isSupported() {
    return (
      this.win.external !== undefined &&
      this.win.external.msIsSiteMode !== undefined
    );
  }

  /**
   * Creates a new notification
   * @param title - notification title
   * @param options - notification options array
   * @returns {Notification}
   */
  create(title: string, options: PushOptions): void {
    /* Clear any previous notifications */
    this.win.external.msSiteModeClearIconOverlay();

    this.win.external.msSiteModeSetIconOverlay(
      Util.isString(options.icon) || Util.isUndefined(options.icon)
        ? options.icon
        : (options.icon as any).x16,
      title
    );

    this.win.external.msSiteModeActivate();

    return null;
  }

  /**
   * Close a given notification
   * @param notification - notification to close
   */
  close() {
    this.win.external.msSiteModeClearIconOverlay();
  }
}
