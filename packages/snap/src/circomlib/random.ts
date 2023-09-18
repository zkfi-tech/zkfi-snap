/* eslint-disable */
// @ts-nocheck

export function getRandomBytes(n) {
  if (crypto?.getRandomValues) {
    const arr = new Uint8Array(n);
    crypto.getRandomValues(arr);
    return arr;
  } else if (crypto?.randomBytes) {
    return crypto.randomBytes(n);
  }

  throw new Error('getRandomBytes: only browser supported!');
}
