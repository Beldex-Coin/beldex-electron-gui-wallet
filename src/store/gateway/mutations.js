const objectAssignDeep = require("object-assign-deep");

export const set_app_data = (state, data) => {
  state.app = objectAssignDeep.noMutate(state.app, data);
};
export const set_daemon_data = (state, data) => {
  state.daemon = objectAssignDeep.noMutate(state.daemon, data);
};
export const set_wallet_data = (state, data) => {
  state.wallet = objectAssignDeep.noMutate(state.wallet, data);
};
export const set_wallet_list = (state, data) => {
  state.wallets = objectAssignDeep.noMutate(state.wallets, data);
};
export const set_old_gui_import_status = (state, data) => {
  state.old_gui_import_status = data;
};
export const set_tx_status = (state, data) => {
  state.tx_status = data;
};
export const set_sweep_all_status = (state, data) => {
  state.sweep_all_status = data;
};
export const set_mnode_status = (state, data) => {
  state.master_node_status = objectAssignDeep.noMutate(
    state.master_node_status,
    data
  );
};
export const set_prove_transaction_status = (state, data) => {
  state.prove_transaction_status = {
    ...state.prove_transaction_status,
    ...data
  };
};
export const set_check_transaction_status = (state, data) => {
  state.check_transaction_status = {
    ...state.check_transaction_status,
    ...data
  };
};

export const set_sign_status = (state, data) => {
  state.sign_status = {
    ...state.sign_status,
    ...data
  };
};

export const set_verify_status = (state, data) => {
  state.verify_status = {
    ...state.verify_status,
    ...data
  };
};

export const set_bns_status = (state, data) => {
  state.bns_status = data;
};

export const set_update_required = (state, data) => {
  state.update_required = data;
};

export const set_router_path_rightpane = (state, data) => {
  state.router_path_rightpane = data;
};

export const set_sender_address = (state, data) => {
  state.sender_address = data;
};

export const set_stepperPosition = (state, data) => {
  state.stepperPosition = data;
};

export const set_currencyList = (state, data) => {
  state.currencyList = data;
};

export const set_exchangeAmount = (state, data) => {
  state.exchangeAmount = data;
};

export const set_createdTxnDetails = (state, data) => {
  state.createdTxnDetails = data;
};

export const set_validateAddress = (state, data) => {
  state.RecipientAddressValidation = data;
};
export const set_refundAddressValidation = (state, data) => {
  state.refundAddressValidation = data;
};

export const set_pairsMinMax = (state, data) => {
  state.pairsMinMax = data;
};

export const set_txnStatus = (state, data) => {
  state.txnStatus = data;
};
export const set_fixedExchangeRate = (state, data) => {
  state.fixedExchangeRate = data;
};
export const set_txnHistory = (state, data) => {
  state.txnHistory = data;
};
