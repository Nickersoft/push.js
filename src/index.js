import Push from './classes/Push';

module.exports = new Push(typeof window !== 'undefined' ? window : this);
