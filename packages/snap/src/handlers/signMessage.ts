import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { divider, heading, panel, text } from '@metamask/snaps-ui';
import { Account } from '../zkfi/account';

export const signMessageHandler: OnRpcRequestHandler = async ({ origin, request }) => {
  const message = (request.params as any).message as string;

  const approved = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading('Sign Transaction'),
        divider(),
        text(`${origin} is requesting to sign following message:`),
        text(message),
        text(`**Only sign if you trust the website.**`),
      ]),
    },
  });

  if (!approved) {
    throw new Error('Signature denied for transaction!');
  }

  const acc = await Account.generate();
  return acc.signMessage(message);
};
