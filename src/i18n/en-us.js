export default {
  buttons: {
    // All button text is uppercased in the gui
    advanced: "Advanced",
    addAddressBook: "Add to Address book",
    addWallet: "Add Wallet",
    all: "All",
    back: "Back",
    browse: "Browse",
    cancel: "Cancel",
    change: "Change",
    check: "Check",
    clear: "Clear",
    goToStake: "Go to stake",
    clearForm: "Clear all",
    authorizeTransfer: "Authorize transfer",
    clearAll: "Clear All",
    close: "Close",
    contacts: "Contacts",
    copyAddress: "Copy Address",
    startOver: "Start Over",
    copyData: "Copy Data",
    copy: "Copy",
    copyJson: "Copy JSON",
    copySignature: "Copy Signature",
    createWallet: "Create Wallet",
    decrypt: "Decrypt",
    addRecord: "Add BNS",
    delete: "Delete",
    done: "Done",
    edit: "Edit",
    editNotes: "Edit Notes",
    enter: "Enter",
    export: "Export",
    fromBlockheight: "From Blockheight",
    generate: "Generate",
    generateProof: "Generate proof",
    import: "Import",
    importWallet: "Import Wallet | Import Wallets",
    bns: "BELDEX Name Service",
    min: "Min",
    next: "Next",
    openWallet: "Open Wallet",
    purchase: "Purchase",
    receive: "Receive",
    registerMasterNode: "Register Master Node",
    renew: "Renew",
    refresh: "Refresh",
    rescan: "Rescan",
    restoreWallet: "Restore Wallet",
    save: "Save",
    saveTxNotes: "Save Notes",
    selectLocation: "Location",
    selectWalletFile: "Select File",
    send: "Send",
    sendCoins: "Send Coins",
    masterNode: "Master Node",
    settings: "Settings",
    showQRCode: "Show QR Code",
    showTxDetails: "TXN Details",
    sign: "Sign",
    stake: "Stake",
    sweepAll: "Sweep All",
    unlock: "Unlock",
    update: "Update",
    verify: "Verify",
    viewOnExplorer: "View in explorer",
    add: "Add",
    max: "Max",
    paste: "Paste",
    bnsUpdate: "BNS Update",
    bnsRenew: "BNS Renew"
  },
  dialog: {
    // Generic buttons
    buttons: {
      ok: "OK",
      cancel: "Cancel",
      open: "Open"
    },

    // Dialogs
    banPeer: {
      title: "Ban Peer",
      peerDetailsTitle: "Peer Details",
      message: "Enter length to ban peer in seconds.\nDefault 3600 = 1 hour.",
      ok: "Ban Peer",
      description:
        "Enter length to ban peer in seconds.\nDefault 3600 = 1 Hour (86400 = 24 Hours)",
      targetIp: "Target IP:",
      lengthPlaceholder: "Enter length",
      minimum: "Minimum: 60s",
      invalid: "Enter at least 60 seconds.",
      banAction: "Ban peer"
    },
    copyAddress: {
      title: "Copy address",
      message:
        "There is a payment id associated with this address.\nBe sure to copy the payment id separately."
    },
    copyPrivateKeys: {
      // Copy {seedWords/viewKey/spendKey}
      title: "Copy {type}",
      message:
        "Be careful who you send your private keys to as they control your funds.",
      seedWords: "Seed Words",
      viewKey: "View Key",
      spendKey: "Spend Key"
    },
    confirmPurchase: {
      title: "Confirm Purchase",
      ok: "Confirm"
    },
    deleteAddress: {
      title: "Delete Address",
      message: "Are you sure you want to delete this address?",
      heading: "Delete contact",
      question: "Are you sure you want to delete {name} from your contacts?"
    },
    discardEdit: {
      title: "Are you Sure?",
      message: "Are you sure you want to Discard the editing?",
      ok: "Continue",
      cancel: "Discard",
      heading: "Discard changes?",
      question: "You have unsaved edits to this contact.",
      keepEditing: "Keep editing"
    },
    showMasterNode: {
      title: "Show master node",
      message: "Do you want to continue?",
      masterNode: "Master node"
    },
    deleteWallet: {
      title: "Delete Wallet",
      message: "Are you sure you want to delete the current wallet?",
      ok: "Delete",
      heading: "Delete wallet",
      warning:
        "This removes the wallet files from this computer. You can restore it only with your recovery seed.",
      confirm: "Delete wallet"
    },
    exit: {
      title: "Exit",
      message: "Are you sure you want to Exit the wallet?",
      ok: "Exit Wallet",
      heading: "Exit wallet",
      question: "Are you sure you want to exit the wallet?",
      confirm: "Exit"
    },
    keyImages: {
      title: "{type} Key Images",
      message: "Do you want to {type} key images?",
      export: "Export",
      import: "Import"
    },
    bnsUpdate: {
      title: "Update BNS record",
      message: "Do you want to update the BNS record?",
      ok: "Update"
    },
    noPassword: {
      title: "No Password Set",
      message: "Are you sure you want to create a wallet with no password?",
      ok: "Yes"
    },
    password: {
      title: "Enter your Wallet Password",
      message: "Just click “Enter” if you haven’t set any password :)",
      heading: "Enter wallet password",
      subtitle: "Enter your wallet password to continue.",
      unlocking: "Unlocking · {name}",
      placeholder: "Enter password",
      hint:
        "Just click “Unlock” if you haven’t set a password for this wallet.",
      unlock: "Unlock",
      showPassword: "Show password",
      hidePassword: "Hide password"
    },
    purchase: {
      title: "Purchase name",
      message: "Do you want to purchase the name?",
      ok: "Purchase"
    },
    renew: {
      title: "Renew name",
      message: "Do you want to renew the name?",
      ok: "Renew"
    },
    registerMasterNode: {
      title: "Register master node",
      message: "Do you want to register the master node?",
      ok: "Register"
    },
    rescan: {
      title: "Rescan wallet",
      message:
        "Warning: Some information about previous transactions\nsuch as the recipient's address will be lost.",
      ok: "Rescan"
    },
    restart: {
      title: "Restart",
      message: "Changes require restart. Would you like to restart now?",
      ok: "Restart Wallet",
      heading: "Restart wallet",
      confirm: "Restart"
    },
    showPrivateKeys: {
      title: "Show Private Keys",
      message: "Do you want to view your private keys?",
      subtitle: "Enter your wallet password to reveal keys.",
      ok: "Reveal keys"
    },
    signature: {
      title: "Signature",
      message:
        "Copy the data signed by your primary address's private key below"
    },
    stake: {
      title: "Stake",
      message: "Do you want to stake?",
      ok: "Stake"
    },
    sweepAll: {
      title: "Sweep all",
      message: "Do you want to sweep all?",
      ok: "Sweep all"
    },
    sweepAllWarning: {
      title: "Sweep all warning",
      message:
        "You are about to combine all of your unspent funds by sending a transaction to yourself, your wallet may show a balance of 0 temporarily, after 10 blocks your funds will unlock and you may stake normally.",
      ok: "Continue"
    },
    switchWallet: {
      title: "Switch wallet",
      closeMessage: "Are you sure you want to close the current wallet?",
      restartMessage:
        "The wallet RPC is currently syncing. \nIf you wish to switch wallets then you must restart the application. \nYou will lose your syncing progress and have to rescan the blockchain again.",
      restartWalletMessage:
        "Are you sure you want to close and restart the wallet?"
    },
    transactionDetails: {
      title: "Transaction Details",
      subtitle: "Raw data returned by the wallet",
      ok: "Close"
    },
    transfer: {
      title: "Transfer",
      message: "Do you want to send the transaction?",
      ok: "Send"
    },
    confirmTransaction: {
      title: "Confirm Sending",
      sendTo: "Send to",
      priority: "Priority"
    },
    confirmUpdate: {
      title: "Confirm Update",
      ok: "Update"
    },
    confirmRenew: {
      title: "Confirm Renew",
      ok: "Renew"
    },
    unlockConfirm: {
      title: "Confirm unlock",
      ok: "Unlock"
    },
    unlockMasterNode: {
      title: "Unlock master node",
      confirmTitle: "Confirm unlock",
      message: "Do you want to unlock the master node?",
      ok: "Unlock"
    },
    unlockMasterNodeWarning: {
      title: "Unlock master node warning",
      message:
        "Unlocking a partial stake in a node will also unstake for any other participants, if staking in a shared node its best to let the operator and other participants know you are unstaking.",
      ok: "Continue"
    }
  },
  fieldLabels: {
    // Field labels are also all uppercased
    address: "Address",
    recipientAddress: "Recipient Address",
    amount: "Amount",
    belnetId: "Belnet ID",
    eth: "ETH",
    backupOwner: "Backup Owner",
    confirmPassword: "Confirm Password (optional)",
    daemonLogLevel: "Daemon Log Level",
    daemonP2pPort: "Daemon P2P Port",
    data: "Data",
    dataStoragePath: "Data Storage Path",
    decryptRecord: "Add Record",
    expirationHeight: "Expiration Height",
    filter: "Filter",
    filterTransactionType: "FILTER BY TRANSACTION TYPE",
    startDate: "Start Date",
    endDate: "End Date",
    internalWalletPort: "Internal Wallet Port",
    keyImages: {
      exportDirectory: "Key Image Export Directory",
      importFile: "Key Image Import File"
    },
    limitDownloadRate: "Limit Download Rate",
    limitUploadRate: "Limit Upload Rate",
    bnsType: "BNS RECORD TYPE",
    localDaemonIP: "Local Daemon IP",
    localDaemonPort: "Local Daemon Port",
    belnetFullAddress: "BELNET FULL ADDRESS",
    maxIncomingPeers: "Max Incoming Peers",
    maxOutgoingPeers: "Max Outgoing Peers",
    message: "Message",
    mnemonicSeed: "Recovery Seed",
    name: "Name",
    nameHash: "Name Hash",
    newWalletName: "Wallet Name",
    notes: "Notes",
    addressBookNotes: "Address Book Notes",
    optional: "optional",
    owner: "Owner",
    password: "Password (optional)",
    paymentId: "PAYMENT ID",
    priority: "Priority",
    remoteNodeHost: "Remote Node Host",
    remoteNodePort: "Remote Node Port",
    restoreFromBlockHeight: "Restore from BlockHeight",
    restoreFromDate: "Restore from Date",
    seedLanguage: "Seed Language",
    masterNodeCommand: "Master Node Command",
    masterNodeKey: "Master Node Key",
    values: "Values",
    bchatId: "BCHAT ID",
    signature: "Signature",
    transactionId: "Transaction ID",
    walletFile: "Wallet File",
    walletLogLevel: "Wallet Log Level",
    walletName: "Wallet Name",
    walletRPCPort: "Wallet RPC Port",
    walletStoragePath: "Wallet Storage Path",

    // These are specific labels which do not get uppercased
    confirmNewPassword: "Confirm New Password",
    newPassword: "New Password",
    oldPassword: "Old Password",
    rescanFullBlockchain: "Rescan Full Blockchain",
    rescanSpentOutputs: "Rescan Spent Outputs",
    transactionNotes: "Transaction Notes",
    totalBalance: "Total Balance",
    chooseNetwork: "Choose a Network",
    network: "Network",

    // new design vamp
    to: "To",
    recipientAddressBns: "Recipient address / BNS name",
    OwnerWalletaddress: "Owner Wallet address",
    backupOwnerWalletAddress: "Backup Owner Wallet Address",
    updateOwner: "Update owner",
    updateValues: "Update values",
    updateHeight: "Update Height",
    walletAddress: "Wallet address",
    privateViewkey: "Private viewkey",
    privateSpendkey: "Private spendkey",
    year: "Year"
  },
  footer: {
    ready: "Synchronized",
    scanning: "Scanning",
    status: "Status",
    syncing: "Syncing",
    remote: "Remote",
    wallet: "Wallet",
    updateRequired: "UPDATE REQUIRED"
  },
  menuItems: {
    walletMenuTitle: "Wallet",
    about: "About",
    changePassword: "Change password",
    copyAddress: "Copy address",
    copySeed: "Copy Seed",
    copyBackupOwner: "Copy backup owner",
    copyBelnetAddress: "Copy belnet address",
    copyBelnetName: "Copy belnet name",
    copyName: "Copy name",
    copyOwner: "Copy owner",
    copyQR: "Copy QR code",
    copySeedWords: "Copy seed words",
    copyBchatId: "Copy bchat ID",
    copySpendKey: "Copy spend key",
    copyMasterNodeKey: "Copy master node key",
    copyTransactionId: "Copy transaction ID",
    copyViewKey: "Copy view key",
    createNewWallet: "Create New Wallet",
    deleteWallet: "Delete wallet",
    exit: "Exit Wallet",
    importOldGUIWallet: "Import wallets from old GUI",
    manageKeyImages: "Key images",
    openWallet: "Open wallet",
    rescanWallet: "Rescan wallet",
    restoreWalletFile: "Restore wallet from file",
    restoreWalletSeed: "Restore wallet from seed",
    saveQR: "Save QR code to file",
    sendToThisAddress: "Send to this address",
    settings: "Settings",
    showDetails: "Show details",
    showPrivateKeys: "Show private keys",
    showQRCode: "Show QR Code",
    switchWallet: "Switch Wallet",
    viewOnExplorer: "View on explorer",
    favourite: "Favourite"
  },
  notification: {
    positive: {
      addressCopied: "Address copied to clipboard",
      linkCopied: "Link copied to clipboard",
      backupOwnerCopied: "Backup owner copied to clipboard",
      bannedPeer: "Banned {host} until {time}",
      copied: "{item} copied to clipboard",
      decryptedBNSRecord: "Successfully decrypted BNS Record for {name}",
      itemSaved: "{item} saved to {filename}",
      keyImages: {
        exported: "Key images exported to {filename}",
        imported: "Key images imported"
      },
      bnsRecordUpdated: "BNS Record was successfully updated",
      belnetAddressCopied: "Full belnet address copied",
      belnetNameCopied: "Belnet name copied",
      passwordUpdated: "Password updated",
      namePurchased: "Name successfully purchased",
      nameRenewed: "Name successfully renewed",
      nameCopied: "Name copied to clipboard",
      ownerCopied: "Owner copied to clipboard",
      qrCopied: "QR code copied to clipboard",
      registerMasterNodeSuccess: "Successfully registered master node",
      sendSuccess: "Transaction successfully sent",
      masterNodeInfoFilled: "Master node key and min amount filled",
      bchatIdCopied: "Bchat ID copied to clipboard",
      signatureCopied: "Signature copied to clipboard",
      signatureVerified: "Signature verified",
      stakeSuccess: "Successfully staked",
      transactionNotesSaved: "Transaction notes saved"
    },
    errors: {
      banningPeer: "Error banning peer",
      cannotAccessRemoteNode:
        "Could not access remote node, please try another remote node",
      changingPassword: "Error changing password",
      copyWalletFail: "Failed to copy wallet",
      copyingPrivateKeys: "Error copying private keys",
      dataPathNotFound: "Data storage path not found",
      dataPathCreateFailed: "Failed to create data storage directory",
      // decryptBNSRecord: "Failed to decrypt BNS Record for {name}",
      decryptBNSRecord:
        "The given BNS record doesn't exist or does not belong to this wallet",
      differentNetType: "Remote node is using a different nettype",
      enterSeedWords: "Enter seed words",
      enterTransactionId: "Enter transaction ID",
      enterTransactionProof: "Enter transaction proof",
      enterWalletName: "Enter a wallet name",
      enterName: "Enter a name",
      errorSavingItem: "Error saving {item}",
      failedMasterNodeUnlock: "Failed to unlock master node",
      failedToSetLanguage: "Failed to set language: {lang}",
      failedWalletCreation: "Failed to create wallet. Please try again.",
      failedWalletImport: "Failed to import wallet",
      failedWalletOpen: "Failed to open wallet. Please try again.",
      failedWalletRead: "Failed to read wallets",
      failedWalletRestore: "Failed to restore wallet. Please try again.",
      internalError: "Internal error",
      invalidAddress: "Address not valid",
      invalidAmount: "Amount not valid",
      invalidBackupOwner: "Backup owner address not valid",
      invalidNameLength: "Invalid name length",
      invalidNameFormat: "Name may only contain alphanumerics and hyphens",
      invalidNameHypenNotAllowed:
        "Name may only begin or end with alphanumerics or an underscore",
      invalidOldPassword: "Invalid old password",
      invalidOwner: "Owner address not valid",
      invalidPassword: "Invalid password",
      invalidPaymentId: "Payment id not valid",
      invalidPrivateViewKey: "Invalid private viewkey",
      invalidPublicAddress: "Invalid public address",
      invalidRestoreDate: "Invalid restore date",
      invalidRestoreHeight: "Invalid restore height",
      invalidSeedLength: "Invalid seed word length",
      invalidMasterNodeCommand:
        "Please enter the master node registration command",
      invalidMasterNodeKey: "Master node key not valid",
      invalidBchatId: "Bchat ID not valid",
      invalidSignature: "Invalid signature",
      invalidWalletPath: "Invalid wallet path",
      keyImages: {
        exporting: "Error exporting key images",
        reading: "Error reading key images",
        importing: "Error importing key images",
        notSyncedFarEnough:
          "This wallet hasn't synced far enough to match the exported key images yet. Wait until it finishes syncing, then try importing again."
      },
      negativeAmount: "Amount cannot be negative",
      newPasswordNoMatch: "New passwords do not match",
      newPasswordSame: "Cannot use old password. Set a different password.",
      passwordFieldEmpty: "Please enter your password!",
      notEnoughBalance: "Not enough unlocked balance",
      passwordNoMatch: "Passwords do not match",
      remoteCannotBeReached: "Remote daemon cannot be reached",
      selectWalletFile: "Select a wallet file",
      unknownError: "An unknown error occurred",
      walletAlreadyExists: "Wallet with name already exists",
      walletPathNotFound: "Wallet data storage path not found",
      walletPathCreateFailed: "Failed to create wallet data storage directory",
      zeroAmount: "Amount must be greater than zero",
      greaterHeight: "Entered value is greater than current block height"
    },
    warnings: {
      privateKeysAfterSync:
        "Private keys can be shown once the wallet has finished syncing.",
      noKeyImageExport: "No key images found to export",
      retryingRemoteNode:
        "Still trying to reach the remote node (attempt {attempt} of {total})...",
      usingLocalNode: "Could not access remote node, switching to local only",
      localNodeFailedUsingRemote:
        "Local node failed to start, using remote node",
      usingRemoteNode: "beldexd not found, using remote node"
    }
  },
  placeholders: {
    pasteSignature: "Paste signature",
    signerAddress: "Signer address",
    dataThatWasSigned: "Data that was signed",
    searchContacts: "Search contacts",
    additionalNotes: "Additional notes",
    addNotesOptional: "Add notes (optional)",
    addressBookName: "Name that belongs to this address",
    addressOfSigner: "Public wallet address of signer",
    beldexAddress: "Enter bx… address or name.bdx",
    dataToSign: "Data you want to sign with your primary address's private key",
    filterTx: "Enter an ID, name, address or amount",
    hexCharacters: "{count} hexadecimal characters",
    bnsName: "The name to purchase via Beldex Name Service",
    bnsOwner: "The wallet address of the owner",
    bnsBackupOwner: "The wallet address of the backup owner",
    bnsDecryptName: "A BNS name that belongs to you",
    belnetFullAddress: "Full belnet address to map BNS name to (without .bdx)",
    enterName: "Enter Name",
    enterRecipientAddress: "Enter your {coin} recipient address",
    enterAddress: "Enter Address",
    enteroldPassword: "Enter old password",
    enterNewPassword: "Enter new password",
    reEnterPassword: "Re-enter new password",
    mnemonicSeed: "Enter your Recovery seed",
    restoreSeed: "Enter your 25-word recovery seed",
    pasteTransactionId: "Paste transaction ID",
    pasteTransactionProof: "Paste transaction proof",
    proveOptionalMessage:
      "Optional message against which the signature is signed",
    recipientWalletAddress: "Recipient's wallet address",
    selectAFile: "Please select a file",
    bchatId: "The Bchat ID to link to Beldex Name Service",
    signature: "Signature to verify",
    transactionNotes: "Additional notes to locally attach to the transaction",
    unsignedData: "The data as it should look before it was signed",
    walletName: "Enter your Wallet Name",
    hexKey: "64-character hex key",
    walletPassword: "Enter Password",
    reEnterWalletPassword: "Re-Enter Password",
    enterEthAddress: "Enter your ETH Address",
    enterBelnetId: "Enter your Belnet ID",
    enterBchatId: "Enter your BChat ID",
    enterWalletAddress: "Enter your Wallet Address",
    bnsOwnerShort: "Owner wallet address",
    bnsBackupOwnerShort: "Backup owner address",
    bnsValueBchat: "Enter BChat ID value",
    bnsValueBelnet: "Enter Belnet ID value",
    bnsValueAddress: "Enter Address value",
    bnsValueEth: "Enter ETH value"
  },
  strings: {
    aboutPanel: {
      walletVersion: "Wallet version",
      daemonVersion: "Daemon version",
      copyright: "Copyright (c) - 2018-2021, Beldex",
      rights: "All rights reserved."
    },
    addAddressBookEntry: "Add Address ",
    addressBookDetails: "Address book details",
    addressBookIsEmpty: "Address book is empty",
    addresses: {
      myPrimaryAddress: "My primary address",
      myUnusedAddresses: "Unused Address",
      myUsedAddresses: "Used addresses",
      // primaryAddress: "Primary address",
      subAddress: "Sub-address",
      subAddressIndex: "Index {index}",
      //new design vamp
      primaryAccount: "Primary Account"
    },
    advancedOptions: "Advanced Settings",
    availableBalance: "Available balance",
    confirmed: "Confirmed",
    showBalance: "Show",
    hideBalance: "Hide",
    electronWallet: "Electron Wallet",
    languageDefault: "Default",
    walletCount: "{count} wallet | {count} wallets",
    selectWalletToUnlock: "Select a wallet to unlock",
    walletsStoredIn: "Wallet files are stored locally in {path}",
    walletModeSubtitle: "Choose how to add a wallet",
    createWalletHint: "Generate a new seed",
    createWalletSubtitle: "Name your new wallet",
    restoreWalletHint: "Restore from your 25-word seed",
    restoreWalletSubtitle: "Restore an encrypted vault from seed or keys",
    viewOnlyBadge: "View-only",
    viewOnlyTitle: "This wallet is view-only",
    viewOnlyDescription: "Please load the full wallet to enable sending coins.",
    spendKeyNotLoaded: "Spend key not loaded",
    viewOnlyTag: "View only",
    noSpendKeyViewOnly:
      "No spend key — this wallet will be restored as VIEW-ONLY. You can watch the balance and incoming transfers, but you can’t send BDX from it.",
    restorePointSubtitle: "Step 2 / 2 · choose where to start scanning",
    restoreFirstBlockHint:
      "Restoring from the very first block ({date}) so no transactions are missed. If you know roughly when this wallet was created, a later date makes restoring much faster.",
    currentHeight: "Current height {height}",
    passwordsMatch: "Passwords match",
    restoreKeysSubtitle: "Step 1 / 2 · enter your wallet keys",
    restoreFromSeedTab: "Restore from seed",
    restoreFromKeysTab: "Restore from keys",
    seedWordsHint: "Separate words with spaces",
    seedWordCount: "{count} / 25 words",
    importWalletHint: "Import a wallet .keys file",
    languageRegional: "Regional",
    networkActive: "{network} active",
    awaitingConfirmation: "Awaiting confirmation",
    bannedPeers: {
      title: "Banned peers (bans will cleared if wallet is restarted)",
      bannedUntil: "Banned until {time}"
    },
    blockHeight: "Blockheight",
    height: "Height",
    cannotSign: "You cannot sign with a view only wallet.",

    checkTransaction: {
      description:
        "Verify that funds were paid to an address by supplying the transaction ID, the recipient address, the message used for signing and the signature.\nFor a 'Spend Proof' you dont need to provide the recipient address.",
      infoTitles: {
        confirmations: "Confirmations",
        inPool: "In pool",
        validTransaction: "Valid transaction",
        received: "Received amount"
      },
      validTransaction: {
        no: "NO",
        yes: "YES"
      }
    },
    closing: "Closing",
    connectingToBackend: "Connecting to backend",
    contribution: "Contribution",
    contributor: "Contributor",
    connectionTopology: "Select connection topology",
    ringCtEnforced: "Encryption: RingCT enforced",
    netTypes: {
      mainnet: "Mainnet",
      stagenet: "Stagenet",
      testnet: "Testnet"
    },
    daemon: {
      local: {
        title: "Local Daemon Only",
        description:
          "Full security, wallet will download the full blockchain. You will not be able to transact until sync is completed."
      },
      localRemote: {
        title: "Local + Remote Daemon",
        description:
          "Get started quickly with this default option. Wallet will download the full blockchain, but use a remote node while syncing."
      },
      remote: {
        title: "Remote Daemon Only",
        description:
          "Less security, wallet will connect to a remote node to make all transactions."
      }
    },
    destinationUnknown: "Destination Unknown",
    editAddressBookEntry: "Edit address book entry",
    expirationHeight: "Expiration height",
    encryptedBchatValue: "Encrypted Bchat Value",
    encryptedBelnetValue: "Encrypted Belnet Value",
    encryptedWalletValue: "Encrypted Wallet Value",
    encryptedEthAddrValue: "Encrypted ETH Address",
    bns: {
      noNamesYet: "No BNS names yet",
      noNamesHint: "Names you buy with this wallet will appear here.",
      buyAName: "Buy a name",
      bchatID: "Bchat ID",
      belnetName1Year: "Belnet Name 1 year",
      belnetNameXYears: "Belnet Name {years} years",
      prices: "Prices :",
      duration: "Duration",
      note: "Note",
      bnsRegistration: "BNS Name for registration",
      ownerNotes:
        "Use current address (leave blank if same wallet) or specify the address if it is a different wallet",
      ethNotes: "Our ETH address is compatible across all EVM chains.",
      records: "BNS Records",
      addRecord: "Add Record",
      fetchNewRecord: "Fetching BNS record from the network...",
      updateOwnerHint: "Transfer the name to a new owner or backup owner",
      updateValuesHint: "Change the BChat, Belnet, address or ETH value"
    },
    bnsPurchaseDescription:
      "Purchase or update an BNS record. If you purchase a name, it may take a minute or two for it to show up in the list.",
    bnsDescription:
      "Here you can find all the BNS names owned by this wallet. Decrypting a record you own returns the name and value of that BNS record.",
    bnsUpdateDescription:
      "You can update the owner or the values, not both at once. To change both, update the values before transferring ownership.",
    loadingSettings: "Loading settings",
    oxenBalance: "Balance",
    belnetNameDescription:
      "Purchase or update a name on Belnet. If you purchase a name it may take a minute or two for it to show up in the list. To learn more about belnet visit: ",
    oxenUnlockedBalance: "Unlocked Balance",
    oxenUnlockedShort: "Unlocked",
    availableShort: "Available",
    me: "Me",
    noTransactionsFound: "No transactions yet!",
    notes: "Notes",
    numberOfUnspentOutputs: "Number of unspent outputs",
    operator: "Operator",
    paymentID: "Payment ID",
    peerList: "Peer List",
    priorityOptions: {
      automatic: "Automatic",
      slow: "Slow",
      normal: "Normal",
      fast: "Fast",
      fastest: "Fastest",
      flash: "Flash"
    },
    proveTransactionDescription:
      "Generate a proof of your incoming or outgoing payment by supplying the transaction ID, the recipient address and an optional message. For outgoing payments you get a ‘Spend proof’ that proves authorship of a transaction; you don’t need to specify the recipient address.",
    readingWalletList: "Reading wallet list",
    recentIncomingTransactionsToAddress:
      "Recent incoming transactions to this address",
    recentTransactionsWithAddress: "Recent transactions",
    rescanFullHint:
      "Rebuilds balance and history from the restore height. Slowest.",
    rescanSpentHint: "Re-checks which outputs are spent. Fast.",
    rescanModalDescription:
      "Select a full rescan or a rescan of spent outputs only.",
    saveSeedWarning: "Please copy and save these in a secure location!",
    privateKeysWarning:
      "Never share your recovery seed or keys. Anyone with them can spend your BDX. Store them offline in a secure location.",
    primaryAddressLabel: "Primary address",
    saveToAddressBook: "Save to address book",
    keysAvailableAfterSync: "Available once the wallet has finished syncing.",
    seedWords: "Recovery Seed",
    walletCreated: "Wallet Created",
    selectLanguage: "Select a language",
    masterNodeContributionDescription:
      "Staking contributes to the safety of the Beldex network. For your contribution, you earn BDX. Once staked, you will have to wait either 15 or 30 days to have your BDX unlocked, depending on if a stake was unlocked by a contributor or the node was deregistered. To learn more about staking, please visit the documentation on the",
    masterNodeRegistrationDescription:
      'Enter the {registerCommand} command produced by the daemon that is registering to become a Master Node using the "{prepareCommand}" command',
    masterNodeStartStakingDescription: "To start Staing, Please visit",
    masterNodeStartStakingDescription1: "Tab -->",
    stakingSummary: "Staking summary",
    totalStaked: "Total staked",
    activeStakes: "Active stakes",
    deregisteredStakes: "Deregistered",
    unlockPeriod: "Unlock period",
    unlockPeriodValue: "15 / 30 d",
    stakingUnlockNote:
      "Unlocking a stake takes 15 or 30 days, depending on whether it was unlocked by a contributor or the node was deregistered.",
    masterNodesHint: "Masternodes",
    noActiveStakes: "No active stakes",
    stakingSummaryNote:
      "Staking contributes to the safety of the Beldex network. Once staked, BDX unlocks after 15 or 30 days, depending on whether the stake was unlocked by a contributor or the node was deregistered.",
    readStakingDocs: "Read the staking documentation",
    noActiveStakesHint:
      "To start staking, open the Stake tab and contribute BDX to a masternode.",
    bnsServiceHint: "Beldex Name Service",
    encryptedRecord: "Encrypted record",
    purchaseSummary: "Purchase summary",
    estimate: "Estimate",
    price: "Price",
    total: "Total",
    bnsPurchaseNote:
      "It may take a minute or two for a new name to show up in My BNS.",
    yourNames: "Your names",
    activeNames: "Active",
    nextExpiry: "Next expiry",
    bnsRenewNote: "Renew a name before its expiration height to keep it.",
    masterNodeRegistered: "Registered",
    masterNodeDeregistered: "Deregistered",
    keyImage: "Key image",
    signature: "Signature",
    operatorFee: "Operator fee",
    masterNodeKeyShort: "MN key",
    masterNodesNoneAvailable:
      "There are no masternodes currently available for contribution.",
    noMasterNodesCurrentlyAvailable:
      "There are currently no master nodes available for contribution",
    masterNodeDetails: {
      contributors: "Contributors",
      lastRewardBlockHeight: "Last reward block height",
      lastUptimeProof: "Last uptime proof",
      maxContribution: "Max contribution",
      minContribution: "Min contribution",
      operatorFee: "Operator Fee",
      registrationHeight: "Registration height",
      unlockHeight: "Unlock height",
      reserved: "Reserved",
      masterNodeKey: "Master Node Key",
      snKey: "MN Key",
      stakingRequirement: "Staking requirement",
      totalContributed: "Total contributed"
    },
    signAndVerifyDescription:
      "Sign data with your primary address's private key or verify a signature against a public address.",
    spendKey: "Spend key",
    spendKeyHint:
      "If the spend key is not provided, the wallet will be restored in view-only mode.",
    startingDaemon: "Starting daemon",
    startingWallet: "Starting wallet",
    switchToDateSelect: "Switch to date select",
    switchToHeightSelect: "Switch to height select",
    syncingDaemon: "Syncing Daemon",
    transactionID: "Transaction ID",
    transactionConfirmed: "confirmed",
    transactions: {
      amount: "Amount",
      description: "{type} transaction",
      fee: "Fee",
      paidBySender: "paid by sender",
      received: "Received",
      sent: "Sent",
      sentTo: "{type} transaction sent to",
      timestamp: "Timestamp",
      date: "Date",
      filterByDate: "Filter by date",
      clearDateRange: "Clear date filter",
      tabs: {
        incoming: "Incoming",
        outgoing: "Outgoing"
      },
      recentCount: "{count} recent",
      types: {
        all: "All",
        incoming: "Receive",
        outgoing: "Sent",
        pending: "Pending",
        pendingIncoming: "Pending incoming",
        pendingOutgoing: "Pending outgoing",
        miner: "Miner",
        masterNode: "Master Node",
        governance: "Governance",
        bns: "Bns",
        stake: "Stake",
        failed: "Failed"
      }
    },
    unlockingAtHeight: "Unlocking at height {number}",
    unspentOutputs: "Unspent outputs",
    userNotUsedAddress: "You have not used this address",
    userUsedAddress: "You have used this address",
    version: "Version",
    viewKey: "View Key",
    viewOnlyMode:
      "View only mode. Please load full wallet in order to send coins.",
    website: "website",
    privacy: "Privacy",
    normal: "Normal"
  },
  titles: {
    addressBook: "Address Book",
    addressDetails: "Address Details",
    contactBook: "Contact Book",
    advanced: {
      checkTransaction: "Check transaction",
      prove: "Prove",
      signAndVerify: "Sign / Verify",
      proofsHowTitle: "How proofs work",
      proofsHint: "Advanced",
      proofProveHint: "Generate a proof that you sent or received a payment.",
      proofCheckHint: "Verify a proof someone shared with you.",
      proofSignHint: "Sign a message with your address, or verify a signature.",
      proofsNote:
        "Proofs never reveal your private keys. Only share them with the person who asked.",
      sign: "Sign",
      verify: "Verify"
    },
    availableForContribution: "Master nodes available for contribution",
    changePassword: "Change Password",
    configure: "Configuration Settings",
    currentlyStakedNodes: "Currently staked nodes",
    bnsRecordDetails: "BNS record details",
    bnsBchatRecords: "Bchat records",
    bnsBelnetRecords: "Belnet records",
    importFromFile: "Import from File",
    privateKeys: "Private keys",
    rescanWallet: "Rescan Wallet",
    restoreFromSeed: "Restore from Seed",
    bnsServices: "BNS Service",
    bnsNames: "BNS Names",
    masternode: "Masternode",
    bns: {
      purchase: "Buy BNS",
      myBns: "My BNS"
    },
    masterNode: {
      registration: "Register",
      staking: "Stake",
      myStakes: "My stakes"
    },

    masterNodeDetails: "Masternode Details",
    settings: {
      title: "Settings",
      tabs: {
        general: "General",
        language: "Language",
        peers: "Peers",
        about: "About"
      }
    },
    transactionDetails: "Transaction Details",
    details: "Details",
    transactions: "Transactions",
    activityLedger: "Activity Ledger",
    wallet: {
      createNew: "Create New Wallet",
      createdOrRestored: "Wallet created/restored",
      walletRestored: "Wallet Restored",
      walletCreated: "Wallet Created",
      walletImported: "Wallet Imported",
      importFromFile: "Import Wallet from File",
      useExistingWallet: "Use Existing Wallet",
      importFromLegacyGUI: "Import wallet from legacy GUI",
      importFromOldGUI: "Import wallet from old GUI",
      restoreFromSeed: "Restore wallet from seed",
      restoreViewOnly: "Restore view-only wallet"
    },
    chooseLanguage: "Choose Language",
    myWallet: "My wallet",
    yourWallets: "Your Wallets",
    selectWalletMode: "Select wallet mode",
    swap: {
      swap: "Swap",
      exchange: "Exchange",
      privacySwap: "Privacy Swap",
      privacySwapDescription:
        "Your swap will be secure with this privacy swap feature. Your identity won't be visible.",
      history: "History",
      unsupportedpair: "Unsupported exchange pair",
      minimumAmt: "Minimum amount is",
      maximumAmt: "Maximum amount is",
      transactionDetails: "Transaction details",
      youSend: "You send",
      youSent: "You sent",
      exchangeRate: "Exchange rate",
      fixedRate: "Fixed rate",
      ratesRefresh: "Rates refresh every 30 s",
      fixedRateUpdateSec: "The fixed rate is updated every 30 Seconds",
      serviceFee: "Service fee",
      fees: "Fees",
      allTheFees: "All fees inclueded in the rate",
      networkFee: "Network fee",
      youGet: "You Get",
      floatingExchangeRate: "Floating Exchange Rate",
      fixedExchangeRate: "Fixed Exchange Rate",
      stillProcessing:
        "Your previous transaction is still processing. You can create a new one in 15 minutes",
      minimumExchangeAmtAbove: "The minimum exchange amount is above",
      for: "for",
      maximumExchangeAmtUnder: "The maximum exchange amount is under",
      floatingRateDisc:
        "The floating rate can change at any point due to market conditions, so you might receive more or less crypto than expected.",
      fixedRateExactAmtDisc:
        "With the fixed rate, you will receive the exact amount of crypto you see on this screen.",
      walletAddress: "Wallet Address",
      myWalletRequire: "My wallet requires",
      agreeWith: "I agree with",
      termOfUse: "Terms of Use",
      and: "and",
      privacyPolicy: "Privacy Policy",
      checkout: "Checkout",
      blockchain: "Blockchain",
      exchangefee: "Exchange fee",
      exchangeFeeIncluded:
        " The exchange fee is already included in the displayed amount you’ll get",
      networkFeeIncluded:
        "The network fee is already included in the displayed amount you’ll get",
      guaranteeFee: "Guarantee Rate",
      refundAddress: "Refund address",
      exchanging: "Exchanging",
      confirmingProcess: "Confirming in progress",
      confirmingDeposit: "Confirming deposit",
      inProgress: "In progress",
      Once: "Once",
      confirmedInBlockchain:
        " is confirmed in the blockchain, we’ll start exchanging it to",
      seenInputExplorer: "See input hash in explorer",
      to: "to",
      pleaseWait: "The process will take a few minutes. please wait.",
      sendFundsToWallet: "Sending funds to your wallet",
      waitHere: "You don’t have to wait here",
      waitHereDesc:
        "You can start a new transaction and check the status of this one any time in",
      newTransaction: "You can initiate a new transaction.",
      checkStatus:
        "You can always check the status of this transaction in transaction",
      transactionID: "Transaction ID",
      changellyAddress: "Exchange address",
      completed: "Completed",
      amountTo: "Amount to",
      amountReceived: "Amount received",
      amountSend: "Amount Sent",
      inputHash: "Input Hash",
      outputHash: "Output Hash",
      amountFrom: "Amount from",
      paymentNotReceived:
        "The funds were not received within 3 hours. Please check the rates and create a new transaction",
      downloadCsv: "Download CSV",
      status: "Status",
      date: "Date",
      exchangeAmount: "Exchange amount",
      receiver: "Receiver",
      confirmations: "Confirmations",
      sendFundDisc: "Send funds to the address below",
      depositAddress: "Deposit address",
      swapHistory: "Swap history",
      swaps: "swaps",
      noSwapsYet: "No swaps yet",
      noSwapsYetDisc:
        "Exchange BDX with 100+ coins. Every swap you make will be listed here with its live status.",
      newExchange: "New exchange",
      statusPending: "Pending",
      statusCompleted: "Completed",
      statusWaiting: "Waiting",
      statusRefund: "Refund",
      statusFailed: "Failed",
      statusExpired: "Expired",
      swapStatus: "Swap status",
      depositWindowExpired: "Deposit window expired after 3 hours",
      reviewBeforePaying: "Review before paying",
      estimate: "Estimate",
      transactionPreview: "Transaction preview",
      waitingDeposit: "Waiting for your deposit",
      timeLeft: "Time left to send",
      guaranteedRateDisc: "The guaranteed rate has been terminated",
      sendFundsAboveAddress:
        "Please note that you can send funds to the address above only",
      once: "once",
      swapMaintenance: "BDX Swap is temporarily under maintenance",
      tryAgainSomeTimes:
        "Please try again after some time. Your funds and open swaps are not affected.",
      afterYourFirstTxn: "After your first transaction",
      youWillBeViewHere: "you will be able to view it here",
      openHistory: "Open History",
      newTransactionBtn: "New Transaction",
      exchangePair: "Exchange Pair",
      exchangePairDisc: "Set the preferred exchange pair",
      walletAddressDisc: "Fill in the crypto wallet address details",
      payment: "Payment",
      paymentDisc: "Deposit the amount required for the exchange",
      exchangeDisc: "Wait for your transaction to be completed",
      paymentConfirm: "Confirm & Make payment",
      minimumAmtChanged: "Minimum amount value is changed, the new value is ",
      maximumAmtChanged: "Maximum amount value is changed, the new value is ",
      network: "NETWORK",
      giveCorrectAddress:
        "Please make sure to enter the correct address for the selected chain. Otherwise you will lose your funds.",
      swapType: "Swap Type"
    }
  }
};
