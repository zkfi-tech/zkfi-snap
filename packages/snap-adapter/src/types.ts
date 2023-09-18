declare global {
  interface Window {
    ethereum: any;
  }
}

export type RequestParams = Record<string, any>;

export type GetSnapsResponse = Record<string, Snap>;

export type Snap = {
  permissionName: string;
  id: string;
  version: string;
  initialPermissions: Record<string, unknown>;
};

export type NoteData = {
  assetId: number;
  value: string;
  owner: string;
};

export interface SchnorrSignature {
  e: string;
  s: string;
}
