/* eslint-disable */
// @ts-nocheck

import * as Scalar from './scalar';
import ZqField from './f1field';

export const p = Scalar.fromString(
  '21888242871839275222246405745257275088548364400416034343698204186575808495617',
);
const F = new ZqField(p);

export const Generator = [
  F.e('995203441582195749578291179787384436505546430278305826713579947235728471134'),
  F.e('5472060717959818805561601436314318772137091100104008585924551046643952123905'),
];
export const Base8 = [
  F.e('5299619240641551281634865583518297030282874472190772894086521144482721001553'),
  F.e('16950150798460657717958625567821834550301663161624707787222815936182638968203'),
];
export const order = Scalar.fromString(
  '21888242871839275222246405745257275088614511777268538073601725287587578984328',
);
export const subOrder = Scalar.shiftRight(order, 3);
export const A = F.e('168700');
export const D = F.e('168696');

export function addPoint(a, b) {
  const res = [];

  /* does the equivalent of:
   res[0] = bigInt((a[0]*b[1] + b[0]*a[1]) *  bigInt(bigInt("1") + d*a[0]*b[0]*a[1]*b[1]).inverse(q)).affine(q);
  res[1] = bigInt((a[1]*b[1] - cta*a[0]*b[0]) * bigInt(bigInt("1") - d*a[0]*b[0]*a[1]*b[1]).inverse(q)).affine(q);
  */

  const beta = F.mul(a[0], b[1]);
  const gamma = F.mul(a[1], b[0]);
  const delta = F.mul(F.sub(a[1], F.mul(A, a[0])), F.add(b[0], b[1]));
  const tau = F.mul(beta, gamma);
  const dtau = F.mul(D, tau);

  res[0] = F.div(F.add(beta, gamma), F.add(F.one, dtau));

  res[1] = F.div(F.add(delta, F.sub(F.mul(A, beta), gamma)), F.sub(F.one, dtau));

  return res;
}

export function mulPointEscalar(base, e) {
  let res = [F.e('0'), F.e('1')];
  let rem = e;
  let exp = base;

  while (!Scalar.isZero(rem)) {
    if (Scalar.isOdd(rem)) {
      res = addPoint(res, exp);
    }
    exp = addPoint(exp, exp);
    rem = Scalar.shiftRight(rem, 1);
  }

  return res;
}

export function inCurve(P) {
  const x2 = F.square(P[0]);
  const y2 = F.square(P[1]);

  if (!F.eq(F.add(F.mul(A, x2), y2), F.add(F.one, F.mul(F.mul(x2, y2), D)))) return false;

  return true;
}

export function privateKeyToPublicKey(privKey: string | bigint): [string, string] {
  const res = mulPointEscalar(Base8, privKey);
  return [`0x${res[0].toString(16)}`, `0x${res[1].toString(16)}`];
}
