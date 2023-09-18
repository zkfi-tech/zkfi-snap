const VERSION = 1;

export const requestEntropy = async () => {
  return snap.request({
    method: 'snap_getEntropy',
    params: {
      version: VERSION,
    },
  });
};

// export const requestAddress = async () => {};
