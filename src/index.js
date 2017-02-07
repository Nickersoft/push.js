import Push from './classes/Push';

'use strict';

module.exports = new Push(typeof window !== 'undefined' ? window : this);
