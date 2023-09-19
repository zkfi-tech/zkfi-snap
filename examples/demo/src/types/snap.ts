export type GetSnapsResponse = Record<string, SnapInfo>;

export type SnapInfo = {
  permissionName: string;
  id: string;
  version: string;
  initialPermissions: Record<string, unknown>;
};
