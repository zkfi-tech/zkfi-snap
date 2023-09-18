import poseidon from '../circomlib/poseidon';

export type NoteData = {
  assetId: string;
  value: string;
  owner: string;
};

export const getNoteCommitment = (note: NoteData) => {
  const hash = poseidon([note.assetId, note.owner, note.value]);
  return `0x${BigInt(hash).toString(16)}`;
};
