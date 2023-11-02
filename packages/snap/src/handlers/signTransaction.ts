import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { divider, heading, panel, text } from '@metamask/snaps-ui';
import { assetInfo, formatUnits } from '../utils';
import { Account, NoteData } from '../zkfi';

type Payload = {
  in: NoteData[];
  out: NoteData[];
};

export const signTransactionHandler: OnRpcRequestHandler = async ({ origin, request }) => {
  const notes = (request.params as any).notes as Payload;

  const inNoteValues: Record<number, bigint> = {};
  const outNoteValues: Record<number, bigint> = {};
  notes.in.forEach((note) => {
    const assetId = note.assetId;
    inNoteValues[assetId] = BigInt(inNoteValues[assetId] || '0') + BigInt(note.value);
  });

  notes.out.forEach((note) => {
    const assetId = note.assetId;
    outNoteValues[assetId] = BigInt(outNoteValues[assetId] || '0') + BigInt(note.value);
  });

  const assetPanelData: any = [];
  Object.keys(inNoteValues).forEach((assetId: any) => {
    const assetLabel = assetInfo[assetId]?.symbol || `${assetId}`;

    let value = inNoteValues[assetId] - (outNoteValues[assetId] || BigInt(0));
    if (value < BigInt(0)) {
      value = BigInt(0);
      // throw new Error(`Not enough ${assetName} to spend!`);
    }

    const valueLabel = formatUnits(value, assetInfo[assetId]?.decimals || 18, 8);

    assetPanelData.push(text(`**${assetLabel}**: ${valueLabel}`), divider());
  });

  const approved = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading('Sign Transaction'),
        divider(),
        text(`${origin} is requesting signature to spend following of your assets:`),
        panel(assetPanelData),
        text(`**Only sign if you trust the website.**`),
      ]),
    },
  });

  if (!approved) {
    throw new Error('Signature denied for transaction');
  }

  const acc = await Account.generate();
  return acc.signNotes(notes.in);
};
