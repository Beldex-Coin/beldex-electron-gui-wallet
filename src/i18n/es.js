export default {
  buttons: {
    // All button text is uppercased in the gui
    advanced: "AVANZADO",
    addAddressBook: "Agregar a la libreta de direcciones",
    addWallet: "Agregar billetera",

    all: "TODO",
    back: "ATRÁS",
    browse: "EXAMINAR",
    cancel: "CANCELAR",
    change: "MODIFICAR",
    check: "COMPROBAR",
    clear: "RESTABLECER",
    clearAll: "Limpiar todo",
    close: "CERRAR",
    contacts: "CONTACTOS",
    copyAddress: "COPIAR DIRECCIÓN",
    copy: "Copiar",

    copySignature: "COPIAR FIRMA",
    createWallet: "CREAR MONEDERO",
    delete: "ELIMINAR",
    edit: "EDITAR",
    editNotes: "Editar notas",
    export: "EXPORTAR",
    fromBlockheight: "Desde altura de bloque",

    generate: "GENERAR",
    import: "IMPORTAR",
    importWallet: "IMPORTAR MONEDERO | IMPORTAR MONEDEROS",
    min: "mínimo",
    max: "máx.",
    next: "SIGUIENTE",
    openWallet: "ABRIR MONEDERO",
    receive: "RECIBIR",
    registerMasterNode: "REGISTRAR NODO DE SERVICIO",
    rescan: "VOLVER A EXAMINAR",
    restoreWallet: "RESTAURAR MONEDERO",
    refresh: "Actualizar",
    save: "GUARDAR",
    saveTxNotes: "GUARDAR NOTAS DE LA TRANSACCIÓN",
    selectLocation: "SELECCIONAR UBICACIÓN",
    selectWalletFile: "SELECCIONAR ARCHIVO DEL MONEDERO",
    send: "ENVIAR",
    sendCoins: "ENVIAR MONEDAS",
    masterNode: "NODO DE SERVICIO",
    settings: "CONFIGURACIÓN",
    showQRCode: "MOSTRAR CÓDIGO QR",
    showTxDetails: "Detalles de TXN",
    stake: "RETENER PARTICIPACIÓN",
    sweepAll: "TRANSFERIR/BARRER TODO",
    unlock: "LIBERAR",
    viewOnExplorer: "VER EN EL EXPLORADOR",
    add: "Agregar",
    bnsUpdate: "Actualización BNS",
    bnsRenew: "Renovar BNS"
  },
  dialog: {
    // Generic buttons
    buttons: {
      ok: "ACEPTAR",
      cancel: "CANCELAR",
      open: "ABRIR"
    },

    // Dialogs
    banPeer: {
      title: "Vetar pares",
      peerDetailsTitle: "Detalles del par",
      message:
        "Introduzca el periodo de veto del par en segundos.\nPor defecto 3600 = 1 hora.",
      ok: "Vetar par"
    },
    copyAddress: {
      title: "Copiar dirección",
      message:
        "Hay un id de pago asociado a esta dirección.\nAsegúrese de copiar también el id de pago por separado."
    },
    copyPrivateKeys: {
      // Copy {seedWords/viewKey/spendKey}
      title: "Copiar {type}",
      message:
        "Tenga cuidado si comparte sus claves privadas ya que estas permiten controlar sus fondos.",
      seedWords: "Palabras Semilla",
      viewKey: "Clave de Visualización",
      spendKey: "Clave de Gasto"
    },
    deleteWallet: {
      title: "Eliminar monedero",
      message: "¿Está seguro de que desea eliminar la billetera actual?",
      ok: "ELIMINAR"
    },
    exit: {
      title: "Salir",
      message: "¿Está seguro de que desea salir?",
      ok: "SALIR"
    },
    keyImages: {
      title: "{type} imágenes de la clave",
      message: "¿Desea {type} las imágenes de la clave?",
      export: "Exportar",
      import: "Importar"
    },
    noPassword: {
      title: "Sin contraseña",
      message: "¿Está seguro de que quiere crear un monedero sin contraseña?",
      ok: "SÍ"
    },
    password: {
      title: "Ingrese su contraseña de billetera",
      message: "Introduzca la contraseña del monedero para continuar."
    },
    registerMasterNode: {
      title: "Registrar nodo de servicio",
      message: "¿Desea registrar el nodo de servicio?",
      ok: "REGISTRAR"
    },
    rescan: {
      title: "Volver a examinar el monedero",
      message:
        "Advertencia: Cierta información de las transacciones\nanteriores, como la dirección del destinatario, se perderá.",
      ok: "VOLVER A EXAMINAR"
    },
    restart: {
      title: "Reiniciar",
      message:
        "Los cambios requieren reiniciar la aplicación ¿Desea reiniciar ahora?",
      ok: "REINICIAR"
    },
    showPrivateKeys: {
      title: "Mostrar claves privadas",
      message: "¿Desea ver sus claves privadas?",
      ok: "MOSTRAR"
    },
    stake: {
      title: "RETENER PARTICIPACIÓN",
      message: "¿Desea participar reteniendo la cantidad que ha indicado?",
      ok: "RETENER"
    },
    sweepAll: {
      title: "Transferir/Barrer todo",
      message: "¿Está seguro de que quiere transferir/barrer todos sus fondos?",
      ok: "TRANSFERIR/BARRER TODO"
    },
    sweepAllWarning: {
      title: "Advertencia transferir/barrer todo",
      message:
        "Va a combinar todos sus fondos no gastados mediante una transacción a sí mismo. Su monedero mostrará temporalmente un balance de 0. Tras 10 bloques sus fondos serán liberados y podrá retener su participación a un nodo de servicio con normalidad.",
      ok: "CONTINUAR"
    },
    switchWallet: {
      title: "Cambiar de monedero",
      closeMessage: "¿Confirma que desea cerrar el monedero actual?",
      restartWalletMessage:
        "Are you sure you want to close and Restart the wallet?",
      restartMessage:
        "El monedero se está sincronizando. \nSi desea cambiar de monedero, tendrá que reiniciar la aplicación. \nEl progreso de la sincronización no se guardará y será necesario volver a examinar la cadena de bloques."
    },
    transactionDetails: {
      title: "Detalles de la transacción",
      ok: "CERRAR"
    },
    transfer: {
      title: "Transferir",
      message: "¿Desea enviar la transacción?",
      ok: "ENVIAR"
    },
    unlockConfirm: {
      title: "Confirmar liberación",
      ok: "LIBERAR"
    },
    unlockMasterNode: {
      title: "Liberar nodo de servicio",
      confirmTitle: "Confirmar liberación",
      message: "¿Desea liberar el nodo de servicio?",
      ok: "LIBERAR"
    },
    unlockMasterNodeWarning: {
      title: "Advertencia liberación nodo de servicio",
      message:
        "Liberar una participación parcial a un nodo hará que el resto de participaciones de otras personas también se liberen. Si se trata de una participación a un nodo compartido, estaría bien que comunicara sus intenciones al operador y al resto de participantes.",
      ok: "CONTINUAR"
    }
  },
  fieldLabels: {
    // Field labels are also all uppercased
    address: "Dirección",
    recipientAddress: "Dirección de la destinataria",
    amount: "CANTIDAD",
    confirmPassword: "CONFIRMAR CONTRASEÑA",
    daemonLogLevel: "NIVEL LOG PARA EL SERVICIO",
    daemonP2pPort: "PUERTO P2P SERVICIO",
    dataStoragePath: "RUTA DE ALMACENAMIENTO DE DATOS",
    data: "Datos",

    filter: "Filtro",
    filterTransactionType: "FILTRAR POR TIPO DE TRANSACCIÓN",
    internalWalletPort: "PUERTO INTERNO MONEDERO",
    keyImages: {
      exportDirectory: "DIRECTORIO AL QUE EXPORTAR LA IMAGEN DE LA CLAVE",
      importFile: "ARCHIVO DE IMPORTACIÓN DE LA IMAGEN DE LA CLAVE"
    },
    limitDownloadRate: "LÍMITE VELOCIDAD DE DESCARGA",
    limitUploadRate: "LÍMITE VELOCIDAD DE SUBIDA",
    localDaemonIP: "IP SERVICIO LOCAL",
    localDaemonPort: "PUERTO SERVICIO LOCAL",
    maxIncomingPeers: "NÚM. MÁX. PARES ENTRANTES",
    maxOutgoingPeers: "NÚM. MÁX. PARES SALIENTES",
    message: "Mensaje",
    mnemonicSeed: "SEMILLA MNEMÓNICA",
    name: "NOMBRE",
    newWalletName: "NUEVO NOMBRE PARA EL MONEDERO",
    notes: "NOTAS",
    addressBookNotes: "Notas de la libreta de direcciones",
    optional: "OPCIONAL",
    password: "CONTRASEÑA",
    paymentId: "ID DE PAGO",
    priority: "PRIORIDAD",
    remoteNodeHost: "HOST NODO REMOTO",
    remoteNodePort: "PUERTO NODO REMOTO",
    restoreFromBlockHeight: "RESTAURAR DESDE EL BLOQUE NÚMERO",
    restoreFromDate: "RESTAURAR DESDE EL DÍA",
    seedLanguage: "IDIOMA SEMILLA",
    totalBalance: "Balance total",
    masterNodeCommand: "ORDEN PARA REGISTRAR EL NODO DE SERVICIO",
    masterNodeKey: "CLAVE NODO DE SERVICIO",
    signature: "FIRMA",
    transactionId: "ID DE LA TRANSACCIÓN",
    to: "A",
    walletFile: "ARCHIVO MONEDERO",
    walletLogLevel: "NIVEL LOG MONEDERO",
    walletName: "NOMBRE MONEDERO",
    walletRPCPort: "PUERTO RPC MONEDERO",
    walletStoragePath: "RUTA DE ALMACENAMIENTO DEL MONEDERO",

    // These are specific labels which do not get uppercased
    confirmNewPassword: "Confirme la nueva contraseña",
    newPassword: "Contraseña nueva",
    oldPassword: "Contraseña antigua",
    rescanFullBlockchain: "Volver a examinar la cadena de bloques entera",
    rescanSpentOutputs: "Volver a examinar las salidas gastadas",
    transactionNotes: "Notas de la Transacción",
    chooseNetwork: "Seleccione una Red",
    network: "Red",

    // new design revamp

    OwnerWalletaddress: "Dirección de billetera del propietario",
    backupOwnerWalletAddress:
      "Dirección de billetera del propietario de respaldo",
    updateOwner: "Actualizar propietario",
    updateValues: "Actualizar valores"
  },
  footer: {
    ready: "LISTO",
    scanning: "EXAMINANDO",
    status: "Estado",
    syncing: "SINCRONIZANDO",
    remote: "Remoto",
    wallet: "Monedero"
  },
  menuItems: {
    about: "Acerca de",
    changePassword: "Modificar Contraseña",
    copyAddress: "Copiar dirección",
    copySeed: "Copiar semilla",
    copyQR: "Copiar código QR",
    copySeedWords: "Copiar palabras semilla",
    copySpendKey: "Copiar clave de gasto",
    copyMasterNodeKey: "Copiar clave de nodo de servicio",
    copyTransactionId: "Copiar ID de la transacción",
    copyViewKey: "Copiar clave de visualización",
    createNewWallet: "Crear nuevo monedero",
    deleteWallet: "Eliminar monedero",
    exit: "Cerrar la interfaz del monedero Beldex",
    importOldGUIWallet: "Importar monedero de una interfaz gráfica antigua",
    manageKeyImages: "Administrar Imágenes de Clave",
    openWallet: "Abrir monedero",
    rescanWallet: "Volver a examinar monedero",
    restoreWalletFile: "Restaurar monedero de un archivo",
    restoreWalletSeed: "Restaurar monedero mediante semilla",
    saveQR: "Guardar código QR en archivo",
    sendToThisAddress: "Enviar a esta dirección",
    settings: "Configuración",
    showDetails: "Mostrar detalles",
    showPrivateKeys: "Mostrar Claves Privadas",
    showQRCode: "Mostrar código QR",
    switchWallet: "Cambiar de monedero",
    viewOnExplorer: "Ver en el explorador"
  },
  notification: {
    positive: {
      addressCopied: "Dirección copiada al portapapeles",
      bannedPeer: "{host} vetado hasta {time}",
      copied: "{item} copiado/a al portapapeles",
      itemSaved: "{item} guardado/a en {filename}",
      keyImages: {
        exported: "Imágenes de clave exportadas a {filename}",
        imported: "Imágenes de clave importadas"
      },
      passwordUpdated: "Contraseña actualizada",
      qrCopied: "Código QR copiado al portapapeles",
      registerMasterNodeSuccess: "Nodo de servicio registrado correctamente",
      sendSuccess: "Transacción enviada correctamente",
      signatureCopied: "Firma copiada al portapapeles",
      stakeSuccess: "Participación retenida correctamente",
      transactionNotesSaved: "Notas de la transacción guardadas"
    },
    errors: {
      banningPeer: "Error al vetar el par",
      cannotAccessRemoteNode:
        "No ha sido posible acceder al nodo remoto. Tenga la amabilidad de probar con otro",
      changingPassword: "Error al cambiar la contraseña",
      copyWalletFail: "Error al copiar el monedero",
      copyingPrivateKeys: "Error al copiar las claves privadas",
      dataPathNotFound: "No se ha encontrado la ruta de almacenamiento",
      differentNetType: "El nodo remoto usa un tipo de red diferente",
      enterSeedWords: "Introduzca las palabras semilla",
      enterTransactionId: "Introduzca ID de la transacción",
      enterTransactionProof: "Introduzca prueba de transacción",
      enterWalletName: "Introduzca un nombre para el monedero",
      errorSavingItem: "Error al guardar {item}",
      failedMasterNodeUnlock: "La liberación del nodo de servicio ha fallado",
      failedToSetLanguage: "Fallo al cambiar de idioma: {lang}",
      failedWalletImport: "Fallo al importar el monedero",
      failedWalletOpen: "Fallo al abrir el monedero. Inténtelo de nuevo.",
      internalError: "Error interno",
      invalidAddress: "Dirección no válida",
      invalidAmount: "Cantidad no válida",
      invalidOldPassword: "Contraseña antigua incorrecta",
      invalidPassword: "Contraseña incorrecta",
      invalidPaymentId: "id de pago no válido",
      invalidPrivateViewKey: "Clave de visualización privada no válida",
      invalidPublicAddress: "Dirección pública no válida",
      invalidRestoreDate: "Fecha de restauración no válida",
      invalidRestoreHeight: "Altura de bloque no válida",
      invalidSeedLength: "Cantidad de palabras en la semilla incorrecta",
      invalidMasterNodeCommand:
        "Por favor, introduzca el comando para registrar el nodo de servicio",
      invalidMasterNodeKey: "Clave de nodo de servicio no válida",
      invalidWalletPath: "Ruta del monedero no válida",
      keyImages: {
        exporting: "Error exportando imágenes de clave",
        reading: "Error leyendo imágenes de clave",
        importing: "Error importando imágenes de clave"
      },
      negativeAmount: "La cantidad no puede ser negativa",
      newPasswordNoMatch: "Las contraseñas nuevas no coinciden",
      newPasswordSame:
        "No se puede usar la contraseña anterior. Establezca una contraseña diferente",
      passwordFieldEmpty: "Por favor, introduzca su contraseña",
      notEnoughBalance: "No hay suficiente saldo libre",
      passwordNoMatch: "Las contraseñas no coinciden",
      remoteCannotBeReached: "No se puede conectar con el servicio remoto",
      selectWalletFile: "Seleccione un archivo monedero",
      unknownError: "Ha ocurrido un error inesperado",
      walletAlreadyExists: "Ya existe un monedero con este nombre",
      walletPathNotFound: "Ruta no encontrada",
      zeroAmount: "La cantidad debe ser mayor que cero"
    },
    warnings: {
      noKeyImageExport: "No se han encontrado claves para exportar",
      usingLocalNode:
        "No se ha podido acceder al nodo remoto, volviendo al modo local",
      usingRemoteNode: "beldexd no encontrado, utilizando nodo remoto"
    }
  },
  placeholders: {
    additionalNotes: "Notas adicionales",
    addNotesOptional: "Añadir notas (opcional)",
    addressBookName: "Nombre asociado a esta dirección",
    addressOfSigner: "Public wallet address of signer",
    beldexAddress: "Enter Address or BNS Name",
    enterName: "Ingrese su nombre",
    enterAddress: "Ingresa la direccion",
    enteroldPassword: "Ingrese la contraseña anterior",
    enterNewPassword: "Ingrese nueva clave",
    reEnterPassword: "Escriba la contraseña otra vez",
    filterTx: "Introduzca un ID, nombre, dirección o cantidad",
    hexCharacters: "{count} caracteres hexadecimales",
    mnemonicSeed: "Semilla mnemónica de 25 (o 24) palabras",
    dataToSign: "Data you want to sign with your primary address's private key",

    pasteTransactionId: "Pegar ID de la transacción",
    pasteTransactionProof: "Pegar prueba de la transacción",
    proveOptionalMessage: "Mensaje opcional contra el qué se firma la firma",
    recipientWalletAddress: "Dirección del monedero de destino",
    reEnterWalletPassword: "Escriba la contraseña otra vez",
    selectAFile: "Seleccione un archivo por favor",
    transactionNotes: "Notas adicionales para agregar a la transacción",
    signature: "Signature to verify",
    unsignedData: "Los datos como deberían verse antes de ser firmados",

    walletName: "Nombre para identificar su monedero",
    walletPassword: "Contraseña opcional para proteger su monedero"
  },
  strings: {
    addAddressBookEntry: "Agregar registro a la libreta de direcciones",
    addressBookDetails: "Detalles de la libreta de direcciones",
    addressBookIsEmpty: "La libreta de direcciones está vacía",
    addresses: {
      myPrimaryAddress: "Mi dirección principal",
      myUnusedAddresses: "Mis direcciones no usadas",
      myUsedAddresses: "Mis direcciones usadas",
      // primaryAddress: "Dirección principal",
      subAddress: "Dirección auxiliar",
      subAddressIndex: "Índice {index}",
      primaryAccount: "Cuenta principal"
    },
    advancedOptions: "Opciones avanzadas",
    bannedPeers: {
      title: "Pares vetados (los vetos se anularán si reinicia el monedero)",
      bannedUntil: "Vetado hasta {time}"
    },
    blockHeight: "Altura",
    checkTransaction: {
      description:
        "Verificar que los fondos fueron transferidos a un monedero proporcionando el ID de la transacción, la dirección de destino, el mensaje usado para firmar y la firma.\nPara obtener una 'Prueba de Gasto' no es necesario proporcionar la dirección de destino.",
      infoTitles: {
        confirmations: "Confirmaciones",
        inPool: "En el grupo",
        validTransaction: "Transacción válida",
        received: "Cantidad recibida"
      },
      validTransaction: {
        no: "NO",
        yes: "SÍ"
      }
    },
    closing: "Cerrando",
    connectingToBackend: "Conectando con el servicio",
    contribution: "Contribución",
    daemon: {
      local: {
        title: "Solo Servicio Local",
        description:
          "Seguridad completa. Se descargará la cadena de bloques entera. No podrá operar hasta que finalice el proceso de sincronización."
      },
      localRemote: {
        title: "Servicio Local + Remoto",
        description:
          "Empiece a operar rápidamente gracias a esta opción predeterminada. Se descargará la cadena de bloques al completo pero se usará un nodo remoto mientras dure la descarga."
      },
      remote: {
        title: "Solo Servicio Remoto",
        description:
          "Menor seguridad. El monedero se conectará a un nodo remoto para realizar cualquier operación."
      }
    },
    destinationUnknown: "Destino Desconocido",
    editAddressBookEntry: "Modificar un registro de la libreta de direcciones",
    loadingSettings: "Cargando configuración",
    oxenBalance: "Saldo",
    oxenUnlockedBalance: "Saldo libre",
    oxenUnlockedShort: "Libre",
    noTransactionsFound: "No se han encontrado transacciones",
    notes: "Notas",
    numberOfUnspentOutputs: "Número de salidas no gastadas",
    paymentID: "ID de pago",
    priorityOptions: {
      automatic: "Automática",
      slow: "Lenta",
      normal: "Normal",
      fast: "Rápida",
      fastest: "La más rápida",
      flash: "destello"
    },
    peerList: "Lista de pares",
    proveTransactionDescription:
      "Generar una prueba de sus pagos recibidos/emitidos proporcionando el ID de la transacción, la dirección destinataria y un mensaje opcional.\nPara pagos emitidos, puede obtener una 'Pueba de Gasto' que certifica la autoría de la transacción. En este caso, no es necesario indicar la dirección destinataria.",
    readingWalletList: "Leyendo el listado de monederos",
    recentIncomingTransactionsToAddress:
      "Transacciones recientes recibidas en esta dirección",
    recentTransactionsWithAddress: "Transacciones recientes con esta dirección",
    rescanModalDescription:
      "Escoja entre un examen completo o examinar solo las salidas gastadas.",
    saveSeedWarning: "¡Por favor, cópielas y guárdelas en un sitio seguro!",
    saveToAddressBook: "Guardar en la libreta de direcciones",
    seedWords: "Palabras semilla",
    selectLanguage: "Escoja un idioma",
    masterNodeRegistrationDescription:
      'Introduzca la orden {registerCommand} generada por el servicio (beldexd) que se está intentado registrar como Nodo de Servicio usando la instrucción "{prepareCommand}"',
    spendKey: "Clave de gasto",
    startingDaemon: "Iniciando servicio",
    startingWallet: "Iniciando monedero",
    switchToDateSelect: "Cambiar a selección por fecha",
    switchToHeightSelect: "Cambiar a selección por altura",
    transactionID: "ID de la transacción",
    transactionConfirmed: "confirmada",
    transactions: {
      amount: "Cantidad",
      description: "Transacción {type}",
      fee: "Comisión",
      paidBySender: "pagada por el remitente",
      received: "Recibida",
      sent: "Enviada",
      sentTo: "Transacción {type} enviada a",
      timestamp: "Fecha y hora",
      types: {
        all: "Todas",
        incoming: "Recibir",
        outgoing: "Enviado",
        pending: "Pendiente",
        pendingIncoming: "Recibida pendiente",
        pendingOutgoing: "Emitida pendiente",
        miner: "Minería",
        masterNode: "Nodo de Servicio",
        governance: "Gobernanza",
        bns: "Bns",
        stake: "Participación retenida",
        failed: "Fallida"
      }
    },
    unspentOutputs: "Salidas no gastadas",
    userNotUsedAddress: "No ha utilizado esta dirección",
    userUsedAddress: "Ha utilizado esta dirección",
    viewKey: "Clave de visualización",
    viewOnlyMode:
      "Este monedero solo permite visualizar operaciones. Por favor, abra uno completo para poder transferir fondos.",

    // new design revamp
    fromBlockHeight: "From Blockheight"
  },
  titles: {
    addressBook: "Libreta de direcciones",
    addressDetails: "Detalles de la dirección",
    contactBook: "Libreta de contactos",

    advanced: {
      checkTransaction: "COMPROBAR TRANSACCIÓN",
      prove: "PRUEBA",
      signAndVerify: "Firmar/Verificar",

      sign: "firmar",
      verify: "Verificar"
    },
    changePassword: "Modificar contraseña",
    configure: "Ajustes de configuración",
    currentlyStakedNodes: "Nodos en los que actualmente participa",
    importFromFile: "Importar desde archivo",
    privateKeys: "Claves privadas",
    rescanWallet: "Volver a examinar monedero",
    restoreFromSeed: "Restaurar desde semilla",

    masterNode: {
      registration: "REGISTRO",
      staking: "PARTICIPACIÓN",
      myStakes: "Mis apuestas"
    },
    settings: {
      title: "Configuración",
      tabs: {
        general: "General",
        language: "Idioma",
        peers: "Pares"
      }
    },
    transactionDetails: "Detalles de la transacción",
    transactions: "Transacciones",
    wallet: {
      createNew: "Crear un monedero nuevo",
      createdOrRestored: "Monedero creado/restaurado",
      walletRestored: "Monedero restaurado",
      walletCreated: "Monedero creado",
      walletImported: "Cartera importada",
      importFromFile: "Importar monedero de un archivo",
      useExistingWallet: "Use Existing Wallet",
      importFromLegacyGUI: "Importar monedero de una interfaz gráfica heredada",
      importFromOldGUI: "Importar monedero de una interfaz gráfica antigua",
      restoreFromSeed: "Restaurar monedero mediante semilla",
      restoreViewOnly: "Restaurar monedero de solo visualización"
    },
    chooseLanguage: "Elige lengua",
    yourWallets: "Sus Monederos",
    swap: {
      swap: "Intercambio",
      exchange: "Intercambio",
      history: "Historia",
      unsupportedpair: "Par de intercambio no admitido",
      minimumAmt: "La cantidad mínima es",
      maximumAmt: "La cantidad máxima es",
      transactionDetails: "Detalles de la transacción",
      youSend: "Usted envía",
      exchangeRate: "Tipo de cambio",
      fixedRate: "Tipo de interés fijo",
      fixedRateUpdateSec: "La tarifa fija se actualiza cada 30 segundos.",
      serviceFee: "Tarifa de servicio 0,25%",
      fees: "Honorarios",
      allTheFees: "Todos los honorarios incluidos en la tarifa.",
      networkFee: "Tarifa de red",
      youGet: "Usted obtiene",
      floatingExchangeRate: "Tipo de cambio flotante",
      fixedExchangeRate: "Tipo de cambio fijo",
      stillProcessing:
        "Su transacción anterior aún se está procesando. Puedes crear uno nuevo en 15 minutos.",
      minimumExchangeAmtAbove: "El monto mínimo de cambio está por encima",
      for: "para",
      maximumExchangeAmtUnder: "El importe máximo de cambio está por debajo",
      floatingRateDisc:
        "La tasa flotante puede cambiar en cualquier momento debido a las condiciones del mercado, por lo que es posible que reciba más o menos criptomonedas de lo esperado.",
      fixedRateExactAmtDisc:
        "Con la tasa fija, recibirás la cantidad exacta de criptomonedas que ves en esta pantalla.",
      walletAddress: "Dirección de billetera",
      myWalletRequire: "mi billetera requiere",
      agreeWith: "estoy de acuerdo con",
      termOfUse: "Condiciones de uso",
      and: "y",
      privacyPolicy: "política de privacidad",
      checkout: "Verificar",
      blockchain: "cadena de bloques",
      exchangefee: "Tarifa de cambio",
      exchangeFeeIncluded:
        "La tarifa de cambio ya está incluida en el monto mostrado que recibirás",
      networkFeeIncluded:
        "La tarifa de red ya está incluida en el monto mostrado que recibirás",
      guaranteeFee: "Tarifa Garantizada",
      refundAddress: "Dirección de reembolso",
      exchanging: "Intercambio",
      confirmingProcess: "Confirmando en progreso",
      Once: "Una vez",
      confirmedInBlockchain:
        "está confirmado en la cadena de bloques, comenzaremos a intercambiarlo con",
      seenInputExplorer: "Ver hash de entrada en el explorador",
      to: "a",
      pleaseWait: "El proceso tardará unos minutos. espere por favor.",
      sendFundsToWallet: "Enviar fondos a su billetera",
      waitHere: "No tienes que esperar aquí.",
      newTransaction: "Puede iniciar una nueva transacción.",
      checkStatus:
        "Siempre puedes verificar el estado de esta transacción en transacción",
      // history: "history",
      transactionPreview: "Vista previa de la transacción",
      transactionID: "ID de transacción",
      changellyAddress: "dirección cambiante",
      completed: "Terminada",
      amountTo: "Cantidad a",
      amountReceived: "Cantidad recibida",
      amountSend: "Cantidad enviada",
      inputHash: "hash de entrada",
      outputHash: "Hash de salida",
      amountFrom: "Cantidad de",
      paymentNotReceived:
        "Los fondos no se recibieron en 3 horas. Por favor verifique las tarifas y cree una nueva transacción",
      downloadCsv: "Descargar CSV",
      status: "Estado",
      date: "fechas",
      exchangeAmount: "Monto del cambio",
      receiver: "Receptor",
      sendFundDisc: "Envíe fondos a la siguiente dirección",
      timeLeft: "Tiempo restante para enviar",
      guaranteedRateDisc: "La tarifa garantizada ha sido cancelada",
      sendFundsAboveAddress:
        "Tenga en cuenta que solo puede enviar fondos a la dirección anterior",
      once: "una vez",
      swapMaintenance: "El intercambio está temporalmente en mantenimiento",
      tryAgainSomeTimes:
        "Por favor, inténtalo de nuevo después de algunas veces.",
      afterYourFirstTxn: "Después de su primera transacción",
      youWillBeViewHere: "Lo podrás ver aquí",
      openHistory: "Historia Abierta",
      newTransactionBtn: "Nueva transacción",
      exchangePair: "Par de intercambio",
      exchangePairDisc: "Establecer el par de intercambio preferido",
      walletAddressDisc:
        "Complete los detalles de la dirección de la billetera criptográfica",
      payment: "Pago",
      paymentDisc: "Deposite el monto requerido para el cambio.",
      exchangeDisc: "Espere a que se complete su transacción",
      paymentConfirm: "Confirm & Make payment"
    }
  }
};
