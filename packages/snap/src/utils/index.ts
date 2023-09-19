const VERSION = 1;

export const assetIdToName: Record<number, string> = {
  65537: 'MATIC',
};

export const requestEntropy = async () => {
  return snap.request({
    method: 'snap_getEntropy',
    params: {
      version: VERSION,
    },
  });
};
