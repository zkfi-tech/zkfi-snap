const VERSION = 1;

export type Asset = {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
};

export const assetInfo: Record<number, Asset> = {
  65537: {
    name: 'matic',
    symbol: 'MATIC',
    decimals: 18,
    address: '0x0',
  },
};

export const requestEntropy = async () => {
  return snap.request({
    method: 'snap_getEntropy',
    params: {
      version: VERSION,
    },
  });
};

export const formatUnits = (value: bigint, decimals: number, precision: number = 4) => {
  return Number((value * BigInt(10 ** precision)) / BigInt(10 ** decimals)) / 10 ** precision;
};
