export default {
  buttons: {
    // All button text is uppercased in the gui
    advanced: "ADVANCED",
    addAddressBook: "Adicionar ao catálogo de endereços",
    addWallet: "Adicionar Carteira",

    all: "TUDO",
    back: "ATRÁS",
    browse: "PESQUISAR",
    cancel: "CANCELAR",
    change: "MUDAR",
    check: "Verificar",
    clear: "clear",
    clearAll: "Limpar tudo",
    close: "FECHAR",
    contacts: "CONTACTOS",
    copy: "cópia de",
    copyAddress: "COPIAR ENDEREÇO",
    copySignature: "COPY SIGNATURE",
    createWallet: "CRIAR CARTEIRA",
    delete: "APAGAR",
    edit: "EDITAR",
    editNotes: "Editar notas",

    export: "EXPORTAR",
    fromBlockheight: "Da altura do bloco",

    generate: "Gerar",
    import: "IMPORTAR",
    importWallet: "IMPORTAR CARTEIRA | IMPORTAR CARTEIRAS",
    min: "mín",
    max: "máx.",
    next: "PRÓXIMO",
    openWallet: "ABRIR CARTEIRA",
    receive: "RECEBER",
    registerMasterNode: "REGISTAR NÓDULO DE SERVIÇO",
    rescan: "REEXAMINAR",
    restoreWallet: "RESTAURAR CARTEIRA",
    refresh: "Atualizar",
    save: "SALVAR",
    saveTxNotes: "SALVAR NOTAS DE TX",
    selectLocation: "SELECIONAR LOCAL",
    selectWalletFile: "SELECIONAR FICHEIRO DA CARTEIRA",
    send: "ENVIAR",
    sendCoins: "ENVIAR MOEDAS",
    masterNode: "NÓDULO DE SERVIÇO",
    settings: "CONFIGURAÇÕES",
    showQRCode: "MOSTRAR CÓDIGO QR",
    showTxDetails: "Detalhes TXN",
    stake: "PARTICIPAÇÃO",
    sweepAll: "VARRER TUDO",
    unlock: "UNLOCK",
    viewOnExplorer: "VISUALIZAR NO EXPLORADOR",
    add: "Adicionar",
    bnsUpdate: "Atualização do BNS",
    bnsRenew: "Renovação do BNS"
  },
  dialog: {
    // Generic buttons
    buttons: {
      ok: "OK",
      cancel: "CANCELAR",
      open: "ABRIR"
    },

    // Dialogs
    banPeer: {
      title: "Banir pares",
      peerDetailsTitle: "Detalhes dos pares",
      message:
        "Introduzir duração para banir pares, em segundos.\nDefault 3600 = 1 hora.",
      ok: "Banir par"
    },
    copyAddress: {
      title: "Copiar endereço",
      message:
        "Existe um id de pagamento associado a este endereço.\nTenha a certeza de copiar este id de pagamanto separadamente."
    },
    copyPrivateKeys: {
      // Copy {seedWords/viewKey/spendKey}
      title: "Copiar {type}",
      message:
        "Tenha cuidado a quem envia as suas chaves privadas, pois elas controlam os seus fundos.",
      seedWords: "Palavras Semente",
      viewKey: "Chave de Visualização",
      spendKey: "Chave de Gasto"
    },
    deleteWallet: {
      title: "Apagar carteira",
      message: "Tem certeza de que deseja excluir a carteira atual?",
      ok: "APAGAR"
    },
    exit: {
      title: "Sair",
      message: "Tem certeza de que deseja sair da carteira?",
      ok: "SAIR"
    },
    keyImages: {
      title: "{type} imagens chave",
      message: "Quer {type} imagens chave?",
      export: "Exportar",
      import: "Importar"
    },
    noPassword: {
      title: "Nenhum palavra-passe definida",
      message: "Tem a certeza que deseja criar uma carteira sem palavra-passe?",
      ok: "SIM"
    },
    password: {
      title: "Digite sua senha da carteira",
      message: "Introduza a sua palavra-passe para continuar"
    },
    registerMasterNode: {
      title: "Registar um nódulo de serviço",
      message: "Pretende registar um nódulo de serviço?",
      ok: "REGISTAR"
    },
    rescan: {
      title: "Reexaminar carteira",
      message:
        "Aviso: Algumas informações acerca de transações passadas serão perdidas,\ntal como o endereço dos recipientes que serão perdidos.",
      ok: "REEXAMINAR"
    },
    restart: {
      title: "Reiniciar",
      message: "Alterações requerem um reiniciar. Quer reiniciar agora?",
      ok: "Reiniciar"
    },
    showPrivateKeys: {
      title: "Mostrar chaves privadas",
      message: "Deseja ver as suas chaves privadas?",
      ok: "MOSTRAR"
    },
    stake: {
      title: "Participação num nódulo de serviço",
      message: "Deseja participar num nódulo de serviço?",
      ok: "Participação"
    },
    sweepAll: {
      title: "Varrer Tudo",
      message: "Quer realmente varrer tudo?",
      ok: "VARRER TUDO"
    },
    sweepAllWarning: {
      title: "Sweep all warning",
      message:
        "You are about to combine all of your unspent funds by sending a transaction to yourself, your wallet may show a balance of 0 temporarily, after 10 blocks your funds will unlock and you may stake normally.",
      ok: "CONTINUE"
    },
    switchWallet: {
      title: "Mudar de carteira",
      closeMessage: "Tem a certeza que deseja fechar a carteira actual?",
      restartWalletMessage:
        "Tem certeza de que deseja fechar e reiniciar a carteira?",
      restartMessage:
        "A carteira RPC está correntemente em sincronização. \nISe deseja mudar de carteira terá de reiniciar a aplicação. \nPerderá o progresso da sincronização e terá de reexaminar o blockchain."
    },
    transactionDetails: {
      title: "Detalhes das transações",
      ok: "FECHAR"
    },
    transfer: {
      title: "Transferir",
      message: "Deseja enviar a transação?",
      ok: "ENVIAR"
    },
    unlockConfirm: {
      title: "Confirmar desbloqueamento",
      ok: "DESBLOQUEAR"
    },
    unlockMasterNode: {
      title: "Desbloquear nódulo de serviço",
      confirmTitle: "Confirmar desbloqueio",
      message: "Deseja desbloquear o nódulo de serviço?",
      ok: "DESBLOQUEAR"
    },
    unlockMasterNodeWarning: {
      title: "Unlock master node warning",
      message:
        "Unlocking a partial stake in a node will also unstake for any other participants, if staking in a shared node its best to let the operator and other participants know you are unstaking.",
      ok: "CONTINUE"
    }
  },
  fieldLabels: {
    // Field labels are also all uppercased
    address: "Endereço",
    recipientAddress: "Endereço do destinatário",
    amount: "QUANTIDADE",
    confirmPassword: "CONFIRMAR PALAVRA-PASSE",
    daemonLogLevel: "NÍVEL DE LOG PARA O SERVIÇO",
    daemonP2pPort: "PORTA P2P DO SERVIÇO",
    dataStoragePath: "DIRECTÓRIO DE ARMAZENAMENTO DOS DADOS",
    data: "Data",
    filter: "Filter",
    filterTransactionType: "FILTRAR POR TIPO DE TRANSAÇÃO",
    internalWalletPort: "PORTA INTERNA DA CARTEIRA",
    keyImages: {
      exportDirectory: "DIRETORIA DE EXPORTAÇÃO DAS CHAVES DE IMAGEM",
      importFile: "FICHEIRO DE IMPORTAÇÃO DAS CHAVES DE IMAGEM"
    },
    limitDownloadRate: "LIMITAR VELOCIDADE DE DOWNLOAD",
    limitUploadRate: "LIMITE DA VELOCIDADE DE UPLOAD",
    localDaemonIP: "IP LOCAL DO SERVIÇO",
    localDaemonPort: "PORTA LOCAL DO SERVIÇO",
    maxIncomingPeers: "NÚM. MAX DE PARES DE ENTRADA",
    maxOutgoingPeers: "NUM. MAX DE PARES DE SAÍDA",
    message: "Mensagem",
    mnemonicSeed: "SEMENTE MNEMÓNICA",
    name: "NOME",
    newWalletName: "NOME DA NOVA CARTEIRA",
    notes: "NOTAS",
    addressBookNotes: "Notas do livro de endereços",
    optional: "OPCIONAL",
    password: "PALAVRA-PASSE",
    paymentId: "ID DE PAGAMENTO",
    priority: "PRIORIDADE",
    remoteNodeHost: "NÓDULO HÓSPEDE REMOTO",
    remoteNodePort: "PORTA REMOTA DO NÓDULO",
    restoreFromBlockHeight: "RESTAURE DESDE ALTURA DO BLOCO",
    restoreFromDate: "RESTAURAR DESDE DATA",
    seedLanguage: "LINGUA DA SEMENTE",
    masterNodeCommand: "COMANDO DO NÓDULO DE SERVIÇO",
    masterNodeKey: "CHAVE DO NÓDULO DE SERVIÇO",
    signature: "Assinatura",
    totalBalance: "Balanço total",
    to: "Para",
    transactionId: "ID da transação",
    walletFile: "FICHEIRO DA CARTEIRA",
    walletLogLevel: "NIVEL DE LOG DA CARTEIRA",
    walletName: "NOME DA CARTEIRA",
    walletRPCPort: "PORTA RPC DA CARTEIRA",
    walletStoragePath: "DIRECTORIA DE SALVAMENTO DA CARTEIRA",

    // These are specific labels which do not get uppercased
    confirmNewPassword: "Confirmar Nova Palavra-Passe",
    newPassword: "Nova Palavra-Passe",
    oldPassword: "Antiga Palavra-Passe",
    rescanFullBlockchain: "Reexaminar o blockchain completo",
    rescanSpentOutputs: "Reexaminar saídas gastas",
    transactionNotes: "Notas de Transações",
    chooseNetwork: "Seleccione uma Rede",
    network: "Rede",

    // new design revamp

    OwnerWalletaddress: "Endereço da carteira do proprietário",
    backupOwnerWalletAddress: "Endereço da carteira do proprietário de backup",
    updateOwner: "Atualizar proprietário",
    updateValues: "Atualizar valores"
  },
  footer: {
    ready: "Pronto",
    scanning: "Examinando",
    status: "Estado",
    syncing: "SINCRONIZANDO",
    remote: "Remoto",
    wallet: "Carteira"
  },
  menuItems: {
    about: "Sobre",
    changePassword: "Alterar Palavra-Passe",
    copyAddress: "Copiar Endereço",
    copySeed: "Copiar Semente",
    copyQR: "Copiar código QR",
    copySeedWords: "Copiar palavras semente",
    copySpendKey: "Copiar chave de gasto",
    copyMasterNodeKey: "Copy master node key",
    copyTransactionId: "Copira ID da transação",
    copyViewKey: "Copiar chave de visualização",
    createNewWallet: "Criar nova carteira",
    deleteWallet: "Apagar carteira",
    exit: "Saír da Carteira GUI Beldex",
    importOldGUIWallet: "Importar carteiras da antiga carteira GUI",
    manageKeyImages: "Administrar Imagens de Chave",
    openWallet: "Abrir carteira",
    rescanWallet: "Reexaminar Carteira",
    restoreWalletFile: "Restaurar carteira a partir de ficheiro",
    restoreWalletSeed: "Restaurar carteira a partir da semente",
    saveQR: "Salvar código QR para um ficheiro",
    sendToThisAddress: "Enviar para este endereço",
    settings: "Configurações",
    showDetails: "Mostrar detalhes",
    showPrivateKeys: "Mostrar Chaves Privadas",
    showQRCode: "Mostrar Código QR",
    switchWallet: "Mudar de Carteira",
    viewOnExplorer: "Visualizar no explorador"
  },
  notification: {
    positive: {
      addressCopied: "Copiar endereço para o clipboard",
      bannedPeer: "{host} banido até {time}",
      copied: "{item} copiado para o clipboard",
      itemSaved: "{item} salvado em {filename}",
      keyImages: {
        exported: "Imagens de Chave exportadas para {filename}",
        imported: "Imagens de Chave importadas"
      },
      passwordUpdated: "Palavra-Passe actualizada",
      qrCopied: "Código QR ccopiado para o clipboard",
      registerMasterNodeSuccess: "Nódulo de serviço registado com sucesso",
      sendSuccess: "Transação enviada com sucesso.",
      signatureCopied: "Signature copied to clipboard",
      stakeSuccess: "Participação com sucesso",
      transactionNotesSaved: "A nota de transação foi salva"
    },
    errors: {
      banningPeer: "Erro ao banir par",
      cannotAccessRemoteNode:
        "Não foi possível aceder ao nódulo remoto, por favor experimente outro nódulo remoto",
      changingPassword: "Erro ao alterar palabra-passe",
      copyWalletFail: "Cópia da carteira falhou",
      copyingPrivateKeys: "Erro ao copiar as chaves privadas",
      dataPathNotFound: "Directoria de armazenamento de dados não encontrada",
      differentNetType: "Nódulo remoto está usando um tipo de rede diferente",
      enterSeedWords: "Introduzir palavras semente",
      enterTransactionId: "Enter transaction ID",
      enterTransactionProof: "Enter transaction proof",
      enterWalletName: "Introduza o nome da carteira",
      errorSavingItem: "Erro salvando {item}",
      failedMasterNodeUnlock: "Falhou o desbloqueamento do nódulo de serviço",
      failedToSetLanguage: "Falhou mudança de língua: {lang}",
      failedWalletImport: "Falhou importação da carteira",
      failedWalletOpen: "Falhou abertura da carteira. Por favor tente de novo.",
      internalError: "Erro interno",
      invalidAddress: "Endereço não válido",
      invalidAmount: "Quantidade não válida",
      invalidOldPassword: "Palavra-passe antiga inválida",
      invalidPassword: "Palavra-passe inválida",
      invalidPaymentId: "ID de pagamento inválido",
      invalidPrivateViewKey: "Chave de visualização privada inválida",
      invalidPublicAddress: "Endereço público inválido",
      invalidRestoreDate: "Data de restauro inválido",
      invalidRestoreHeight: "Altura de restauro inválido",
      invalidSeedLength: "Comprimento da palavra semente inválido",
      invalidMasterNodeCommand:
        "Por favor introduza o comando de registro do nódulo de serviço",
      invalidMasterNodeKey: "Chave do nódulo de serviço inválido",
      invalidWalletPath: "Caminho da carteira inválido",
      keyImages: {
        exporting: "Erro ao exportar as chaves de imagem",
        reading: "Erro ao ler as chaves de imagem",
        importing: "Erro ao importar as chaves de imagem"
      },
      negativeAmount: "Quantidade não pode ser negativa",
      newPasswordNoMatch: "Nova palavra-passe não coincide",
      newPasswordSame:
        "Não é possível usar a senha antiga. Defina uma senha diferente",
      passwordFieldEmpty: "Por favor, insira sua senha!",
      notEnoughBalance: "Não existe saldo desbloqueado suficiente",
      passwordNoMatch: "Palavra-passe não coincidem",
      remoteCannotBeReached: "Não é possivel contactar o nódulo Remoto",
      selectWalletFile: "Seleccione um ficheiro de carteira",
      unknownError: "Ocorreu um error desconhecido",
      walletAlreadyExists: "Carteira com esse nome já existe",
      walletPathNotFound:
        "Caminho de armazenamento dos dados da carteira não encontrado",
      zeroAmount: "Quantidade tem de ser superior a zero"
    },
    warnings: {
      noKeyImageExport: "Nenhuma chave de imagem encontrada para exportar",
      usingLocalNode:
        "Não foi possível aceder ao nódulo remoto, mudando para nódulo local apenas",
      usingRemoteNode: "beldexd não encontrado, utilizando nódulo remoto"
    }
  },
  placeholders: {
    additionalNotes: "Notas adicionais",
    addNotesOptional: "Adicionar notas (opcional)",
    addressBookName: "Nome que pertence a este endereço",
    addressOfSigner: "Endereço público da carteira do signatário",
    beldexAddress: "Enter Address or BNS Name",
    enterAddress: "Insira o endereço",
    enterName: "Insira o nome",
    enteroldPassword: "Digite a senha antiga",
    enterNewPassword: "Insira a nova senha",
    reEnterPassword: "Digite novamente a senha",
    filterTx: "Digite um ID, nome, endereço ou valor",
    hexCharacters: "{count} caracteres hexadecimais",
    mnemonicSeed: "25 (or 24) palavras semente mnemónicas",
    pasteTransactionId: "Paste transaction ID",
    pasteTransactionProof: "Colar prova de transação",
    dataToSign: "Data you want to sign with your primary address's private key",

    proveOptionalMessage:
      "Mensagem opcional contra a qual a assinatura é assinada",
    recipientWalletAddress: "Endereço da carteira do destinatário",
    reEnterWalletPassword: "Digite novamente a senha",
    selectAFile: "Por favor selecione um ficheiro",
    signature: "Assinatura para verificar",

    transactionNotes: "Notas adicionais para anexar à transação",
    walletName: "Um nome para a sua carteira",
    walletPassword: "Uma palavra-passe opcional para a carteira"
  },
  strings: {
    addAddressBookEntry: "Adicionar registo ao livro de endereços",
    addressBookDetails: "Detalhes do livro de endereço",
    addressBookIsEmpty: "Livro de endereço vazio",
    addresses: {
      myPrimaryAddress: "Meu endereço primario",
      myUnusedAddresses: "Meus endereços não utilizados",
      myUsedAddresses: "Meus endereços utilizados",
      // primaryAddress: "Endereço primario",
      subAddress: "Sub-endereço",
      subAddressIndex: "Índice {index}",
      primaryAccount: "Conta primária"
    },
    advancedOptions: "Opções Avançadas",
    bannedPeers: {
      title: "Pares banidos (banimento serão anulados ao reiniciar a carteira)",
      bannedUntil: "Banido até {time}"
    },
    blockHeight: "Altura",
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
    closing: "Fechando",
    connectingToBackend: "Conectado ao backend",
    contribution: "Contribution",
    daemon: {
      local: {
        title: "Serviço Local Apenas",
        description:
          "Segurança total, a carteira irá baixar o blockchain completo. Não será capaz de transaccionar até a sincronização completar."
      },
      localRemote: {
        title: "Serviço Local + Remoto",
        description:
          "Comece rápidamente com esta opção padrão. A carteira irá baixar o blockchain completo, mas usar um nódulo remoto enquanto sincroniza."
      },
      remote: {
        title: "Serviço Remoto Apenas",
        description:
          "Menos segurança, a carteira irá conectar a um nódulo remoto para todas as transações."
      }
    },
    destinationUnknown: "Destino Desconhecido",
    editAddressBookEntry: "Editar registo do livro de endereços",
    loadingSettings: "Carregando configurações",
    oxenBalance: "Saldo",
    oxenUnlockedBalance: "Saldo desbloqueado",
    oxenUnlockedShort: "Desbloqueado",
    noTransactionsFound: "Nenhuma transação encontrada",
    notes: "Notas",
    numberOfUnspentOutputs: "Número de outputs não gastos",
    paymentID: "ID de Pagamento",
    peerList: "Lista de pares",
    priorityOptions: {
      automatic: "Automatico",
      slow: "Lento",
      normal: "Normal",
      fast: "Rápido",
      fastest: "O Mais Rápido",
      flash: "clarão"
    },
    proveTransactionDescription:
      "Generate a proof of your incoming/outgoing payment by supplying the transaction ID, the recipient address and an optional message.\nFor the case of outgoing payments, you can get a 'Spend Proof' that proves the authorship of a transaction. In this case, you don't need to specify the recipient address.",
    readingWalletList: "Lendo lista da carteira",
    recentIncomingTransactionsToAddress: "Transações de entrada neste endereço",
    recentTransactionsWithAddress: "Transações recentes neste endereço",
    rescanModalDescription:
      "Seleccione examinação completa ou examinação de outputs gastos apenas.",
    saveSeedWarning: "Por favor copie e salve estes num lugar seguro!",
    saveToAddressBook: "Salvar para o livro de endereço",
    seedWords: "Palavras semente",
    selectLanguage: "Selecione língua",
    masterNodeRegistrationDescription:
      'Introduza o {registerCommand} commando produzido pelo serviço que está se registando para se tornar un Nódulo de Serviço utilizando o commando "{prepareCommand}" ',
    spendKey: "Chave de gasto",
    startingDaemon: "Começando serviço",
    startingWallet: "Começando carteira",
    switchToDateSelect: "Mudar para data de seleção",
    switchToHeightSelect: "Mudar para altura de seleção",
    transactionID: "ID da Transação",
    transactionConfirmed: "confirmado",
    transactions: {
      amount: "Quantidade",
      description: "{type} transação",
      fee: "Taxa",
      paidBySender: "pago por remetente",
      received: "Recebido",
      sent: "Enviado",
      sentTo: "{type} transacão enviada a",
      timestamp: "Data e hora",
      types: {
        all: "Todos",
        incoming: "Receber",
        outgoing: "Enviado",
        pending: "Pendentes",
        pendingIncoming: "Entradas pendentes",
        pendingOutgoing: "Saídas pendentes",
        miner: "Mineiro",
        masterNode: "Nódulo de Serviço",
        governance: "Governança",
        bns: "Bns",
        stake: "Participação",
        failed: "Falhou"
      }
    },
    unspentOutputs: "Outputs não-gastos",
    userNotUsedAddress: "Não utilizou este endereço",
    userUsedAddress: "Já utilizou este endereço",
    viewKey: "Chave de visualização",
    viewOnlyMode:
      "Modo de visualização apenas. Por favor carregue a carteira completa para poder enviar moedas."
  },
  titles: {
    addressBook: "Livro de endereços",
    addressDetails: "Detalhes do endereço",
    contactBook: "Agenda de contatos",

    advanced: {
      checkTransaction: "Verificar Transação",
      prove: "provar",
      signAndVerify: "Assinar/Verificar",

      sign: "Sinal",
      verify: "Verificar"
    },
    changePassword: "Mudar palavra-passe",
    configure: "Definições de configuração",
    currentlyStakedNodes: "Currently staked nodes",
    importFromFile: "Importar do arquivo",
    privateKeys: "Chaves privadas",
    rescanWallet: "Reexaminar carteira",
    restoreFromSeed: "Restaurar da semente",

    masterNode: {
      registration: "REGISTO",
      staking: "PARTICIPAÇÃO",
      myStakes: "Minhas apostas"
    },
    settings: {
      title: "Configurações",
      tabs: {
        general: "Geral",
        language: "Língua",
        peers: "Pares"
      }
    },
    transactionDetails: "Detalhes das transações",
    transactions: "Transações",
    wallet: {
      createNew: "Criar nova carteira",
      createdOrRestored: "Carteira criada/restaurada",
      walletRestored: "Carteira Restaurada",
      walletCreated: "Carteira criada",
      walletImported: "Carteira importada",
      importFromFile: "Importar carteira a partir de ficheiro",
      useExistingWallet: "Use Existing Wallet",
      importFromLegacyGUI:
        "Importar carteira a partir da antiga carteira GUI (legado)",
      importFromOldGUI: "Importar carteira a partir da antiga carteira GUI",
      restoreFromSeed: "Restaurar carteira a partir de semente",
      restoreViewOnly: "Restaurar carteira visualização-apenas"
    },
    chooseLanguage: "Escolha o seu idioma",
    yourWallets: "Suas carteiras",
    swap: {
      swap: "Trocar",
      exchange: "Intercâmbio",
      history: "História",
      unsupportedpair: "Par de exchanges não suportado",
      minimumAmt: "O valor mínimo é",
      maximumAmt: "O valor máximo é",
      transactionDetails: "Detalhes da transação",
      youSend: "Você envia",
      exchangeRate: "Taxa de câmbio",
      fixedRate: "Taxa fixa",
      fixedRateUpdateSec: "A taxa fixa é atualizada a cada 30 segundos",
      serviceFee: "Taxa de serviço 0,25%",
      fees: "Tarifas",
      allTheFees: "Todas as taxas incluídas na tarifa",
      networkFee: "Taxa de rede",
      youGet: "Você consegue",
      floatingExchangeRate: "Taxa de cambio flutuante",
      fixedExchangeRate: "Taxa de câmbio fixa",
      stillProcessing:
        "Sua transação anterior ainda está em processamento. Você pode criar um novo em 15 minutos",
      minimumExchangeAmtAbove: "O valor mínimo de troca está acima",
      for: "para",
      maximumExchangeAmtUnder: "O valor máximo de troca está abaixo",
      floatingRateDisc:
        "A taxa flutuante pode mudar a qualquer momento devido às condições do mercado, portanto você poderá receber mais ou menos criptografia do que o esperado.",
      fixedRateExactAmtDisc:
        "Com a taxa fixa, você receberá a quantidade exata de criptografia que vê nesta tela.",
      walletAddress: "Endereço da carteira",
      myWalletRequire: "Minha carteira exige",
      agreeWith: "Eu concordo com",
      termOfUse: "Termos de uso",
      and: "e",
      privacyPolicy: "política de Privacidade",
      checkout: "Confira",
      blockchain: "blockchain",
      exchangefee: "Taxa de câmbio",
      exchangeFeeIncluded:
        "A taxa de troca já está incluída no valor exibido que você receberá",
      networkFeeIncluded:
        "A taxa de rede já está incluída no valor exibido que você receberá",
      guaranteeFee: "Taxa Garantida",
      refundAddress: "Endereço de reembolso",
      exchanging: "Troca",
      confirmingProcess: "Confirmação em andamento",
      Once: "Onças",
      confirmedInBlockchain:
        " for confirmado no blockchain, começaremos a trocá-lo para",
      seenInputExplorer: "Veja o hash de entrada no explorer",
      to: "para",
      pleaseWait: "O processo levará alguns minutos. por favor, aguarde.",
      sendFundsToWallet: "Enviando fundos para sua carteira",
      waitHere: "Você não precisa esperar aqui",
      newTransaction: "Você pode iniciar uma nova transação.",
      checkStatus:
        "Você sempre pode verificar o status desta transação em transação",
      // history: "history",
      transactionPreview: "Visualização da transação",
      transactionID: "ID da transação",
      changellyAddress: "Endereço da mudança",
      completed: "Concluído",
      amountTo: "Valor para",
      amountReceived: "Montante recebido",
      amountSend: "Quantidade enviada",
      inputHash: "Hash de entrada",
      outputHash: "Hash de saída",
      amountFrom: "Valor de",
      paymentNotReceived:
        "Os fundos não foram recebidos em 3 horas. Verifique as taxas e crie uma nova transação",
      downloadCsv: "Baixar CSV",
      status: "Status",
      date: "Data",
      exchangeAmount: "Valor de troca",
      receiver: "Receptor",
      sendFundDisc: "Envie fundos para o endereço abaixo",
      timeLeft: "Tempo restante para enviar",
      guaranteedRateDisc: "A taxa garantida foi encerrada",
      sendFundsAboveAddress:
        "Observe que você só pode enviar fundos para o endereço acima",
      once: "uma vez",
      swapMaintenance: "Swap está temporariamente em manutenção",
      tryAgainSomeTimes: "Por favor, tente novamente depois de alguns momentos",
      afterYourFirstTxn: "Após sua primeira transação",
      youWillBeViewHere: "você poderá vê-lo aqui",
      openHistory: "Abrir histórico",
      newTransactionBtn: "Nova transação",
      exchangePair: "Par de troca",
      exchangePairDisc: "Defina o par de exchange preferido",
      walletAddressDisc:
        "Preencha os detalhes do endereço da carteira criptografada",
      payment: "Pagamento",
      paymentDisc: "Deposite o valor necessário para a troca",
      exchangeDisc: "Aguarde até que sua transação seja concluída",
      paymentConfirm: "Confirmar y realizar el pago"
    }
  }
};
