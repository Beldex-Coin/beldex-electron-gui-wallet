export default {
  buttons: {
    // All button text is uppercased in the gui
    advanced: "Fortschrittlich",
    addAddressBook: "Zum Adressbuch hinzufügen",
    addWallet: "Geldbörse hinzufügen",
    all: "Alle",
    back: "Zurück",
    browse: "Durchsuchen",
    cancel: "Stornieren",
    change: "Ändern",
    check: "Überprüfen",
    clear: "klar",
    clearAll: "Alles löschen",
    close: "Schließen",
    contacts: "Kontakte",
    copy: "Kopieren",
    copyAddress: "Adresse kopieren",
    copyData: "Daten kopieren",
    copySignature: "Unterschrift kopieren",
    createWallet: "Wallet erstellen",
    decrypt: "ENTSCHLÜSSELN",
    addRecord: "BNS hinzufügen",
    delete: "Löschen",
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
    add: "Hinzufügen",
    bnsUpdate: "BNS-Update",
    bnsRenew: "BNS erneuern"
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
      ok: "Peer blockieren"
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
      ok: "Bestätigen"
    },
    deleteAddress: {
      title: "Adresse löschen",
      message: "Möchten Sie diese Adresse wirklich löschen?"
    },
    discardEdit: {
      title: "Bist du sicher?",
      message: "Möchten Sie die Bearbeitung wirklich verwerfen?"
    },
    showMasterNode: {
      title: "Masterknoten anzeigen",
      message: "Möchten Sie fortfahren?",
      masterNode: "Masterknoten"
    },
    deleteWallet: {
      title: "Wallet löschen",
      message: "Sind Sie sicher, dass Sie das aktuelle Wallet löschen möchten?",
      ok: "Löschen"
    },
    exit: {
      title: "Beenden",
      message: "Sind Sie sicher, dass Sie das Wallet verlassen möchten?",
      ok: "Beenden"
    },
    keyImages: {
      title: "{type} key images",
      message: "Möchtest du key images {type}",
      export: "Exportieren",
      import: "Importieren"
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
      message: "Wallet Passwort eingeben um fortzufahren"
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
      ok: "Starten Sie Wallet neu"
    },
    showPrivateKeys: {
      title: "Private Keys Anzeigen",
      message: "Möchtest du deinen Private Key anzeigen?",
      ok: "Zeigen"
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
      ok: "Schließen"
    },
    transfer: {
      title: "Transferieren",
      message: "Möchtest du die Transaktion senden?",
      ok: "Schicken"
    },
    confirmTransaction: {
      title: "Bestätigen Sie das Senden",
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
    }
  },
  fieldLabels: {
    // Field labels are also all uppercased
    address: "Adresse",
    recipientAddress: "Empfängeradresse",
    amount: "Menge",
    belnetId: "Belnet-ID",
    eth: "ETH",
    backupOwner: "Backup-Besitzer",
    awardRecepientAddress: "EMPFÄNGER ADRESSE FÜR DIE VERGÜTUNG",
    confirmPassword: "Passwort bestätigen (optional)",
    chooseNetwork: "Wählen Sie ein Netzwerk",
    daemonLogLevel: "Daemon-Protokollebene",
    daemonP2pPort: "Daemon P2P-Port",
    dataStoragePath: "Datenspeicherpfad",
    decryptRecord: "Datensatz hinzufügen",
    expirationHeight: "Ablaufhöhe",
    encryptedBchatValue: "Verschlüsselter Bchat-Wert",
    data: "Daten",
    filter: "Filter",
    filterTransactionType: "FILTERN NACH TRANSAKTIONSTYP",
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
    walletStoragePath: "Wallet-Speicherpfad",
    // These are specific labels which do not get uppercased
    confirmNewPassword: "Neues Passwort bestätigen",
    newPassword: "Neues Passwort",
    oldPassword: "Altes Passwort",
    rescanFullBlockchain: "Gesamte Blockchain erneut scannen",
    rescanSpentOutputs: "Spent Outputs erneut scannen",
    transactionNotes: "Transaktionsnotizen",

    // new design revamp

    OwnerWalletaddress: " Besitzer-Wallet-Adresse",
    backupOwnerWalletAddress: "Wallet-Adresse des Backup-Eigentümers",
    updateOwner: "Besitzer aktualisieren",
    updateValues: "Werte aktualisieren",
    updateHeight: "Aktualisierungs-Höhe",
    walletAddress: "Wallet-Adresse",
    year: "Jahr"
  },
  footer: {
    ready: "Synchronisiert",
    remote: "Fernbedienung",
    scanning: "Scannen",
    status: "Status",
    syncing: "Synchronisierung",
    wallet: "Geldbörse",
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
    copyOwner: "Eigentümer kopieren",
    copyQR: "QR Code kopieren",
    copySeedWords: "Seed Wörter kopieren",
    copySpendKey: "Spend Key kopieren",
    copyMasterNodeKey: "Copy master node key",
    copyTransactionId: "Transaktions ID kopieren",
    copyViewKey: "View Key kopieren",
    createNewWallet: "Neue Wallet erstellen",
    deleteWallet: "Wallet löschen",
    exit: "Beldex GUI Wallet schliessen",
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
    favourite: "Favorit"
  },
  notification: {
    positive: {
      addressCopied: "Adresse in die Zwischenablage kopiert",
      linkCopied: "Link in die Zwischenablage kopiert",
      backupOwnerCopied: "Backup-Besitzer in die Zwischenablage kopiert",
      bannedPeer: "Blockiert {host} bis {time}",
      copied: "{item} in Zwischenablage kopiert",
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
      cannotAccessRemoteNode:
        "Remote Node nicht erreichbar, bitte versuche es mit einer anderen Remote Node",
      changingPassword: "Fehler beim Ändern des Passworts",
      copyWalletFail: "Fehler beim Kopieren der Wallet",
      copyingPrivateKeys: "Fehler beim Kopieren der Private Keys",
      dataPathNotFound: "Pfad zur Speicherung nicht gefunden",
      differentNetType: "Remote Node benutzt einen anderen „nettype“",
      enterSeedWords: "Seed Wörter eingeben",
      enterTransactionId: "Enter transaction ID",
      enterTransactionProof: "Enter transaction proof",
      enterWalletName: "Wallet Namen eingeben",
      enterName: "Geben Sie einen Namen ein",
      errorSavingItem: "Fehler beim Speichern {item}",
      failedMasterNodeUnlock: "Fehler beim Master Node unlock",
      failedToSetLanguage: "Fehler bei der Auswahl der Sprache: {lang}",
      failedWalletImport: "Fehler beim Importieren der Wallet",
      failedWalletOpen:
        "Fehler beim Öffnen der Wallet. Bitte versuche es erneut",
      failedWalletRead: "Fehler beim Lesen der Wallets",
      internalError: "Interner Fehler",
      invalidAddress: "Adresse nicht gültig",
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
      invalidSignature: "Ungültige Signatur",
      invalidWalletPath: "Ungültiger Wallet Pfad",
      keyImages: {
        exporting: "Fehler beim Export der Key images",
        reading: "Fehler beim lesen der Key images",
        importing: "Fehler beim Import der Key Images"
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
      zeroAmount: "Betrag muss grösser als null sein",
      greaterHeight:
        "Der eingegebene Wert ist größer als die aktuelle Blockhöhe"
    },
    warnings: {
      noKeyImageExport: "Keine Key Images zum Exportieren gefunden",
      usingLocalNode:
        "Zugang zur Remote Node nicht möglich, wechsle zur lokalen Node",
      usingRemoteNode: "lbeldexd nicht gefunden, benutze eine Remote Node"
    }
  },
  placeholders: {
    additionalNotes: "Zusätzliche Notizen",
    addNotesOptional: "Notizen hinzufügen (optional)",
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
    enterAddress: "Adresse eingeben",
    enteroldPassword: "Geben Sie das alte Passwort ein",
    enterNewPassword: "Neues Passwort eingeben",
    reEnterPassword: "Kennwort erneut eingeben",
    mnemonicSeed: "25 (oder 24) mnemonic Seed Wörter",
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
    walletPassword: "Ein optionales Passwort für die Wallet",
    reEnterWalletPassword: "Kennwort erneut eingeben",
    enterEthAddress: "Geben Sie Ihre ETH-Adresse ein",
    enterBelnetId: "Geben Sie Ihre Belnet-ID ein",
    enterBchatId: "Gib deine BChat-ID ein",
    enterWalletAddress: "Geben Sie Ihre Wallet-Adresse ein"
  },
  strings: {
    addAddressBookEntry: "Adressbuch Eintrag hinzufügen",
    addressBookDetails: "Adressbuch details",
    addressBookIsEmpty: "Adressbuch ist leer",
    addresses: {
      myPrimaryAddress: "Meine primäre Adresse",
      myUnusedAddresses: "Meine ungenutzten Adressen",
      myUsedAddresses: "Meine benutzen Adressen",
      // primaryAddress: "Primäre Adresse",
      subAddress: "Sub-Adresse",
      subAddressIndex: "Index {index}",
      primaryAccount: "Hauptkonto"
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
      fetchNewRecord: "BNS-Datensatz wird aus dem Netzwerk abgerufen..."
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
    seedWords: "Seed Wörter",
    walletCreated: "Wallet erstellt",
    selectLanguage: "Sprache auswählen",
    masterNodeContributionDescription:
      "Durch Staking wird die Sicherheit des Beldex-Netzwerks erhöht. Für Ihren Beitrag erhalten Sie BDX. Nach dem Staking müssen Sie je nach Art der Freigabe (durch einen anderen Teilnehmer oder durch die Abmeldung des Knotens) 15 oder 30 Tage warten, bis Ihre BDX freigegeben werden. Weitere Informationen zum Staking finden Sie in der Dokumentation auf der Beldex-Website",
    masterNodeRegistrationDescription:
      "Hier den {registerComand} Befehl, der mit Hilfe des Daemons durch das Kommando {prepareCommand} erzeugt wurde, eingeben, um eine Master Node zu aktivieren",
    masterNodeStartStakingDescription:
      "Um mit dem Staing zu beginnen, besuchen Sie bitte",
    masterNodeStartStakingDescription1: "Вкладка -->",
    noMasterNodesCurrentlyAvailable:
      "В настоящее время нет доступных для добавления главных узлов.",
    masterNodeDetails: {
      contributors: "Mitwirkende",
      lastRewardBlockHeight: "Höhe des letzten Belohnungsblocks",
      lastUptimeProof: "Letzter Verfügbarkeitsnachweis",
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
      }
    },
    unlockingAtHeight: "Entriegelung in der Höhe {number}",
    unspentOutputs: "Nicht verbrauchte Outputs",
    userNotUsedAddress: "Du hast diese Adresse nicht benutzt",
    userUsedAddress: "Du hast diese Adresse benutzt",
    version: "Version",
    viewKey: "View Key",
    viewOnlyMode:
      "Nur Anzeige Modus. Bitte die volle Wallet laden um Coins zu senden",
    WalletAddress: "Wallet-Adresse",
    website: "Webseite"
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
      verify: "Verifizieren"
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
        peers: "Gleichaltrige"
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
      history: "Geschichte",
      unsupportedpair: "Nicht unterstütztes Austauschpaar",
      minimumAmt: "Der Mindestbetrag beträgt",
      maximumAmt: "Der Höchstbetrag beträgt",
      transactionDetails: "Transaktionsdetails",
      youSend: "Du sendest",
      exchangeRate: "Tauschrate",
      fixedRate: "Fester Zinssatz",
      fixedRateUpdateSec: "Die feste Rate wird alle 30 Sekunden aktualisiert",
      serviceFee: "Servicegebühr 0,25 %",
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
      changellyAddress: "Changelly-Adresse",
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
      sendFundDisc: "Senden Sie Geld an die unten angegebene Adresse",
      timeLeft: "Es bleibt noch Zeit zum Senden",
      guaranteedRateDisc: "Der garantierte Tarif wurde gekündigt",
      sendFundsAboveAddress:
        "Bitte beachten Sie, dass Sie Geld nur an die oben genannte Adresse senden können",
      once: "einmal",
      swapMaintenance: "Swap wird vorübergehend gewartet",
      tryAgainSomeTimes: "Bitte versuchen Sie es nach einiger Zeit noch einmal",
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
        "Bitte stellen Sie sicher, dass Sie die richtige Adresse für die ausgewählte Kette eingeben ({type}). Andernfalls verlieren Sie Ihr Guthaben."
    }
  }
};
