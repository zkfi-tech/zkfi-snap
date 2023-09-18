import { rpcMethod as rpc } from './rpcMethods';
import { GetSnapsResponse, NoteData, RequestParams, SchnorrSignature, Snap } from './types';

export const defaultSnapId = 'npm:@zkfi-tech/metamask-snap';

export class SnapAdapter {
  id: string;

  constructor(id: string = defaultSnapId) {
    this.id = id;
  }

  getAccount(requestView = false) {
    return this.sendRequest({ method: rpc.GET_ACCOUNT, params: { requestView } });
  }

  signMessage(message: string | string[]) {
    return this.sendRequest({ method: rpc.SIGN_MESSAGE, params: { message } });
  }

  async signTransaction(notes: NoteData[]): Promise<SchnorrSignature[]> {
    const signs = await this.sendRequest({ method: rpc.SIGN_TRANSACTION, params: { notes } });
    return signs;
  }

  async connect(params: Record<'version' | string, unknown> = {}) {
    await window.ethereum.request({
      method: 'wallet_requestSnaps',
      params: {
        [this.id]: params,
      },
    });
  }

  sendRequest(request: RequestParams & { method: string }) {
    return window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: { snapId: this.id, request },
    });
  }

  async isPermitted() {
    return !!(await this.get());
  }

  async get(version?: string): Promise<Snap | undefined> {
    return SnapAdapter.getSnap(this.id, version);
  }

  static async getSnap(snapId: string, version?: string): Promise<Snap | undefined> {
    try {
      const snaps = await SnapAdapter.getSnaps();

      return Object.values(snaps).find(
        (snap) => snap.id === snapId && (!version || snap.version === version),
      );
    } catch (e) {
      console.error('Failed to obtain installed snap', e);
      return undefined;
    }
  }

  static async getSnaps(): Promise<GetSnapsResponse> {
    return ((await window.ethereum.request({
      method: 'wallet_getSnaps',
    })) as unknown) as GetSnapsResponse;
  }

  static async isFlask() {
    const provider = window.ethereum;

    try {
      const clientVersion = await provider?.request({
        method: 'web3_clientVersion',
      });

      const isFlaskDetected = (clientVersion as string[])?.includes('flask');

      return Boolean(provider && isFlaskDetected);
    } catch {
      return false;
    }
  }
}
