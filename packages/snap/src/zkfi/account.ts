import { privateKeyToPublicKey } from '../circomlib/babyJub';
import poseidon from '../circomlib/poseidon';
import { schnorr } from '../circomlib/schnorr';
import { requestEntropy } from '../utils';
import { getNoteCommitment, NoteData } from './note';

const SALT_SIGN = '0x7369676e'; // ASCII for 'sign'
const SALT_VIEW = '0x76696577'; // ASCII for 'view'

export class Account {
  signPrivateKey: string;

  signPublicKey: [string, string];

  viewPrivateKey: string;

  viewPublicKey: [string, string];

  constructor(signPrivateKey: string, viewPrivateKey: string) {
    this.signPrivateKey = signPrivateKey;
    this.viewPrivateKey = viewPrivateKey;

    this.signPublicKey = privateKeyToPublicKey(this.signPrivateKey);
    this.viewPublicKey = privateKeyToPublicKey(this.viewPrivateKey);
  }

  static async generate() {
    const entropy = await requestEntropy();
    return Account.fromEntropy(entropy);
  }

  static fromEntropy(entropy: string) {
    // 248 bit keys
    const signPrivateKey = `0x00${BigInt(poseidon([entropy, SALT_SIGN]))
      .toString(16)
      .slice(2)}`;

    const viewPrivateKey = `0x00${BigInt(poseidon([entropy, SALT_VIEW]))
      .toString(16)
      .slice(2)}`;

    return new Account(signPrivateKey, viewPrivateKey);
  }

  signNotes(notes: NoteData[]) {
    return notes.map((note) => this.signNote(note));
  }

  signNote(note: NoteData) {
    const message = getNoteCommitment(note);
    return this.signMessage(message);
  }

  signMessage(message: string) {
    const sign = schnorr.signPoseidon(this.signPrivateKey, message);

    const pubKey = [BigInt(this.signPublicKey[0]), BigInt(this.signPublicKey[1])];
    const msg = BigInt(message);
    const isValid = schnorr.verifyPoseidon(sign, pubKey, msg);
    if (!isValid) {
      throw new Error(`Invalid signature ${sign} for message: ${message}`);
    }

    return {
      e: `0x${BigInt(sign.e).toString(16)}`,
      s: `0x${BigInt(sign.s).toString(16)}`,
    };
  }
}
