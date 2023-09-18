import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { divider, heading, panel, text } from '@metamask/snaps-ui';
import { Account, NoteData } from '../zkfi';

export const signTransactionHandler: OnRpcRequestHandler = async ({ origin, request }) => {
  const notes = (request.params as any).notes as NoteData[];

  const assetMap: Record<string, bigint> = {};
  notes.forEach((note) => {
    const assetId = note.assetId.toLowerCase();
    assetMap[assetId] = BigInt(assetMap[assetId] || '0') + BigInt(note.value);
  });

  const assetPanelData: any = [];
  Object.keys(assetMap).forEach((assetId) => {
    assetPanelData.push(text(`${assetId.slice(0, 8)}: ${assetMap[assetId]}`), divider());
  });

  const approved = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading('Sign Transaction'),
        divider(),
        text(`${origin} is requesting signature to spend following assets:`),
        panel(assetPanelData),
        text(`**Only sign if you trust the website.**`),
      ]),
    },
  });

  if (!approved) {
    throw new Error('Signature denied for transaction!');
  }

  const acc = await Account.generate();
  return acc.signNotes(notes);
};
