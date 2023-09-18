/* eslint-disable */
// @ts-nocheck

import * as Scalar from './scalar';

export function exp(F, base, e) {
  if (Scalar.isZero(e)) return F.one;

  const n = Scalar.bits(e);

  if (n.length == 0) return F.one;

  let res = base;

  for (let i = n.length - 2; i >= 0; i--) {
    res = F.square(res);

    if (n[i]) {
      res = F.mul(res, base);
    }
  }

  return res;
}
