// @flow
import type { Global } from 'types';

export default class AbstractAgent {
    _win: Global;

    constructor(win: Global) {
        this._win = win;
    }
}
