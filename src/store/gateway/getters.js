const toSafeHeight = value => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const getTargetHeight = state => {
  const { daemons, app } = state.app.config;
  const config_daemon = daemons[app.net_type];
  const daemonHeight = toSafeHeight(state.daemon.info.height);
  const daemonTargetHeight = toSafeHeight(state.daemon.info.target_height);
  const localHeight = toSafeHeight(state.daemon.info.height_without_bootstrap);

  if (config_daemon.type === "local" || config_daemon.type === "local_remote") {
    return Math.max(daemonHeight, daemonTargetHeight, localHeight);
  }

  return daemonHeight;
};

const isWalletReady = state => {
  const target_height = getTargetHeight(state);
  const walletHeight = toSafeHeight(state.wallet.info.height);

  if (target_height === 0) {
    return walletHeight > 0;
  }

  return walletHeight >= target_height - 1;
};

export const isReady = state => {
  return isWalletReady(state);
};

export const isAbleToSend = state => {
  const { daemons, app } = state.app.config;
  const config_daemon = daemons[app.net_type];

  const target_height = getTargetHeight(state);
  const walletReady = isWalletReady(state);

  if (config_daemon.type === "local_remote") {
    return (
      state.daemon.info.height_without_bootstrap >= target_height && walletReady
    );
  } else {
    return walletReady;
  }
};

export const load_balance = state => {
  return state.wallet.info.load_balance;
};
