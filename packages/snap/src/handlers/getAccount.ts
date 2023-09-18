import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { divider, heading, panel, text } from '@metamask/snaps-ui';
import { Account } from '../zkfi/account';

export const getAccountHandler: OnRpcRequestHandler = async ({ request, origin }) => {
  const reqView = (request.params as any).requestView as boolean;

  const panelContent = [
    heading('View Permission'),
    divider(),
    text(`${origin} is requesting permission to access details of your **Shielded Account**`),
  ];

  if (reqView) {
    panelContent.push(
      text('It also request to access the **View Key** of your account'),
      text('This permission allows the website to view your account balance and all transactions'),
    );
  }

  panelContent.push(text(`**Only grant this permission if you trust the website.**`));

  const approved = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel(panelContent),
    },
  });

  if (!approved) {
    throw new Error('Permission denied for view key request');
  }

  const acc = await Account.generate();
  const info: any = {
    signPublicKey: acc.signPublicKey,
    viewPublicKey: acc.viewPublicKey,
  };
  if (reqView) {
    info.viewPrivateKey = acc.viewPrivateKey;
  }

  return info;
};
