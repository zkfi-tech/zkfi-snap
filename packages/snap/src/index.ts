import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { getAccountHandler, signMessageHandler, signTransactionHandler } from './handlers';
import { rpcMethod } from './rpcMethods';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = (args) => {
  switch (args.request.method) {
    case rpcMethod.GET_ACCOUNT:
      return getAccountHandler(args);
    case rpcMethod.SIGN_MESSAGE:
      return signMessageHandler(args);
    case rpcMethod.SIGN_TRANSACTION:
      return signTransactionHandler(args);
    default:
      throw new Error('Method not found.');
  }
};
