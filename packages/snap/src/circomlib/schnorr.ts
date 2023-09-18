/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-ignore
import * as Scalar from './scalar';
import poseidon from './poseidon';
import * as babyJub from './babyJub';
import { getRandomBytes } from './random';

export const poseidonHash = (inputs: any[]) => {
  return poseidon(inputs);
};

const bytesToHex = (bytes: number[]) => {
  return `0x${bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('')}`;
};

class Schnorr {
  prv2pub(prv: any) {
    // pub  = g^prv where g is the base point of babyjub
    const pub = babyJub.mulPointEscalar(babyJub.Base8, prv);
    return pub;
  }

  signPoseidon(prv: any, msg: any) {
    const k = bytesToHex(getRandomBytes(31));

    // Calculate r = g^k
    const r = babyJub.mulPointEscalar(babyJub.Base8, k);

    const e = poseidon([r[0], r[1], msg]);

    // Calculate s = k - prv*e
    let s = Scalar.sub(k, Scalar.mul(prv, e));

    // Ensure that s is positive and within our subgroup order
    s = Scalar.mod(s, babyJub.subOrder);
    s = Scalar.add(s, babyJub.subOrder);
    s = Scalar.mod(s, babyJub.subOrder);

    return {
      e: BigInt(e),
      s: BigInt(s),
    };
  }

  verifyPoseidon(sig: any, pubKey: any, msg: any): boolean {
    if (typeof sig !== 'object') {
      return false;
    }

    if (!Array.isArray(pubKey)) {
      return false;
    }

    if (pubKey.length !== 2) {
      return false;
    }

    if (!babyJub.inCurve(pubKey)) {
      return false;
    }

    if (sig.s >= babyJub.subOrder) {
      return false;
    }

    // Calculates g^s
    const gs = babyJub.mulPointEscalar(babyJub.Base8, sig.s);

    // Calculates y^e
    const ye = babyJub.mulPointEscalar(pubKey, sig.e);

    // Adds g^s and y^e
    const rv = babyJub.addPoint(gs, ye);

    // H(r_v || M)
    const ev = poseidon([rv[0], rv[1], msg]);

    // Checks if e == e_v
    if (!Scalar.eq(sig.e, ev)) {
      return false;
    }

    return true;
  }
}

export const schnorr = new Schnorr();
