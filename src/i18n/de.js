export default {
  buttons: {
    // All button text is uppercased in the gui
    advanced: "Fortschrittlich",
    new: "Neu",
    addAddressBook: "Zum Adressbuch hinzufügen",
    addWallet: "Wallet hinzufügen",
    all: "Alle",
    back: "Zurück",
    browse: "Durchsuchen",
    cancel: "Stornieren",
    change: "Ändern",
    changePassword: "Passwort ändern",
    check: "Überprüfen",
    clear: "klar",
    clearAll: "Alles löschen",
    close: "Schließen",
    ok: "OK",
    prev: "Zurück",
    importWalletAction: "Wallet importieren",
    restoreViewOnlyWallet: "Nur-Lese-Wallet wiederherstellen",
    contacts: "Kontakte",
    copy: "Kopieren",
    copyJson: "JSON kopieren",
    copyAddress: "Adresse kopieren",
    openInWallet: "In Wallet öffnen",
    copyData: "Daten kopieren",
    copySignature: "Unterschrift kopieren",
    createWallet: "Wallet erstellen",
    decrypt: "Entschlüsseln",
    addRecord: "BNS hinzufügen",
    delete: "Löschen",
    done: "Fertig",
    edit: "Bearbeiten",
    editNotes: "Notizen bearbeiten",
    enter: "eingeben",
    export: "Export",
    fromBlockheight: "Von Blockhöhe",
    generate: "Generieren",
    import: "Import",
    importWallet: "WALLET IMPORTIEREN | WALLETS IMPORTIEREN",
    bns: "BELDEX Namensdienst",
    min: "Mindest",
    max: "Max",
    paste: "Einfügen",
    next: "Nächste",
    openWallet: "WALLET ÖFFNEN",
    purchase: "Kaufen",
    receive: "Erhalten",
    registerMasterNode: "MASTER NODE REGISTRIEREN",
    renew: "Erneuern",
    rescan: "Erneut scannen",
    restoreWallet: "Wallet wiederherstellen",
    refresh: "Aktualisierung",
    save: "Speichern",
    saveTxNotes: "Notizen speichern",
    selectLocation: "Standort",
    selectWalletFile: "Wählen Sie Datei",
    send: "Schicken",
    sendCoins: "Senden Sie Münzen",
    masterNode: "Masterknoten",
    settings: "Einstellungen",
    showQRCode: "QR-Code anzeigen",
    showTxDetails: "TXN-Details",
    sign: "Zeichen",
    stake: "Einsatz",
    sweepAll: "Alles fegen",
    unlock: "Entsperren",
    update: "Aktualisieren",
    verify: "Verifizieren",
    viewOnExplorer: "Im Explorer anzeigen",
    copyId: "ID kopieren",
    copiedId: "ID kopiert",
    saveContact: "Kontakt speichern",
    add: "Hinzufügen",
    bnsUpdate: "BNS-Update",
    bnsRenew: "BNS erneuern",
    goToStake: "Zum Staking gehen",
    clearForm: "Alles löschen",
    authorizeTransfer: "Überweisung autorisieren",
    startOver: "Neu starten",
    generateProof: "Nachweis generieren"
  },
  dialog: {
    // Generic buttons
    buttons: {
      ok: "OK",
      cancel: "Stornieren",
      open: "Offen"
    },
    // Dialogs
    banPeer: {
      title: "Peer blockieren",
      peerDetailsTitle: "Peer Details",
      message:
        "Dauer der Blockierung des Peers eingeben.\nStandard 3600 = 1 Stunde.",
      ok: "Peer blockieren",
      description:
        "Geben Sie die Dauer der Sperrung des Peers in Sekunden ein.\nStandard 3600 = 1 Stunde (86400 = 24 Stunden)",
      targetIp: "Ziel-IP:",
      lengthPlaceholder: "Dauer eingeben",
      minimum: "Minimum: 60s",
      invalid: "Geben Sie mindestens 60 Sekunden ein.",
      banAction: "Peer sperren"
    },
    copyAddress: {
      title: "Adresse kopieren",
      message:
        "Es is eine Payment ID mit dieser Adresse verbunden.\n Bitte die Paymend ID separat kopieren"
    },
    copyPrivateKeys: {
      // Copy {seedWords/viewKey/spendKey}
      title: "Kopieren {type}",
      message:
        "Sei vorsichtig, wem du deine Private Keys sendest, denn derjenige erhält dadurch die Kontrolle über deine Einlagen",
      seedWords: "Seed Wörter",
      viewKey: "Schlüssel anzeigen",
      spendKey: "Schlüssel ausgeben"
    },
    confirmPurchase: {
      title: "Bestätigen Sie den Kauf",
      message: "Überprüfen Sie den BNS-Eintrag vor der Zahlung.",
      ok: "Bestätigen"
    },
    deleteAddress: {
      title: "Adresse löschen",
      message: "Möchten Sie diese Adresse wirklich löschen?",
      heading: "Kontakt löschen",
      question:
        "Sind Sie sicher, dass Sie {name} aus Ihren Kontakten löschen möchten?"
    },
    discardEdit: {
      title: "Bist du sicher?",
      message: "Möchten Sie die Bearbeitung wirklich verwerfen?",
      ok: "Weitermachen",
      cancel: "Verwerfen",
      heading: "Änderungen verwerfen?",
      question: "Sie haben ungespeicherte Änderungen an diesem Kontakt.",
      keepEditing: "Weiter bearbeiten"
    },
    showMasterNode: {
      title: "Masterknoten anzeigen",
      message: "Möchten Sie fortfahren?",
      masterNode: "Masterknoten"
    },
    deleteWallet: {
      title: "Wallet löschen",
      message: "Sind Sie sicher, dass Sie das aktuelle Wallet löschen möchten?",
      ok: "Löschen",
      heading: "Wallet löschen",
      warning:
        "Dadurch werden die Wallet-Dateien von diesem Computer entfernt. Sie können sie nur mit Ihrem Recovery Seed wiederherstellen.",
      confirm: "Wallet löschen"
    },
    exit: {
      title: "Beenden",
      message: "Sind Sie sicher, dass Sie das Wallet verlassen möchten?",
      ok: "Beenden",
      heading: "Wallet beenden",
      question: "Sind Sie sicher, dass Sie das Wallet beenden möchten?",
      confirm: "Beenden"
    },
    keyImages: {
      title: "Schlüsselbilder {type}",
      subtitle:
        "Schlüsselbilder für eine Nur-Lese-Wallet exportieren oder wieder importieren.",
      message: "Möchtest du key images {type}",
      export: "Exportieren",
      exportHint: "Schlüsselbilder in eine Datei schreiben",
      import: "Importieren",
      importHint: "Schlüsselbilder aus einer Datei laden"
    },
    bnsUpdate: {
      title: "BNS-Eintrag aktualisieren",
      message: "Möchten Sie den BNS-Datensatz aktualisieren?",
      ok: "Aktualisieren"
    },
    noPassword: {
      title: "Kein Passwort angelegt",
      message:
        "Bist du sicher, dass du eine Wallet ohne Passwort erstellen möchtest?",
      ok: "JA"
    },
    password: {
      title: "Geben Sie Ihr Wallet-Passwort ein",
      message: "Wallet Passwort eingeben um fortzufahren",
      heading: "Wallet-Passwort eingeben",
      subtitle: "Geben Sie Ihr Wallet-Passwort ein, um fortzufahren.",
      unlocking: "Entsperren · {name}",
      placeholder: "Passwort eingeben",
      hint:
        "Klicken Sie einfach auf „Entsperren“, wenn Sie kein Passwort für dieses Wallet festgelegt haben.",
      unlock: "Entsperren",
      showPassword: "Passwort anzeigen",
      hidePassword: "Passwort verbergen"
    },
    purchase: {
      title: "Kaufname",
      message: "Möchten Sie den Namen kaufen?",
      ok: "Kaufen"
    },
    renew: {
      title: "Namen erneuern",
      message: "Möchten Sie den Namen erneuern?",
      ok: "Erneuern"
    },
    registerMasterNode: {
      title: "Master Node registrieren",
      message: "Möchtest du einen Master Node registrieren?",
      ok: "Registrieren "
    },
    rescan: {
      title: "Wallet erneut scannen",
      message:
        "Warnung: Einige Informationen über vorherige Transaktionen\nsowie Adressen von Empfängern gehen verloren",
      ok: "Erneut scannen"
    },
    restart: {
      title: "Erneut starten",
      message:
        "Änderungen erfordern einen Neustart. Möchtest du jetzt neu starten?",
      ok: "Starten Sie Wallet neu",
      heading: "Wallet neu starten",
      confirm: "Neu starten"
    },
    showPrivateKeys: {
      title: "Private Keys Anzeigen",
      message: "Möchtest du deinen Private Key anzeigen?",
      ok: "Zeigen",
      subtitle:
        "Geben Sie Ihr Wallet-Passwort ein, um die Schlüssel preiszugeben."
    },
    stake: {
      title: "Einsatz",
      message: "Möchtest du staken?",
      ok: "Einsatz"
    },
    sweepAll: {
      title: "Alles fegen",
      message: "Möchtest du alles bereinigen?",
      ok: "Alles fegen"
    },
    sweepAllWarning: {
      title: "Alle Warnungen durchwischen",
      message:
        "You are about to combine all of your unspent funds by sending a transaction to yourself, your wallet may show a balance of 0 temporarily, after 10 blocks your funds will unlock and you may stake normally.",
      ok: "Weitermachen"
    },
    switchWallet: {
      title: "Wallet wechseln",
      closeMessage:
        "Bist du sicher, dass du die aktuelle Wallet schliessen möchtest?",
      restartWalletMessage:
        "Sind Sie sicher, dass Sie das Wallet schließen und neu starten möchten?",
      restartMessage:
        "Die Wallet RPC synchronisiert sich gerade\n Wenn du deine Wallet wechseln möchtest, musst du die Anwendung erneut starten. \n Die Synchronisation wird abgebrochen und du musst die Blockchain erneut scannen. "
    },
    transactionDetails: {
      title: "Transaktionsdetails",
      subtitle: "Vom Wallet zurückgegebene Rohdaten",
      ok: "Schließen"
    },
    transfer: {
      title: "Transferieren",
      message: "Möchtest du die Transaktion senden?",
      ok: "Schicken"
    },
    confirmTransaction: {
      title: "Bestätigen Sie das Senden",
      subtitle: "Überprüfen Sie die Überweisung, bevor sie übertragen wird.",
      sendTo: "Senden an",
      priority: "Priorität"
    },
    confirmUpdate: {
      title: "Update bestätigen",
      ok: "Aktualisieren"
    },
    confirmRenew: {
      title: "Erneuerung bestätigen",
      ok: "Erneuern"
    },
    unlockConfirm: {
      title: "Unlock bestätigen",
      ok: "Entsperren"
    },
    unlockMasterNode: {
      title: "Master-Knoten entsperren",
      confirmTitle: "Unlock bestätigen",
      message: "Möchtest du den Master Node „unlocken“?",
      ok: "Entsperren"
    },
    unlockMasterNodeWarning: {
      title: "Warnung zum Entsperren des Masterknotens",
      message:
        "Wenn Sie einen Teilanteil an einem Knoten freigeben, wird dieser auch für alle anderen Teilnehmer freigegeben. Wenn Sie an einem gemeinsam genutzten Knoten teilnehmen, ist es am besten, den Betreiber und die anderen Teilnehmer darüber zu informieren, dass Sie Ihren Anteil freigeben.",
      ok: "Weitermachen"
    },
    signature: {
      title: "Signatur",
      message:
        "Kopieren Sie unten die Daten, die mit dem privaten Schlüssel Ihrer primären Adresse signiert wurden"
    }
  },
  fieldLabels: {
    // Field labels are also all uppercased
    address: "Adresse",
    recipientAddress: "Empfängeradresse",
    amount: "Menge",
    bchatIdTitle: "BChat-ID",
    ethAddress: "ETH-Adresse",
    daemon: "Daemon:",
    refundWalletAddress: "Rückerstattungs-Wallet-Adresse",
    fullWallet: "Vollständiges Wallet",
    liteWallet: "LITE-Wallet",
    passwordLabel: "Passwort",
    confirmPasswordLabel: "Passwort bestätigen",
    belnetId: "Belnet-ID",
    eth: "ETH",
    backupOwner: "Backup-Besitzer",
    confirmPassword: "Passwort bestätigen (optional)",
    chooseNetwork: "Wählen Sie ein Netzwerk",
    daemonLogLevel: "Daemon-Protokollebene",
    daemonP2pPort: "Daemon P2P-Port",
    dataStoragePath: "Datenspeicher",
    decryptRecord: "Datensatz hinzufügen",
    expirationHeight: "Ablaufhöhe",
    data: "Daten",
    filter: "Filter",
    startDate: "Startdatum",
    endDate: "Enddatum",
    filterTransactionType: "FILTERN NACH TRANSAKTIONSTYP",
    transactionType: "Transaktionstyp",
    internalWalletPort: "Interner Wallet-Port",
    keyImages: {
      exportDirectory: "Schlüsselbild-Exportverzeichnis",
      importFile: "Schlüsselbild-Importdatei"
    },
    limitDownloadRate: "Begrenzen Sie die Download-Rate",
    limitUploadRate: "Begrenzen Sie die Upload-Rate",
    bnsType: "BNS RECORD TYPE",
    localDaemonIP: "Lokale Daemon-IP",
    localDaemonPort: "Lokaler Daemon-Port",
    belnetFullAddress: "BELNET VOLLSTÄNDIGE ADRESSE",
    maxIncomingPeers: "Maximale Anzahl eingehender Peers",
    maxOutgoingPeers: "Maximale Anzahl ausgehender Kollegen",
    message: "Nachricht",
    mnemonicSeed: "Erholungssamen",
    name: "Name",
    nameHash: "Namens-Hash",
    newWalletName: "Wallet-Name",
    network: "Netzwerk",
    notes: "Notizen",
    addressBookNotes: "Adressbuchnotizen",
    optional: "optional",
    owner: "Eigentümer",
    password: "Passwort (optional)",
    paymentId: "ZAHLUNGS-ID",
    priority: "PRIORITÄT",
    remoteNodeHost: "Remote-Knoten-Host",
    remoteNodePort: "Remote-Knoten-Port",
    restoreFromBlockHeight: "Wiederherstellen ab Blockhöhe",
    restoreFromDate: "Von Datum wiederherstellen",
    seedLanguage: "Samensprache",
    totalBalance: "Gesamtsaldo",
    to: "Zu",
    masterNodeCommand: "Master-Knoten-Befehl",
    masterNodeKey: "Master-Knotenschlüssel",
    bchatId: "BCHAT-ID",
    signature: "Unterschrift",
    transactionId: "Transaktions-ID",
    walletFile: "Wallet-Datei",
    walletLogLevel: "Wallet-Protokollebene",
    walletName: "Wallet-Name",
    walletRPCPort: "Wallet-RPC-Port",
    walletStoragePath: "Wallet-Speicher",
    // These are specific labels which do not get uppercased
    confirmNewPassword: "Neues Passwort bestätigen",
    newPassword: "Neues Passwort",
    oldPassword: "Altes Passwort",
    rescanFullBlockchain: "Gesamte Blockchain erneut scannen",
    rescanSpentOutputs: "Spent Outputs erneut scannen",
    transactionNotes: "Transaktionsnotizen",

    // wallet UI

    OwnerWalletaddress: " Besitzer-Wallet-Adresse",
    backupOwnerWalletAddress: "Wallet-Adresse des Backup-Eigentümers",
    updateOwner: "Besitzer aktualisieren",
    updateValues: "Werte aktualisieren",
    updateHeight: "Aktualisierungs-Höhe",
    walletAddress: "Wallet-Adresse",
    privateViewkey: "Privater View-Key",
    privateSpendkey: "Privater Spend-Key",
    year: "Jahr",
    values: "Werte",
    recipientAddressBns: "Empfängeradresse / BNS-Name"
  },
  footer: {
    ready: "Synchronisiert",
    remote: "Fernbedienung",
    scanning: "Scannen",
    status: "Status",
    syncing: "Synchronisierung",
    wallet: "Wallet",
    updateRequired: "AKTUALISIERUNG ERFORDERLICH"
  },
  menuItems: {
    about: "Über ",
    changePassword: "Passwort ändern",
    copyAddress: "Adresse kopieren",
    copySeed: "Samen kopieren",
    copyBackupOwner: "Backup-Besitzer kopieren",
    copyBelnetAddress: "Belnet-Adresse kopieren",
    copyBelnetName: "Belnet-Namen kopieren",
    copyName: "Namen kopieren",
    copyWalletName: "Wallet-Namen kopieren",
    copyOwner: "Eigentümer kopieren",
    copyQR: "QR Code kopieren",
    copySeedWords: "Seed Wörter kopieren",
    copySpendKey: "Spend Key kopieren",
    copyMasterNodeKey: "Copy master node key",
    copyTransactionId: "Transaktions ID kopieren",
    copyViewKey: "View Key kopieren",
    createNewWallet: "Neue Wallet erstellen",
    deleteContact: "Kontakt löschen",
    deleteWallet: "Wallet löschen",
    exit: "Wallet verlassen",
    importOldGUIWallet: "Wallets von alter GUI importieren",
    manageKeyImages: "Key Images verwalten",
    openWallet: "Wallet öffnen",
    rescanWallet: "Wallet erneut scannen",
    restoreWalletFile: "Wallet aus Datei wiederherstellen",
    restoreWalletSeed: "Wallet aus Seed wiederherstellen ",
    saveQR: "QR in Datei speichern",
    sendToThisAddress: "Zu dieser Adresse senden",
    settings: "Einstellungen",
    showDetails: "Details anzeigen",
    showPrivateKeys: "Zeige Private Keys",
    showQRCode: "Zeige QR Code",
    switchWallet: "Wallet wechseln",
    viewOnExplorer: "Zeige in Explorer",
    favourite: "Favorit",
    walletMenuTitle: "Wallet",
    copyBchatId: "bchat ID kopieren"
  },
  notification: {
    positive: {
      addressCopied: "Adresse in die Zwischenablage kopiert",
      subaddressCreated: "Unteradresse erstellt",
      paymentReceived: "Zahlung erhalten",
      linkCopied: "Link in die Zwischenablage kopiert",
      backupOwnerCopied: "Backup-Besitzer in die Zwischenablage kopiert",
      bannedPeer: "Blockiert {host} bis {time}",
      copied: "{item} in Zwischenablage kopiert",
      inputHashCopied: "Eingabe-Hash wurde kopiert!",
      outputHashCopied: "Ausgabe-Hash wurde kopiert!",
      transactionIdCopied: "Transaktions-ID wurde kopiert!",
      recipientAddressCopied: "Empfängeradresse wurde kopiert!",
      refundAddressCopied: "Rückerstattungsadresse wurde kopiert!",
      decryptedBNSRecord: "BNS-Datensatz erfolgreich entschlüsselt für {name}",
      itemSaved: "{item} gespeichert nach {filename}",
      keyImages: {
        exported: "Key images exportiert nach {filename}",
        imported: "Key images importiert"
      },
      bnsRecordUpdated: "Der BNS-Datensatz wurde erfolgreich aktualisiert",
      belnetAddressCopied: "Vollständige Belnet-Adresse kopiert",
      belnetNameCopied: "Belnet-Name kopiert",
      passwordUpdated: "Passwort aktualisiert",
      namePurchased: "Name erfolgreich gekauft",
      nameRenewed: "Name erfolgreich erneuert",
      nameCopied: "Name in die Zwischenablage kopiert",
      ownerCopied: "Besitzer hat die Kopie in die Zwischenablage kopiert",
      qrCopied: "QR Code in die Zwischenablage kopiert",
      registerMasterNodeSuccess: "Master Node erfolgreich registriert ",
      sendSuccess: "Transaktion erfolgreich gesendet",
      masterNodeInfoFilled:
        "Master-Knotenschlüssel und Mindestbetrag ausgefüllt",
      bchatIdCopied: "Bchat-ID in die Zwischenablage kopiert",
      signatureCopied: "Unterschrift in die Zwischenablage kopiert",
      signatureVerified: "Unterschrift überprüft",
      stakeSuccess: "Staking erfolgreich",
      transactionNotesSaved: "Notizen zur Transaktion gesichert"
    },
    errors: {
      banningPeer: "Fehler bei der Blockierung des Peer",
      subaddressCreateFailed: "Unteradresse konnte nicht erstellt werden",
      fillInputs: "Bitte füllen Sie alle Eingabefelder aus.",
      addressAlreadyExists: "Adresse existiert bereits!",
      pleaseEnterName: "Bitte geben Sie den Namen ein",
      cannotAccessRemoteNode:
        "Remote Node nicht erreichbar, bitte versuche es mit einer anderen Remote Node",
      changingPassword: "Fehler beim Ändern des Passworts",
      copyWalletFail: "Fehler beim Kopieren der Wallet",
      copyingPrivateKeys: "Fehler beim Kopieren der Private Keys",
      dataPathNotFound: "Pfad zur Speicherung nicht gefunden",
      dataPathCreateFailed: "Speicherpfad konnte nicht erstellt werden",
      differentNetType: "Remote Node benutzt einen anderen „nettype“",
      enterSeedWords: "Seed Wörter eingeben",
      enterTransactionId: "Enter transaction ID",
      enterTransactionProof: "Enter transaction proof",
      enterWalletName: "Wallet Namen eingeben",
      enterName: "Geben Sie einen Namen ein",
      enterNameCorrectly: "Bitte geben Sie den Namen korrekt ein.",
      invalidBchatIdInput: "Ungültige BChat-ID",
      errorSavingItem: "Fehler beim Speichern {item}",
      failedMasterNodeUnlock: "Fehler beim Master Node unlock",
      failedToSetLanguage: "Fehler bei der Auswahl der Sprache: {lang}",
      failedWalletImport: "Fehler beim Importieren der Wallet",
      failedWalletOpen:
        "Fehler beim Öffnen der Wallet. Bitte versuche es erneut",
      failedWalletRead: "Fehler beim Lesen der Wallets",
      failedWalletRestore: "Fehler beim Wiederherstellen der Wallet",
      failedWalletCreation:
        "Fehler beim Erstellen der Wallet. Bitte versuche es erneut.",
      internalError: "Interner Fehler",
      invalidAddress: "Adresse nicht gültig",
      contactsWaitForSync:
        "Kontakte können gespeichert werden, sobald die Synchronisierung des Wallets abgeschlossen ist.",
      invalidAmount: "Betrag nicht gültig",
      invalidBackupOwner: "Die Adresse des Backup-Besitzers ist ungültig",
      invalidNameLength: "Ungültige Namenslänge",
      invalidNameFormat: "Name may only contain alphanumerics and hyphens",
      invalidNameHypenNotAllowed:
        "Der Name darf nur mit alphanumerischen Zeichen oder einem Unterstrich beginnen oder enden",
      invalidOldPassword: "Ungültiges altes Passwort",
      invalidOwner: "Eigentümeradresse ungültig",
      invalidPassword: "Ungültiges Passwort",
      invalidPaymentId: "Payment ID nicht gültig",
      invalidPrivateViewKey: "Ungültiger Private View Key",
      invalidPublicAddress: "Ungültige öffentliche Adresse",
      invalidRestoreDate: "Ungültiges Wiederherstellungsdatum",
      invalidRestoreHeight: "Ungültige Wiederherstellungshöhe",
      invalidSeedLength: "Ungültige Seed Wortlänge",
      invalidMasterNodeCommand:
        "Bitte füge den Master Node Registrierungsbefehl ein",
      invalidMasterNodeKey: "Master Node Key nicht gültig",
      invalidBchatId: "Bchat-ID ungültig",
      invalidBelnetId: "Ungültige Belnet-ID",
      invalidEthAddress: "Ungültige Ethereum-Adresse",
      enterValidAddress: "Bitte geben Sie eine gültige Adresse ein",
      invalidSignature: "Ungültige Signatur",
      invalidWalletPath: "Ungültiger Wallet Pfad",
      keyImages: {
        exporting: "Fehler beim Export der Key images",
        reading: "Fehler beim lesen der Key images",
        importing: "Fehler beim Import der Key Images",
        notSyncedFarEnough:
          "Diese Wallet ist noch nicht weit genug synchronisiert, um mit den exportierten Key Images übereinzustimmen. Warten Sie, bis die Synchronisierung abgeschlossen ist, und versuchen Sie den Import erneut."
      },
      negativeAmount: "Betrag kann nicht negativ sein ",
      newPasswordNoMatch: "Neue Passwörter stimmen nicht überein",
      newPasswordSame:
        "Das alte Passwort kann nicht verwendet werden. Legen Sie ein anderes Passwort fest",
      passwordFieldEmpty: "Bitte geben Sie Ihr Passwort ein",
      notEnoughBalance: "Nicht genug frei verfügbares Guthaben",
      passwordNoMatch: "Passwörter stimmen nicht überein",
      remoteCannotBeReached: "Remote daemon ist nicht erreichbar",
      selectWalletFile: "Select a wallet file",
      unknownError: "Ein unbekannter Fehler ist aufgetreten ",
      walletAlreadyExists: "Wallet mit diesem Namen existiert bereits",
      walletPathNotFound: "Wallet Daten Pfad nicht gefunden",
      walletPathCreateFailed: "Wallet-Datenpfad konnte nicht erstellt werden",
      zeroAmount: "Betrag muss grösser als null sein",
      greaterHeight:
        "Der eingegebene Wert ist größer als die aktuelle Blockhöhe",
      decryptBNSRecord:
        "Der angegebene BNS-Eintrag existiert nicht oder gehört nicht zu diesem Wallet"
    },
    warnings: {
      retryingBackend:
        "Erneuter Versuch, eine Verbindung zum Backend herzustellen...",
      privateKeysAfterSync:
        "Private Keys können angezeigt werden, sobald die Wallet synchronisiert ist.",
      noKeyImageExport: "Keine Key Images zum Exportieren gefunden",
      usingLocalNode:
        "Zugang zur Remote Node nicht möglich, wechsle zur lokalen Node",
      localNodeFailedUsingRemote:
        "Lokale Node konnte nicht gestartet werden, benutze eine Remote Node",
      usingRemoteNode: "lbeldexd nicht gefunden, benutze eine Remote Node",
      retryingRemoteNode:
        "Versuche weiterhin, den Remote-Node zu erreichen (Versuch {attempt} von {total})..."
    }
  },
  placeholders: {
    additionalNotes: "Zusätzliche Notizen",
    addNotesOptional: "Notizen hinzufügen (optional)",
    addPrivateNote: "Private Notiz hinzufügen - Nur Sie können sie sehen",
    addressBookName: "Zugehörige Namen zu dieser Adresse",
    addressOfSigner: "Öffentliche Wallet-Adresse des Unterzeichners",
    beldexAddress: "Adresse oder BNS-Namen eingeben",
    dataToSign:
      "Daten, die Sie mit dem privaten Schlüssel Ihrer primären Adresse signieren möchten",
    filterTx:
      "Geben Sie eine ID, einen Namen, eine Adresse oder einen Betrag ein",
    hexCharacters: "{count} Hexadezimal Zeichen",
    bnsName: "Der Name, der über den Beldex Namensservice erworben werden soll",
    bnsOwner: "Die Wallet-Adresse des Besitzers",
    bnsBackupOwner: "Die Wallet-Adresse des Backup-Inhabers",
    bnsDecryptName: "Ein BNS-Name, der Ihnen gehört",
    belnetFullAddress:
      "Vollständige Belnet-Adresse zur Zuordnung des BNS-Namens (ohne .bdx)",
    enterName: "Name eingeben",
    enterRecipientAddress: "Geben Sie Ihre {coin}-Empfängeradresse ein",
    enterAddress: "Adresse eingeben",
    enteroldPassword: "Geben Sie das alte Passwort ein",
    enterNewPassword: "Neues Passwort eingeben",
    createWalletPassword: "Neues Passwort eingeben",
    reEnterPassword: "Kennwort erneut eingeben",
    mnemonicSeed: "25 (oder 24) mnemonic Seed Wörter",
    restoreSeed: "Geben Sie Ihre 25-Wörter-Wiederherstellungsphrase ein",
    pasteTransactionId: "Transaktions-ID einfügen",
    pasteTransactionProof: "Transaktionsnachweis einfügen",
    proveOptionalMessage:
      "Optionale Nachricht, gegen die die Signatur signiert wird",
    recipientWalletAddress: "Wallet-Adresse des Empfängers",
    selectAFile: "Bitte Datei auswählen",
    bchatId: "Die Bchat-ID zur Verknüpfung mit dem Beldex-Namensdienst",
    signature: "Unterschrift zur Überprüfung",
    unsignedData: "Die Daten, wie sie vor dem Signieren aussehen sollten",
    transactionNotes:
      "Zusätzliche Notizen die an die Transaktions gehängt werden sollen",
    walletName: "Ein Name für deine Wallet",
    hexKey: "64-stelliger Hex-Schlüssel",
    walletPassword: "Ein optionales Passwort für die Wallet",
    reEnterWalletPassword: "Kennwort erneut eingeben",
    enterEthAddress: "Geben Sie Ihre ETH-Adresse ein",
    enterBelnetId: "Geben Sie Ihre Belnet-ID ein",
    enterBchatId: "Gib deine BChat-ID ein",
    enterWalletAddress: "Geben Sie Ihre Wallet-Adresse ein",
    pasteSignature: "Signatur einfügen",
    searchCoins: "Coins suchen",
    signerAddress: "Adresse des Unterzeichners",
    dataThatWasSigned: "Signierte Daten",
    searchContacts: "Kontakte suchen",
    bnsOwnerShort: "Wallet-Adresse des Besitzers",
    bnsBackupOwnerShort: "Backup-Besitzeradresse",
    bnsValueBchat: "BChat-ID-Wert eingeben",
    bnsValueBelnet: "Belnet-ID-Wert eingeben",
    bnsValueAddress: "Adresswert eingeben",
    bnsValueEth: "ETH-Wert eingeben"
  },
  strings: {
    transactionNotesHint:
      "Die Notizen werden gespeichert, um Details zur Transaktion festzuhalten. Du kannst sie ändern, indem du auf „Notizen bearbeiten“ klickst.",
    durationYear: "{count} Jahr",
    durationYears: "{count} Jahre",
    changePasswordHint:
      "Verwenden Sie mindestens 8 Zeichen. Sie benötigen dieses Passwort, um das Wallet zu öffnen.",
    contactAdded: "hinzugefügt {date}",
    addAddressBookEntry: "Adressbuch Eintrag hinzufügen",
    addContact: "Kontakt hinzufügen",
    contactsStoredNote:
      "Kontakte werden nur auf diesem Gerät in Ihrer verschlüsselten Wallet-Datei gespeichert.",
    addressBookDetails: "Adressbuch details",
    addressBookIsEmpty: "Adressbuch ist leer",
    addresses: {
      myPrimaryAddress: "Meine primäre Adresse",
      myUnusedAddresses: "Meine ungenutzten Adressen",
      myUsedAddresses: "Meine benutzen Adressen",
      primaryAddress: "Primäre Adresse",
      // primaryAddress: "Primäre Adresse",
      subAddress: "Sub-Adresse",
      subAddressIndex: "Index {index}",
      primaryAccount: "Hauptkonto",
      shareToReceive: "Teilen Sie diese Adresse, um BDX zu empfangen"
    },
    advancedOptions: "Erweiterte Optionen",
    awaitingConfirmation: "Warten auf Bestätigung",
    bannedPeers: {
      title:
        "Blockierte Peers (Blockierungen werden entfernt, wenn Wallet neu gestartet wird)",
      bannedUntil: "Blockieren bis {time}"
    },
    blockHeight: "Höhe",
    height: "Höhe",
    cannotSign:
      "Mit einer Wallet, die nur zum Anzeigen verwendet wird, können Sie nicht signieren",
    checkTransaction: {
      description:
        "Überprüfen Sie, ob die Gelder an eine Adresse gezahlt wurden, indem Sie die Transaktions-ID, die Empfängeradresse, die zum Signieren verwendete Nachricht und die Signatur angeben.\nFür einen ‚Ausgabennachweis‘ müssen Sie die Empfängeradresse nicht angeben.",
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
    closing: "schliessen",
    connectingToBackend: "Verbinden zum Backend",
    contribution: "Beitrag",
    contributor: "Mitwirkender",
    daemon: {
      local: {
        title: "Nur lokaler Daemon",
        description:
          "Volle Sicherheit. Wallet wird die gesamte Blockchain herunterladen. Du kannst keine Transaktionen durchführen, solange die Synchronisation nicht vollständig beendet wurde"
      },
      localRemote: {
        title: "Lokal + Remote Daemon",
        description:
          "Schnell starten mit dieser Standard Option. Wallet wird die Blockchain vollständig herunterladen, aber während der Synchronisation eine Remote Node nutzen"
      },
      remote: {
        title: "Nur Remote Node",
        description:
          "Etwas weniger sicher. Wallet verbindet sich mit einer Remote Node, um Transaktionen über diese durchzuführen"
      }
    },
    destinationUnknown: "Ziel unbekannt",
    editAddressBookEntry: "Adressbucheintrag bearbeiten",
    expirationHeight: "Ablaufhöhe",
    encryptedBchatValue: "Verschlüsselter Bchat-Wert",
    encryptedBelnetValue: "Verschlüsselter Belnet-Wert",
    encryptedWalletValue: "Verschlüsselter Wallet-Wert",
    encryptedEthAddrValue: "Verschlüsselte ETH-Adresse",
    bns: {
      noNamesYet: "Noch keine BNS-Namen vorhanden",
      noNamesHint:
        "Die Namen, die Sie mit diesem Wallet kaufen, werden hier angezeigt.",
      buyAName: "Namen kaufen",
      bchatID: "Bchat-ID",
      belnetName1Year: "Belnet Name 1 Jahr",
      belnetNameXYears: "Belnet Name {years} Jahre",
      prices: "Preise :",
      note: "Notiz",
      bnsRegistration: "BNS Name für die Registrierung",
      ownerNotes:
        "Verwenden Sie die aktuelle Adresse (lassen Sie das Feld leer, falls es sich um dieselbe Wallet handelt) oder geben Sie die Adresse an, falls es sich um eine andere Wallet handelt",
      ethNotes: "Unsere ETH-Adresse ist mit allen EVM-Chains kompatibel",
      records: "BNS-Aufzeichnungen",
      addRecord: "Datensatz hinzufügen",
      fetchNewRecord: "BNS-Datensatz wird aus dem Netzwerk abgerufen...",
      updateOwnerHint:
        "Den Namen an einen neuen Eigentümer oder Ersatzeigentümer übertragen",
      updateValuesHint: "Den BChat-, Belnet-, Adress- oder ETH-Wert ändern",
      duration: "Dauer"
    },
    bnsPurchaseDescription:
      "Kaufen oder aktualisieren Sie einen BNS-Datensatz. Wenn Sie einen Namen kaufen, kann es ein bis zwei Minuten dauern, bis er in der Liste erscheint.",
    bnsDescription:
      "Hier finden Sie alle BNS-Namen, die dieser Wallet zugeordnet sind. Durch Entschlüsseln eines Ihrer Datensätze werden Name und Wert dieses BNS-Datensatzes angezeigt.",
    bnsUpdateDescription:
      " Sie können nur die Besitzeradresse oder die Werte gleichzeitig aktualisieren. Wenn Sie beides aktualisieren möchten, können Sie entweder den Wert vor der Besitzübertragung oder nach der Übertragung des Besitzes aktualisieren.",
    loadingSettings: "Einstellungen werden geladen",
    oxenBalance: "Guthaben",
    belnetNameDescription:
      "Kaufen oder aktualisieren Sie einen Namen auf Belnet. Nach dem Kauf kann es ein bis zwei Minuten dauern, bis der Name in der Liste erscheint. Weitere Informationen zu Belnet finden Sie hier: ",
    oxenUnlockedBalance: "frei verfügbares Guthaben",
    oxenUnlockedShort: "frei verfügbar",
    me: "Mich",
    noTransactionsFound: "Keine Transaktionen gefunden",
    notes: "Notizen",
    numberOfUnspentOutputs: "Anzahl der unspent outputs",
    operator: "Operator",
    paymentID: "Zahlungs-ID",
    peerList: "Peer Liste",
    peersConnected: "{count} Verbunden",
    peerStateSynced: "Synced",
    peerStateSynchronizing: "Synchronizing",
    peerStateConnecting: "Connecting",
    priorityOptions: {
      automatic: "Automatisch",
      fast: "Schnell",
      fastest: "Am schnellsten",
      normal: "Normal",
      slow: "Langsam",
      flash: "blinken"
    },
    proveTransactionDescription:
      "Generieren Sie einen Zahlungsnachweis für Ihre eingehenden/ausgehenden Zahlungen, indem Sie die Transaktions-ID, die Empfängeradresse und optional eine Nachricht angeben. Bei ausgehenden Zahlungen erhalten Sie einen „Ausgabennachweis“, der die Autorisierung der Transaktion belegt. In diesem Fall ist die Angabe der Empfängeradresse nicht erforderlich.",
    readingWalletList: "Lese Wallet Liste",
    recentIncomingTransactionsToAddress:
      "Kürzlich eingegangene Transaktionen zu dieser Adresse",
    recentTransactionsWithAddress:
      "Kürzlich durchgeführte Transaktionen mit dieser Adresse",
    rescanModalDescription: "Auswahl gesamter Rescan oder nur spent outputs",
    saveSeedWarning:
      'Bitte kopiere und verwahre deinen "Seed" an einem sicheren Ort',
    saveToAddressBook: "In Adressbuch speichern",
    keysAvailableAfterSync:
      "Verfügbar, sobald die Wallet die Synchronisierung abgeschlossen hat.",
    seedWords: "Seed Wörter",
    walletCreated: "Wallet erstellt",
    selectLanguage: "Sprache auswählen",
    masterNodeContributionDescription:
      "Durch Staking wird die Sicherheit des Beldex-Netzwerks erhöht. Für Ihren Beitrag erhalten Sie BDX. Nach dem Staking müssen Sie je nach Art der Freigabe (durch einen anderen Teilnehmer oder durch die Abmeldung des Knotens) 15 oder 30 Tage warten, bis Ihre BDX freigegeben werden. Weitere Informationen zum Staking finden Sie in der Dokumentation auf der Beldex-Website",
    masterNodeRegistrationDescription:
      "Hier den {registerComand} Befehl, der mit Hilfe des Daemons durch das Kommando {prepareCommand} erzeugt wurde, eingeben, um eine Master Node zu aktivieren",
    masterNodeRegistrationNote:
      "Bei der Registrierung wird eine Staking-Transaktion von diesem Wallet gesendet. Stellen Sie sicher, dass der Befehl innerhalb der letzten 2 Wochen erstellt wurde.",
    masterNodeStartStakingDescription:
      "Um mit dem Staing zu beginnen, besuchen Sie bitte",
    masterNodeStartStakingDescription1: "Registerkarte -->",
    noMasterNodesCurrentlyAvailable:
      "Derzeit stehen keine Masternodes für Beiträge zur Verfügung.",
    masterNodeDetails: {
      contributors: "Mitwirkende",
      lastRewardBlockHeight: "Höhe des letzten Belohnungsblocks",
      lastUptimeProof: "Letzter Verfügbarkeitsnachweis",
      noUptimeProof: "Nie",
      maxContribution: "Maximaler Beitrag",
      minContribution: "Min. Beitrag",
      operatorFee: "Betreibergebühr",
      registrationHeight: "Registrierungshöhe",
      unlockHeight: "Höhe freischalten",
      reserved: "Reserviert",
      masterNodeKey: "Master-Knotenschlüssel",
      snKey: "MN-Schlüssel",
      stakingRequirement: "Absteckanforderung",
      totalContributed: "Insgesamt beigetragen"
    },
    signAndVerifyDescription:
      "Signieren Sie Daten mit dem privaten Schlüssel Ihrer primären Adresse oder überprüfen Sie eine Signatur anhand einer öffentlichen Adresse",
    spendKey: "Schlüssel ausgeben",
    spendKeyHint:
      "Wird der Ausgabenschlüssel nicht angegeben, wird die Wallet im Nur-Anzeige-Modus wiederhergestellt.",
    startingDaemon: "Daemon wird gestartet",
    startingWallet: "Wallet wird gestartet",
    switchToDateSelect: "Wechsel zur Selektion nach Datum",
    progress: {
      gettingTransactionInfo: "Transaktionsinformationen werden abgerufen",
      cancelTransactionFromConfirm:
        "Transaktion im Bestätigungsdialog abbrechen",
      sendingTransaction: "Transaktion wird gesendet",
      sendingRenewMapping:
        "Transaktion zur Verlängerung der Zuordnung wird gesendet",
      unlocking: "Wird entsperrt...",
      registering: "Registrierung läuft...",
      staking: "Staking läuft...",
      gettingSweepAllInfo:
        "Informationen zu allen Konsolidierungstransaktionen werden abgerufen",
      sweepingAll: "Alle Guthaben werden konsolidiert"
    },
    switchToHeightSelect: "Wechsel zu Selektion nach Höhe",
    syncingDaemon: "Synchronisierungsdaemon",
    transactionID: "Transaktions ID",
    transactionConfirmed: "Transaktion bestätigt",
    transactions: {
      amount: "Betrag",
      description: "{type} Transaktion",
      fee: "Gebühr",
      paidBySender: "Vom Absender bezahlt",
      received: "Empfangen",
      sent: "Gesendet",
      sentTo: "{type} Transaktion gesendet nach",
      timestamp: "Zeitstempel",
      date: "Datum",
      filterByDate: "Nach Datum filtern",
      clearDateRange: "Datumsfilter löschen",
      types: {
        all: "Alles",
        incoming: "Erhalten",
        outgoing: "Gesendet",
        pending: "Ausstehend",
        pendingIncoming: "Ausstehend eingehend",
        pendingOutgoing: "Ausstehend ausgehend",
        miner: "Bergmann",
        masterNode: "Masterknoten",
        governance: "Regierungsführung",
        bns: "Bns",
        stake: "Einsatz",
        failed: "Fehlgeschlagen"
      },
      tabs: {
        incoming: "Eingehend",
        outgoing: "Ausgehend"
      },
      recentCount: "{count} letzte"
    },
    unlockingAtHeight: "Entriegelung in der Höhe {number}",
    unspentOutputs: "Nicht verbrauchte Outputs",
    userNotUsedAddress: "Du hast diese Adresse nicht benutzt",
    userUsedAddress: "Du hast diese Adresse benutzt",
    version: "Version",
    viewKey: "View Key",
    viewOnlyMode:
      "Nur Anzeige Modus. Bitte die volle Wallet laden um Coins zu senden",
    website: "Webseite",
    privacy: "Privatsphäre",
    normal: "Normal",
    aboutPanel: {
      walletVersion: "Wallet-Version",
      daemonVersion: "Daemon-Version",
      copyright: "Urheberrecht (c) - 2018-2021, Beldex",
      rights: "Alle Rechte vorbehalten."
    },
    availableBalance: "Verfügbares Guthaben",
    confirmed: "Bestätigt",
    showBalance: "Anzeigen",
    hideBalance: "Verbergen",
    electronWallet: "Electron Wallet",
    languageDefault: "Standard",
    walletCount: "{count} Wallet | {count} Wallets",
    selectWalletToUnlock: "Wählen Sie ein Wallet zum Entsperren",
    opened: "Geöffnet",
    privacyCurrencies: "Datenschutzwährungen",
    allCurrencies: "Alle Währungen",
    noCoinsFound: "Keine Coins gefunden",
    deregisteredNodes: "Abgemeldete Nodes",
    none: "Keine",
    pageInternalError: "Interner Fehler",
    newVersionAvailable:
      "Eine neue Version der Beldex Electron Wallet ist verfügbar. Bitte aktualisieren Sie Ihr Wallet über die offizielle Beldex-Website.",
    walletsStoredIn: "Wallet-Dateien werden lokal in {path} gespeichert",
    walletModeSubtitle: "Wählen Sie, wie Sie ein Wallet hinzufügen möchten",
    createWalletHint: "Einen neuen Seed generieren",
    createWalletSubtitle: "Benennen Sie Ihr neues Wallet",
    restoreWalletHint: "Wiederherstellen aus Ihrem 25-Wörter-Seed",
    restoreWalletSubtitle:
      "Verschlüsselten Tresor mithilfe der Seed-Phrase oder der Schlüssel wiederherstellen",
    viewOnlyBadge: "Nur Ansicht",
    viewOnlyTitle: "Dieses Wallet ist schreibgeschützt.",
    viewOnlyDescription:
      "Bitte laden Sie das vollständige Wallet, um das Senden von Coins zu aktivieren.",
    spendKeyNotLoaded: "Ausgabeschlüssel nicht geladen",
    viewOnlyTag: "Nur Ansicht",
    noSpendKeyViewOnly:
      "Kein Ausgabeschlüssel vorhanden – dieses Wallet wird im Modus NUR ANSICHT wiederhergestellt. Sie können den Kontostand und eingehende Transaktionen anzeigen, aber keine BDX senden.",
    restorePointSubtitle:
      "Schritt 2 / 2 · Wählen Sie aus, ab welchem Punkt der Scan beginnen soll",
    restoreFirstBlockHint:
      "Wiederherstellung ab dem allerersten Block ({date}), damit keine Transaktionen übersehen werden. Wenn Sie ungefähr wissen, wann dieses Wallet erstellt wurde, können Sie ein späteres Datum wählen, um die Wiederherstellung erheblich zu beschleunigen.",
    currentHeight: "Aktuelle Höhe {height}",
    passwordsMatch: "Passwörter stimmen überein",
    restoreKeysSubtitle: "Schritt 1 / 2 · Geben Sie Ihre Wallet-Schlüssel ein",
    restoreFromSeedTab: "Aus Seed-Phrase wiederherstellen",
    restoreFromKeysTab: "Mit Schlüsseln wiederherstellen",
    seedWordsHint: "Trennen Sie die Wörter durch Leerzeichen",
    seedWordCount: "{count} / 25 Wörter",
    importWalletHint: "Eine Wallet-.keys-Datei importieren",
    languageRegional: "Regional",
    networkActive: "{network} aktiv",
    connectionTopology: "Wählen Sie die Verbindungstopologie",
    ringCtEnforced: "Verschlüsselung: Ring-CT erzwungen",
    netTypes: {
      mainnet: "Hauptnetz",
      stagenet: "Stagenet",
      testnet: "Testnetz"
    },
    availableShort: "Verfügbar",
    rescanFullHint:
      "Stellt das Guthaben und die Historie ab der Wiederherstellungshöhe neu her. Am langsamsten.",
    rescanSpentHint:
      "Überprüft erneut, welche Outputs ausgegeben wurden. Schnell.",
    privateKeysWarning:
      "Geben Sie niemals Ihren Recovery Seed oder Ihre Schlüssel weiter. Jeder, der sie hat, kann Ihre BDX ausgeben. Bewahren Sie sie offline an einem sicheren Ort auf.",
    primaryAddressLabel: "Primäre Adresse",
    stakingSummary: "Staking-Zusammenfassung",
    totalStaked: "Insgesamt gestaked",
    rewardsEarned: "Verdiente Prämien",
    activeStakes: "Aktive Stakes",
    deregisteredStakes: "Abgemeldet",
    unlockPeriod: "Entsperrzeitraum",
    unlockPeriodValue: "15 / 30 d",
    stakingUnlockNote:
      "Das Entsperren eines Stakes dauert 15 oder 30 Tage, je nachdem, ob er von einem Mitwirkenden entsperrt wurde oder der Node abgemeldet wurde.",
    masterNodesHint: "Masternodes",
    noActiveStakes: "Keine aktiven Stakes",
    stakingSummaryNote:
      "Staking trägt zur Sicherheit des Beldex-Netzwerks bei. Sobald BDX gestaked sind, werden sie nach 15 oder 30 Tagen entsperrt, je nachdem, ob der Stake von einem Mitwirkenden entsperrt wurde oder der Node abgemeldet wurde.",
    readStakingDocs: "Lesen Sie die Staking-Dokumentation",
    noActiveStakesHint:
      "Um mit dem Staking zu beginnen, öffnen Sie den Tab „Stake“ und tragen Sie BDX zu einem Masternode bei.",
    bnsServiceHint: "Beldex Namensservice",
    encryptedRecord: "Verschlüsselter Eintrag",
    purchaseSummary: "Kaufzusammenfassung",
    estimate: "Schätzung",
    price: "Preis",
    total: "Gesamt",
    bnsPurchaseNote:
      "Es kann ein bis zwei Minuten dauern, bis ein neuer Name unter „Mein BNS“ angezeigt wird.",
    yourNames: "Ihre Namen",
    activeNames: "Aktiv",
    expiringSoon: "Läuft bald ab",
    nextExpiry: "Nächster Ablauf",
    bnsRenewNote:
      "Erneuern Sie einen Namen vor seiner Ablaufhöhe, um ihn zu behalten.",
    bnsRenewExtendNote:
      "Durch die Verlängerung wird die Ablaufhöhe ab dem aktuellen Ablaufzeitpunkt und nicht ab dem heutigen Datum verlängert.",
    masterNodeRegistered: "Registriert",
    masterNodeDeregistered: "Abgemeldet",
    keyImage: "Key-Image",
    signature: "Signatur",
    operatorFee: "Betreibergebühr",
    masterNodeKeyShort: "MN-Schlüssel",
    masterNodesNoneAvailable:
      "Derzeit stehen keine Masternodes für Beiträge zur Verfügung."
  },
  titles: {
    addressBook: "Adressbuch",
    addressDetails: "Adressdetails",
    contactBook: "Kontaktbuch",
    advanced: {
      checkTransaction: "Überprüfen Sie die Transaktion",
      prove: "Beweisen",
      signAndVerify: "Unterschreiben/bestätigen",
      sign: "Zeichen",
      verify: "Verifizieren",
      proofsHowTitle: "Wie Nachweise funktionieren",
      proofsHint: "Erweitert",
      proofProveHint:
        "Generieren Sie einen Nachweis, dass Sie eine Zahlung gesendet oder empfangen haben.",
      proofCheckHint:
        "Überprüfen Sie einen Nachweis, der mit Ihnen geteilt wurde.",
      proofSignHint:
        "Signieren Sie eine Nachricht mit Ihrer Adresse oder überprüfen Sie eine Signatur.",
      proofsNote:
        "Nachweise geben niemals Ihre privaten Schlüssel preis. Teilen Sie diese nur mit der Person, die danach gefragt hat."
    },
    availableForContribution: "Für Beiträge verfügbare Masterknoten",
    changePassword: "Passwort ändern",
    configure: "Konfigurationseinstellungen",
    currentlyStakedNodes: "Currently staked nodes",
    bnsRecordDetails: "Details zum BNS-Datensatz",
    bnsBchatRecords: "Bchat-Aufzeichnungen",
    bnsBelnetRecords: "Belnet-Aufzeichnungen",
    importFromFile: "Aus Datei importieren",
    privateKeys: "Private Keys",
    rescanWallet: "Wallet erneut scannen",
    restoreFromSeed: "Aus Seed wiederherstellen",
    bnsServices: "BNS-Dienst",
    bns: {
      purchase: "BNS kaufen",
      myBns: "Mein BNS"
    },
    masterNode: {
      registration: "Anmeldung",
      staking: "Einsätze",
      myStakes: "Meine Einsätze"
    },
    masterNodeDetails: "Masternode-Details",
    settings: {
      title: "Einstellungen",
      tabs: {
        general: "Allgemein",
        language: "Sprache",
        peers: "Gleichaltrige",
        about: "Über"
      }
    },

    transactionDetails: "Transaktionsdetails",
    details: "Einzelheiten",
    transactions: "Transaktionen",

    wallet: {
      createNew: "Neue Wallet erstellen",
      createdOrRestored: "Wallet erstellt/wiederhergestellt",
      walletRestored: "Brieftasche restauriert",
      walletCreated: "Wallet erstellt",
      walletImported: "Wallet Imported",
      importFromFile: "Importieren der Wallet aus Datei",
      useExistingWallet: "Vorhandene Wallet verwenden",
      restore: "Wiederherstellen",
      importFromLegacyGUI: "Wiederherstellung der Wallet von legacy GUI",
      importFromOldGUI: "Wiederherstellung der Wallet von altem GUI",
      restoreFromSeed: "Wiederherstellung Wallet von Seed Wörtern",
      restoreViewOnly: "Wiederherstellung Anzeige Wallet"
    },
    chooseLanguage: "Sprache wählen",
    yourWallets: "Deine Wallets",
    swap: {
      swap: "Tauschen",
      exchange: "Austausch",
      privacySwap: "Privater Tausch",
      privacySwapDescription:
        "Ihr Tausch wird mit dieser Funktion für private Transaktionen sicher durchgeführt. Ihre Identität bleibt verborgen.",
      history: "Geschichte",
      unsupportedpair: "Nicht unterstütztes Austauschpaar",
      minimumAmt: "Der Mindestbetrag beträgt",
      maximumAmt: "Der Höchstbetrag beträgt",
      minimumAmtSuffix:
        "für dieses Paar. Erhöhen Sie den Betrag, um fortzufahren.",
      maximumAmtSuffix:
        "für dieses Paar. Verringern Sie den Betrag, um fortzufahren.",
      transactionDetails: "Transaktionsdetails",
      youSend: "Du sendest",
      exchangeRate: "Tauschrate",
      fixedRate: "Fester Zinssatz",
      fixedRateUpdateSec: "Die feste Rate wird alle 30 Sekunden aktualisiert",
      serviceFee: "Servicegebühr",
      fees: "Gebühren",
      allTheFees: "Alle Gebühren im Preis inbegriffen",
      networkFee: "Netzwerkgebühr",
      youGet: "Du erhältst",
      floatingExchangeRate: "Variabler Wechselkurs",
      fixedExchangeRate: "Fester Wechselkurs",
      stillProcessing:
        "Ihre vorherige Transaktion wird noch bearbeitet. Sie können in 15 Minuten ein neues erstellen",
      minimumExchangeAmtAbove: "Der Mindestumtauschbetrag liegt oben",
      for: "für",
      maximumExchangeAmtUnder: "Der maximale Umtauschbetrag liegt unter",
      floatingRateDisc:
        "Der variable Zinssatz kann sich aufgrund der Marktbedingungen jederzeit ändern, sodass Sie möglicherweise mehr oder weniger Krypto als erwartet erhalten.",
      fixedRateExactAmtDisc:
        "Mit dem Festpreis erhalten Sie genau die Menge an Krypto, die Sie auf diesem Bildschirm sehen.",
      walletAddress: "Wallet-Adresse",
      myWalletRequire: "Mein Geldbeutel erfordert",
      agreeWith: "Ich bin einverstanden mit",
      termOfUse: "Nutzungsbedingungen",
      and: "Und",
      privacyPolicy: "Datenschutzrichtlinie",
      checkout: "Kasse",
      blockchain: "Blockchain",
      exchangefee: "Umtauschgebühr",
      exchangeFeeIncluded:
        "Die Umtauschgebühr ist in dem angezeigten Betrag, den Sie erhalten, bereits enthalten",
      networkFeeIncluded:
        "Die Netzwerkgebühr ist in dem angezeigten Betrag, den Sie erhalten, bereits enthalten",
      guaranteeFee: "Garantierter Preis",
      refundAddress: "Rückerstattungsadresse",
      exchanging: "Austauschen",
      confirmingProcess: "Bestätigung läuft",
      Once: "Einmal",
      confirmedInBlockchain:
        "in der Blockchain bestätigt wird, beginnen wir mit dem Austausch",
      seenInputExplorer: "Siehe Eingabe-Hash im Explorer",
      to: "Zu",
      pleaseWait: "Der Vorgang dauert einige Minuten. Bitte warten.",
      sendFundsToWallet: "Senden Sie Geld an Ihre Brieftasche",
      waitHere: "Hier müssen Sie nicht warten",
      newTransaction: "Sie können eine neue Transaktion initiieren.",
      checkStatus:
        "Sie können den Status dieser Transaktion jederzeit in der Transaktion überprüfen",
      transactionPreview: "Transaktionsvorschau",
      transactionID: "Transaction ID",
      changellyAddress: "Exchange-Adresse",
      completed: "Vollendet",
      amountTo: "Betragen",
      amountReceived: "Erhaltener Betrag",
      amountSend: "Gesendeter Betrag",
      inputHash: "Eingabe-Hash",
      outputHash: "Ausgabe-Hash",
      amountFrom: "Betrag von",
      paymentNotReceived:
        "Das Geld ging nicht innerhalb von 3 Stunden ein. Bitte überprüfen Sie die Tarife und erstellen Sie eine neue Transaktion",
      downloadCsv: "CSV herunterladen",
      status: "Status",
      date: "Datum",
      exchangeAmount: "Umtauschbetrag",
      receiver: "Empfängerin",
      confirmations: "Bestätigungen",
      sendFundDisc: "Senden Sie Geld an die unten angegebene Adresse",
      timeLeft: "Es bleibt noch Zeit zum Senden",
      guaranteedRateDisc: "Der garantierte Tarif wurde gekündigt",
      sendFundsAboveAddress:
        "Bitte beachten Sie, dass Sie Geld nur an die oben genannte Adresse senden können",
      once: "einmal",
      swapMaintenance: "BDX Swap wird vorübergehend gewartet",
      tryAgainSomeTimes:
        "Bitte versuchen Sie es später noch einmal. Ihre Guthaben und offenen Swaps sind nicht betroffen.",
      afterYourFirstTxn: "Nach Ihrer ersten Transaktion",
      youWillBeViewHere: "Sie können es hier ansehen",
      openHistory: "Öffnen Sie den Verlauf",
      newTransactionBtn: "Neue Transaktion",
      exchangePair: "Tauschpaar",
      exchangePairDisc: "Legen Sie das bevorzugte Börsenpaar fest",
      walletAddressDisc: "Geben Sie die Adressdaten der Krypto-Wallet ein",
      payment: "Zahlung",
      paymentDisc: "Zahlen Sie den für den Umtausch erforderlichen Betrag ein",
      exchangeDisc: "Warten Sie, bis Ihre Transaktion abgeschlossen ist",
      paymentConfirm: "Bestätigen und Zahlung durchführen",
      minimumAmtChanged:
        "Der Mindestbetragswert wird geändert, der neue Wert ist ",
      maximumAmtChanged:
        "Der Höchstbetragswert wird geändert, der neue Wert ist ",
      network: "NETZWERK",
      giveCorrectAddress:
        "Bitte stellen Sie sicher, dass Sie die richtige Adresse für das ausgewählte Netzwerk eingeben. Andernfalls verlieren Sie Ihr Guthaben.",
      swapType: "Swap-Typ",
      youSent: "Sie haben gesendet",
      ratesRefresh: "Kurse werden alle 30 s aktualisiert",
      confirmingDeposit: "Einzahlung wird bestätigt",
      inProgress: "In Bearbeitung",
      waitHereDesc:
        "Sie können eine neue Transaktion starten und den Status dieser jederzeit überprüfen in",
      depositAddress: "Einzahlungsadresse",
      swapHistory: "Swap-Historie",
      swaps: "Swaps",
      noSwapsYet: "Noch keine Swaps vorhanden",
      noSwapsYetDisc:
        "Tauschen Sie BDX gegen über 100 Coins. Jeder von Ihnen durchgeführte Swap wird hier mit seinem aktuellen Status angezeigt.",
      newExchange: "Neuer Tausch",
      statusPending: "Ausstehend",
      statusCompleted: "Abgeschlossen",
      statusWaiting: "Warten",
      statusRefund: "Rückerstattung",
      statusFailed: "Fehlgeschlagen",
      statusExpired: "Abgelaufen",
      allStatuses: "Alle Status",
      statusFilterLabel: "Status: {status}",
      noMatchingSwaps: "Keine Swaps entsprechen diesem Filter",
      noMatchingSwapsDisc:
        "Keiner deiner {count} Swaps hat den Status {status}. Wähle einen anderen Status oder setze den Filter zurück.",
      clearFilter: "Filter zurücksetzen",
      swapStatus: "Swap-Status",
      depositWindowExpired: "Einzahlungsfenster nach 3 Stunden abgelaufen",
      reviewBeforePaying: "Vor der Bezahlung überprüfen",
      estimate: "Schätzung",
      waitingDeposit: "Warten auf Ihre Einzahlung",
      checkedAgo: "Vor {seconds} Sekunden überprüft"
    },
    bnsNames: "BNS-Namen",
    masternode: "Masternode",
    activityLedger: "Aktivitäts-Ledger",
    myWallet: "Mein Wallet",
    selectWalletMode: "Wallet-Modus auswählen"
  }
};
