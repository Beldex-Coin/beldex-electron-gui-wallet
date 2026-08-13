export default {
  buttons: {
    advanced: "Avançado",
    addAddressBook: "Adicionar ao catálogo de endereços",
    addWallet: "Adicionar Carteira",
    all: "TUDO",
    back: "ATRÁS",
    browse: "PESQUISAR",
    cancel: "CANCELAR",
    change: "MUDAR",
    check: "Verificar",
    clear: "Claro",
    clearAll: "Limpar tudo",
    close: "FECHAR",
    contacts: "CONTACTOS",
    copy: "cópia de",
    copyAddress: "COPIAR ENDEREÇO",
    copyData: "Copiar dados",
    copySignature: "COPY SIGNATURE",
    createWallet: "CRIAR CARTEIRA",
    decrypt: "DESCRIPTO",
    addRecord: "Adicionar BNS",
    delete: "APAGAR",
    edit: "EDITAR",
    editNotes: "Editar notas",
    enter: "Digitar",
    export: "EXPORTAR",
    fromBlockheight: "Da altura do bloco",
    generate: "Gerar",
    import: "IMPORTAR",
    importWallet: "IMPORTAR CARTEIRA | IMPORTAR CARTEIRAS",
    bns: "Serviço de Nomes BELDEX",
    min: "mín",
    max: "máx.",
    next: "PRÓXIMO",
    purchase: "Comprar",
    openWallet: "ABRIR CARTEIRA",
    receive: "RECEBER",
    registerMasterNode: "REGISTAR NÓDULO DE SERVIÇO",
    renew: "Renovar",
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
    sign: "Sinal",
    stake: "PARTICIPAÇÃO",
    sweepAll: "VARRER TUDO",
    unlock: "Desbloquear",
    update: "Atualizar",
    verify: "Verificar",
    viewOnExplorer: "VISUALIZAR NO EXPLORADOR",
    add: "Adicionar",
    bnsUpdate: "Atualização do BNS",
    bnsRenew: "Renovação do BNS"
  },
  dialog: {
    // Generic buttons
    buttons: {
      ok: "OK",
      cancel: "Cancelar",
      open: "Abrir"
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
      title: "Copiar {type}",
      message:
        "Tenha cuidado a quem envia as suas chaves privadas, pois elas controlam os seus fundos.",
      seedWords: "Palavras Semente",
      viewKey: "Chave de Visualização",
      spendKey: "Chave de Gasto"
    },
    confirmPurchase: {
      title: "Confirmar compra",
      ok: "Confirmar"
    },
    deleteAddress: {
      title: "Excluir endereço",
      message: "Tem certeza de que deseja excluir este endereço?"
    },
    discardEdit: {
      title: "Tem certeza?",
      message: "Tem certeza de que deseja descartar a edição?",
      ok: "Continuar",
      cancel: "Descartar"
    },
    showMasterNode: {
      title: "Mostrar nó mestre",
      message: "Deseja continuar?",
      masterNode: "Nó mestre"
    },
    deleteWallet: {
      title: "Apagar carteira",
      message: "Tem certeza de que deseja excluir a carteira atual?",
      ok: "Excluir"
    },
    exit: {
      title: "Sair",
      message: "Tem certeza de que deseja sair da carteira?",
      ok: "Sair da carteira"
    },
    keyImages: {
      title: "{type} imagens chave",
      message: "Quer {type} imagens chave?",
      export: "Exportar",
      import: "Importar"
    },
    bnsUpdate: {
      title: "Atualizar registro do BNS",
      message: "Deseja atualizar o registro BNS?",
      ok: "Atualizar"
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
    purchase: {
      title: "Nome da compra",
      message: "Deseja comprar o nome?",
      ok: "Comprar"
    },
    renew: {
      title: "Renovar nome",
      message: "Deseja renovar o nome?",
      ok: "Renovar"
    },
    registerMasterNode: {
      title: "Registar um nódulo de serviço",
      message: "Pretende registar um nódulo de serviço?",
      ok: "Cadastre-se"
    },
    rescan: {
      title: "Reexaminar carteira",
      message:
        "Aviso: Algumas informações acerca de transações passadas serão perdidas,\ntal como o endereço dos recipientes que serão perdidos.",
      ok: "Digitalizar novamente"
    },
    restart: {
      title: "Reiniciar",
      message: "Alterações requerem um reiniciar. Quer reiniciar agora?",
      ok: "Reiniciar"
    },
    showPrivateKeys: {
      title: "Mostrar chaves privadas",
      message: "Deseja ver as suas chaves privadas?",
      ok: "Mostrar"
    },
    stake: {
      title: "Participação num nódulo de serviço",
      message: "Deseja participar num nódulo de serviço?",
      ok: "Participação"
    },
    sweepAll: {
      title: "Varrer Tudo",
      message: "Quer realmente varrer tudo?",
      ok: "Varrer tudo"
    },
    sweepAllWarning: {
      title: "Varrer todos os avisos",
      message:
        "Você está prestes a consolidar todos os seus fundos não gastos enviando uma transação para si mesmo. Sua carteira pode mostrar um saldo de 0 temporariamente. Após 10 blocos, seus fundos serão desbloqueados e você poderá fazer staking normalmente.",
      ok: "Continuar"
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
      ok: "Fechar"
    },
    transfer: {
      title: "Transferir",
      message: "Deseja enviar a transação?",
      ok: "Enviar"
    },
    confirmTransaction: {
      title: "Confirmar envio",
      sendTo: "Enviar para",
      priority: "Prioridade"
    },
    confirmUpdate: {
      title: "Confirmar atualização",
      ok: "Atualizar"
    },
    confirmRenew: {
      title: "Confirmar renovação",
      ok: "Renovar"
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
      title: "Aviso de desbloqueio do nó mestre",
      message:
        "Desbloquear uma participação parcial em um nó também removerá a participação de todos os outros participantes. Se estiver participando de um nó compartilhado, é melhor informar o operador e os outros participantes que você está removendo a participação.",
      ok: "Continuar"
    }
  },
  fieldLabels: {
    // Field labels are also all uppercased
    address: "Endereço",
    recipientAddress: "Endereço do destinatário",
    amount: "QUANTIDADE",
    belnetId: "ID Belnet",
    eth: "ETH",
    backupOwner: "Proprietário de backup",
    confirmPassword: "CONFIRMAR PALAVRA-PASSE",
    daemonLogLevel: "NÍVEL DE LOG PARA O SERVIÇO",
    daemonP2pPort: "PORTA P2P DO SERVIÇO",
    dataStoragePath: "DIRECTÓRIO DE ARMAZENAMENTO DOS DADOS",
    decryptRecord: "Adicionar registro",
    expirationHeight: "Altura de expiração",
    data: "Dados",
    filter: "Filtro",
    filterTransactionType: "FILTRAR POR TIPO DE TRANSAÇÃO",
    internalWalletPort: "PORTA INTERNA DA CARTEIRA",
    keyImages: {
      exportDirectory: "DIRETORIA DE EXPORTAÇÃO DAS CHAVES DE IMAGEM",
      importFile: "FICHEIRO DE IMPORTAÇÃO DAS CHAVES DE IMAGEM"
    },
    limitDownloadRate: "LIMITAR VELOCIDADE DE DOWNLOAD",
    limitUploadRate: "LIMITE DA VELOCIDADE DE UPLOAD",
    bnsType: "TIPO DE REGISTRO BNS",
    localDaemonIP: "IP LOCAL DO SERVIÇO",
    localDaemonPort: "PORTA LOCAL DO SERVIÇO",
    belnetFullAddress: "ENDEREÇO ​​COMPLETO DA BELNET",
    maxIncomingPeers: "NÚM. MAX DE PARES DE ENTRADA",
    maxOutgoingPeers: "NUM. MAX DE PARES DE SAÍDA",
    message: "Mensagem",
    mnemonicSeed: "SEMENTE MNEMÓNICA",
    name: "NOME",
    nameHash: "Hash de nome",
    newWalletName: "NOME DA NOVA CARTEIRA",
    notes: "NOTAS",
    addressBookNotes: "Notas do livro de endereços",
    optional: "OPCIONAL",
    owner: "Proprietário",
    password: "PALAVRA-PASSE",
    paymentId: "ID DE PAGAMENTO",
    priority: "PRIORIDADE",
    remoteNodeHost: "NÓDULO HÓSPEDE REMOTO",
    remoteNodePort: "PORTA REMOTA DO NÓDULO",
    restoreFromBlockHeight: "RESTAURE DESDE ALTURA DO BLOCO",
    restoreFromDate: "RESTAURAR DESDE DATA",
    seedLanguage: "LINGUA DA SEMENTE",
    masterNodeCommand: "COMANDO DO NÓDULO DE SERVIÇO",
    bchatId: "ID do BCHAT",
    masterNodeKey: "CHAVE DO NÓDULO DE SERVIÇO",
    signature: "Assinatura",
    totalBalance: "Saldo total",
    to: "Para",
    transactionId: "ID da transação",
    walletFile: "FICHEIRO DA CARTEIRA",
    walletLogLevel: "NIVEL DE LOG DA CARTEIRA",
    walletName: "NOME DA CARTEIRA",
    walletRPCPort: "PORTA RPC DA CARTEIRA",
    walletStoragePath: "DIRECTORIA DE SALVAMENTO DA CARTEIRA",
    confirmNewPassword: "Confirmar Nova Palavra-Passe",
    newPassword: "Nova Palavra-Passe",
    oldPassword: "Antiga Palavra-Passe",
    rescanFullBlockchain: "Reexaminar o blockchain completo",
    rescanSpentOutputs: "Reexaminar saídas gastas",
    transactionNotes: "Notas de Transações",
    chooseNetwork: "Seleccione uma Rede",
    network: "Rede",
    OwnerWalletaddress: "Endereço da carteira do proprietário",
    backupOwnerWalletAddress: "Endereço da carteira do proprietário de backup",
    updateOwner: "Atualizar proprietário",
    updateValues: "Atualizar valores",
    updateHeight: "Atualizar altura",
    walletAddress: "Endereço da carteira",
    year: "Ano"
  },
  footer: {
    ready: "Pronto",
    scanning: "Examinando",
    status: "Estado",
    syncing: "SINCRONIZANDO",
    remote: "Remoto",
    wallet: "Carteira",
    updateRequired: "ATUALIZAÇÃO NECESSÁRIA"
  },
  menuItems: {
    about: "Sobre",
    changePassword: "Alterar Palavra-Passe",
    copyAddress: "Copiar Endereço",
    copySeed: "Copiar Semente",
    copyBackupOwner: "Copiar proprietário do backup",
    copyBelnetAddress: "Copiar endereço belnet",
    copyBelnetName: "Copiar nome belnet",
    copyName: "Copiar nome",
    copyOwner: "Proprietário da cópia",
    copyQR: "Copiar código QR",
    copySeedWords: "Copiar palavras semente",
    copySpendKey: "Copiar chave de gasto",
    copyMasterNodeKey: "Copy master node key",
    copyTransactionId: "Copira ID da transação",
    copyViewKey: "Copiar chave de visualização",
    createNewWallet: "Criar nova carteira",
    deleteWallet: "Apagar carteira",
    exit: "Sair da carteira",
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
    viewOnExplorer: "Visualizar no explorador",
    favourite: "Favorito"
  },
  notification: {
    positive: {
      addressCopied: "Copiar endereço para o clipboard",
      linkCopied: "Link copiado para a área de transferência",
      backupOwnerCopied:
        "O proprietário do backup copiou para a área de transferência",
      bannedPeer: "{host} banido até {time}",
      copied: "{item} copiado para o clipboard",
      decryptedBNSRecord:
        "Registro BNS descriptografado com sucesso para {name}",
      itemSaved: "{item} salvado em {filename}",
      keyImages: {
        exported: "Imagens de Chave exportadas para {filename}",
        imported: "Imagens de Chave importadas"
      },
      bnsRecordUpdated: "O registro BNS foi atualizado com sucesso",
      belnetAddressCopied: "Endereço completo da Belnet copiado",
      belnetNameCopied: "Nome Belnet copiado",
      passwordUpdated: "Palavra-Passe actualizada",
      namePurchased: "Nome adquirido com sucesso",
      nameRenewed: "Nome renovado com sucesso",
      nameCopied: "Nome copiado para a área de transferência",
      ownerCopied: "O proprietário copiou para a área de transferência",
      qrCopied: "Código QR ccopiado para o clipboard",
      registerMasterNodeSuccess: "Nódulo de serviço registado com sucesso",
      sendSuccess: "Transação enviada com sucesso.",
      masterNodeInfoFilled: "Chave do nó mestre e valor mínimo preenchidos",
      bchatIdCopied: "ID do Bchat copiado para a área de transferência",
      signatureCopied: "Assinatura copiada para a área de transferência",
      signatureVerified: "Assinatura verificada",
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
      enterName: "Digite um nome",
      errorSavingItem: "Erro salvando {item}",
      failedMasterNodeUnlock: "Falhou o desbloqueamento do nódulo de serviço",
      failedToSetLanguage: "Falhou mudança de língua: {lang}",
      failedWalletImport: "Falhou importação da carteira",
      failedWalletOpen: "Falhou abertura da carteira. Por favor tente de novo.",
      failedWalletRead: "Falha ao ler as carteiras",
      internalError: "Erro interno",
      invalidAddress: "Endereço não válido",
      invalidAmount: "Quantidade não válida",
      invalidBackupOwner: "Endereço do proprietário de backup inválido",
      invalidNameLength: "Comprimento do nome inválido",
      invalidNameFormat:
        "O nome pode conter apenas caracteres alfanuméricos e hífenes",
      invalidNameHypenNotAllowed:
        "O nome só pode começar ou terminar com caracteres alfanuméricos ou um sublinhado",
      invalidOldPassword: "Palavra-passe antiga inválida",
      invalidPassword: "Palavra-passe inválida",
      invalidOwner: "Endereço do proprietário inválido",
      invalidPaymentId: "ID de pagamento inválido",
      invalidPrivateViewKey: "Chave de visualização privada inválida",
      invalidPublicAddress: "Endereço público inválido",
      invalidRestoreDate: "Data de restauro inválido",
      invalidRestoreHeight: "Altura de restauro inválido",
      invalidSeedLength: "Comprimento da palavra semente inválido",
      invalidMasterNodeCommand:
        "Por favor introduza o comando de registro do nódulo de serviço",
      invalidMasterNodeKey: "Chave do nódulo de serviço inválido",
      invalidBchatId: "ID do Bchat inválido",
      invalidSignature: "Assinatura inválida",
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
      zeroAmount: "Quantidade tem de ser superior a zero",
      greaterHeight: "O valor inserido é maior que a altura do bloco atual"
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
    beldexAddress: "Insira o endereço ou o nome BNS",
    bnsName: "O nome a ser adquirido através do serviço de nomes Beldex",
    bnsOwner: "O endereço da carteira do proprietário",
    bnsBackupOwner: "O endereço da carteira do proprietário do backup",
    bnsDecryptName: "Um nome BNS que lhe pertence",
    belnetFullAddress:
      "Endereço belnet completo para mapear o nome BNS (sem .bdx)",
    enterAddress: "Insira o endereço",
    enterName: "Insira o nome",
    enterRecipientAddress: "Insira o endereço do destinatário de {coin}",
    enteroldPassword: "Digite a senha antiga",
    enterNewPassword: "Insira a nova senha",
    reEnterPassword: "Digite novamente a senha",
    filterTx: "Digite um ID, nome, endereço ou valor",
    hexCharacters: "{count} caracteres hexadecimais",
    mnemonicSeed: "25 (or 24) palavras semente mnemónicas",
    pasteTransactionId: "Colar o ID da transação",
    pasteTransactionProof: "Colar prova de transação",
    dataToSign:
      "Dados que pretende assinar com a chave privada do seu endereço principal",
    proveOptionalMessage:
      "Mensagem opcional contra a qual a assinatura é assinada",
    recipientWalletAddress: "Endereço da carteira do destinatário",
    selectAFile: "Por favor selecione um ficheiro",
    bchatId: "O ID do Bchat para vincular ao serviço de nomes Beldex",
    signature: "Assinatura para verificar",
    transactionNotes: "Notas adicionais para anexar à transação",
    unsignedData: "Os dados como deveriam aparecer antes de serem assinados",
    walletName: "Um nome para a sua carteira",
    walletPassword: "Uma palavra-passe opcional para a carteira",
    reEnterWalletPassword: "Digite novamente a senha",
    enterEthAddress: "Insira seu endereço ETH",
    enterBelnetId: "Insira seu ID da Belnet",
    enterBchatId: "Insira seu ID do BChat",
    enterWalletAddress: "Insira o endereço da sua carteira"
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
    awaitingConfirmation: "Aguardando confirmação",
    bannedPeers: {
      title: "Pares banidos (banimento serão anulados ao reiniciar a carteira)",
      bannedUntil: "Banido até {time}"
    },
    blockHeight: "Altura",
    height: "Altura",
    cannotSign:
      "Não é possível fazer login com uma carteira somente para visualização.",
    checkTransaction: {
      description:
        "Verifique se os fundos foram pagos para um endereço fornecendo o ID da transação, o endereço do destinatário, a mensagem usada para assinatura e a assinatura. Para um comprovante de pagamento, não é necessário fornecer o endereço do destinatário.",
      infoTitles: {
        confirmations: "Confirmações",
        inPool: "Na piscina",
        validTransaction: "Transação válida",
        received: "Valor recebido"
      },
      validTransaction: {
        no: "NÃO",
        yes: "SIM"
      }
    },
    closing: "Fechando",
    connectingToBackend: "Conectado ao backend",
    contribution: "Contribuição",
    contributor: "Contribuinte",
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
    expirationHeight: "Altura de expiração",
    encryptedBchatValue: "Valor do Bchat criptografado",
    encryptedBelnetValue: "Encrypted Belnet Value",
    encryptedWalletValue: "Encrypted Wallet Value",
    encryptedEthAddrValue: "Encrypted ETH Address",
    bns: {
      bchatID: "ID do bate-papo",
      belnetName1Year: "Nome Belnet 1 ano",
      belnetNameXYears: "Nome Belnet {years} anos",
      prices: "Preços :",
      note: "Observação",
      bnsRegistration: "Nome BNS para registro",
      ownerNotes:
        "Use o endereço atual (deixe em branco se for a mesma carteira) ou especifique o endereço se for uma carteira diferente",
      ethNotes:
        "Nosso endereço Ethereum é compatível com todas as blockchains da EVM",
      records: "Registros BNS",
      addRecord: "Adicionar registro",
      fetchNewRecord: "Obtendo o registro BNS da rede..."
    },
    bnsPurchaseDescription:
      "Adquira ou atualize um registro do BNS. Se você adquirir um nome, pode levar um ou dois minutos para que ele apareça na lista.",
    bnsDescription:
      "Aqui você encontra todos os nomes BNS pertencentes a esta carteira. Ao descriptografar um registro de sua propriedade, você obterá o nome e o valor desse registro BNS.",
    bnsUpdateDescription:
      " Você só pode atualizar o endereço do proprietário ou os valores ao mesmo tempo. Se quiser atualizar ambos, você pode atualizar o valor antes da propriedade ou após transferir a propriedade.",
    loadingSettings: "Carregando configurações",
    oxenBalance: "Saldo",
    belnetNameDescription:
      "Compre ou atualize um nome no Belnet. Se você comprar um nome, pode levar um ou dois minutos para que ele apareça na lista. Para saber mais sobre o Belnet, visite: ",
    oxenUnlockedBalance: "Saldo desbloqueado",
    oxenUnlockedShort: "Desbloqueado",
    me: "Meu",
    noTransactionsFound: "Nenhuma transação encontrada",
    notes: "Notas",
    numberOfUnspentOutputs: "Número de outputs não gastos",
    operator: "Operador",
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
      "Gere um comprovante de pagamento recebido/efetuado fornecendo o ID da transação, o endereço do destinatário e uma mensagem opcional. No caso de pagamentos efetuados, você pode obter um 'Comprovante de Gasto' que comprova a autoria da transação. Nesse caso, não é necessário especificar o endereço do destinatário.",
    readingWalletList: "Lendo lista da carteira",
    recentIncomingTransactionsToAddress: "Transações de entrada neste endereço",
    recentTransactionsWithAddress: "Transações recentes neste endereço",
    rescanModalDescription:
      "Seleccione examinação completa ou examinação de outputs gastos apenas.",
    saveSeedWarning: "Por favor copie e salve estes num lugar seguro!",
    saveToAddressBook: "Salvar para o livro de endereço",
    seedWords: "Palavras semente",
    walletCreated: "Carteira criada",
    selectLanguage: "Selecione língua",
    masterNodeContributionDescription:
      "O staking contribui para a segurança da rede Beldex. Ao contribuir, você ganha BDX. Após o staking, você precisará aguardar 15 ou 30 dias para que seus BDX sejam desbloqueados, dependendo se o staking foi desbloqueado por um contribuinte ou se o nó foi desativado. Para saber mais sobre staking, consulte a documentação em [link para a documentação]",
    masterNodeRegistrationDescription:
      'Introduza o {registerCommand} commando produzido pelo serviço que está se registando para se tornar un Nódulo de Serviço utilizando o commando "{prepareCommand}" ',
    masterNodeStartStakingDescription: "Para começar a pintar, visite",
    masterNodeStartStakingDescription1: "Guia -->",
    noMasterNodesCurrentlyAvailable:
      "Atualmente não há nós mestres disponíveis para contribuição",
    masterNodeDetails: {
      contributors: "Contribuidores",
      lastRewardBlockHeight: "Altura do último bloco de recompensa",
      lastUptimeProof: "Última prova de tempo de atividade",
      maxContribution: "Contribuição máxima",
      minContribution: "Contribuição mínima",
      operatorFee: "Taxa de Operador",
      registrationHeight: "Altura de registro",
      unlockHeight: "Altura de desbloqueio",
      reserved: "Reservado",
      masterNodeKey: "Chave do nó mestre",
      snKey: "Chave MN",
      stakingRequirement: "Requisito de piquetagem",
      totalContributed: "Total contribuído"
    },
    signAndVerifyDescription:
      "Assine os dados com a chave privada do seu endereço principal ou verifique uma assinatura em relação a um endereço público",
    spendKey: "Chave de gasto",
    spendKeyHint:
      "Caso a chave de gasto não seja fornecida, a carteira será restaurada no modo somente leitura.",
    startingDaemon: "Começando serviço",
    startingWallet: "Começando carteira",
    switchToDateSelect: "Mudar para data de seleção",
    switchToHeightSelect: "Mudar para altura de seleção",
    syncingDaemon: "Daemon de sincronização",
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
      date: "Data",
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
    unlockingAtHeight: "Desbloqueio em altura {number}",
    unspentOutputs: "Outputs não-gastos",
    userNotUsedAddress: "Não utilizou este endereço",
    userUsedAddress: "Já utilizou este endereço",
    version: "Versão",
    viewKey: "Chave de visualização",
    viewOnlyMode:
      "Modo de visualização apenas. Por favor carregue a carteira completa para poder enviar moedas.",
    WalletAddress: "Endereço da carteira",
    website: "site",
    privacy: "Privacidade",
    normal: "Normal"
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
    availableForContribution: "Nós mestres disponíveis para contribuição",
    changePassword: "Mudar palavra-passe",
    configure: "Definições de configuração",
    currentlyStakedNodes: "Nós atualmente piquetados",
    bnsRecordDetails: "Detalhes do registro do BNS",
    bnsBchatRecords: "Registros de bate-papo",
    bnsBelnetRecords: "Registros de Belnet",
    importFromFile: "Importar do arquivo",
    privateKeys: "Chaves privadas",
    rescanWallet: "Reexaminar carteira",
    restoreFromSeed: "Restaurar da semente",
    bnsServices: "Serviço BNS",
    bns: {
      purchase: "Comprar BNS",
      myBns: "Meu BNS"
    },
    masterNode: {
      registration: "REGISTO",
      staking: "PARTICIPAÇÃO",
      myStakes: "Minhas apostas"
    },
    masterNodeDetails: "Detalhes do nó mestre",
    settings: {
      title: "Configurações",
      tabs: {
        general: "Geral",
        language: "Língua",
        peers: "Pares"
      }
    },
    transactionDetails: "Detalhes das transações",
    details: "Detalhes",
    transactions: "Transações",
    wallet: {
      createNew: "Criar nova carteira",
      createdOrRestored: "Carteira criada/restaurada",
      walletRestored: "Carteira Restaurada",
      walletCreated: "Carteira criada",
      walletImported: "Carteira importada",
      importFromFile: "Importar carteira a partir de ficheiro",
      useExistingWallet: "Usar carteira existente",
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
      privacySwap: "Troca Privada",
      privacySwapDescription:
        "Sua troca será segura com este recurso de troca privada. Sua identidade não ficará visível.",
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
      blockchain: "Blockchain",
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
      changellyAddress: "Endereço da exchange",
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
      confirmations: "Confirmações",
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
      paymentConfirm: "Confirmar y realizar el pago",
      minimumAmtChanged: "O valor mínimo é alterado, o novo valor é ",
      maximumAmtChanged: "O valor máximo é alterado, o novo valor é ",
      network: "Espanhola",
      giveCorrectAddress:
        "Certifique-se de inserir o endereço correto da rede selecionada - ({type}). Caso contrário, você perderá seus fundos.",
      swapType: "Tipo de Swap"
    }
  }
};
