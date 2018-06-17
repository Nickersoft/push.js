import { Push } from '@push/core';

export default new Push(typeof window !== 'undefined' ? window : global);
