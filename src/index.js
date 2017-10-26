// @flow
import { Push } from 'push';

export default new Push(typeof window !== 'undefined' ? window : global);
