export default {
  buttons: {
    // All button text is uppercased in the gui
    advanced: "Передовой",
    addAddressBook: "Добавить в адресную книгу",

    all: "ВСЕ",
    back: "НАЗАД",
    browse: "ОБЗОР",
    cancel: "ОТМЕНА",
    change: "ИЗМЕНИТЬ",
    check: "Проверять",
    clear: "прозрачный",
    close: "ЗАКРЫТЬ",
    contacts: "КОНТАКТЫ",
    copy: "копировать",
    copyAddress: "КОПИРОВАТЬ АДРЕС",
    copySignature: "COPY SIGNATURE",
    createWallet: "СОЗДАТЬ КОШЕЛЕК",
    delete: "УДАЛИТЬ",
    edit: "РЕДАКТИРОВАТЬ",
    editNotes: "Редактировать примечания",
    export: "ЭКСПОРТИРОВАТЬ",
    generate: "Создать",
    import: "ИМПОРТИРОВАТЬ",
    importWallet: "ИМПОРТИРОВАТЬ КОШЕЛЕК | ИМПОРТИРОВАТЬ КОШЕЛЬКИ",
    next: "ДАЛЕЕ",
    min: "Мин.",
    max: "Макс",
    openWallet: "ОТКРЫТЬ КОШЕЛЕК",
    receive: "ПОЛУЧИТЬ",
    registerMasterNode: "ЗАРЕГИСТРИРОВАТЬ СЕРВИСНУЮ НОДУ",
    rescan: "ПЕРЕСКАНИРОВАТЬ",
    restoreWallet: "ВОССТАНОВИТЬ КОШЕЛЕК",
    refresh: "Обновить",
    save: "СОХРАНИТЬ",
    saveTxNotes: "СОХРАНИТЬ ТРАНЗ. ЗАМЕТКИ",
    selectLocation: "ВЫБРАТЬ ПАПКУ",
    selectWalletFile: "ВЫБРАТЬ ФАЙЛ КОШЕЛЬКА",
    send: "ОТПРАВИТЬ",
    sendCoins: "ОТПРАВИТЬ МОНЕТЫ",
    masterNode: "СЕРВИСНАЯ НОДА",
    settings: "НАСТРОЙКИ",
    showQRCode: "ПОКАЗАТЬ QR КОД",
    showTxDetails: "Детали TXN",
    stake: "СТЕЙК",
    sweepAll: "Sweep All",
    unlock: "UNLOCK",
    viewOnExplorer: "ПОСМОТРЕТЬ В ЭКСПЛОРЕРЕ"
  },
  dialog: {
    // Generic buttons
    buttons: {
      ok: "ОК",
      cancel: "ОТМЕНИТЬ",
      open: "ОТКРЫТЬ"
    },

    // Dialogs
    banPeer: {
      title: "Забанить пира",
      peerDetailsTitle: "Данные пира",
      message:
        "Введите время, на которое нужно забанить пира (сек).\nПо-умолчанию 3600 = 1 час.",
      ok: "Забанить"
    },
    copyAddress: {
      title: "Копировать адрес",
      message:
        "С этим адресом ассоциирован payment id.\nPayment id необходимо скопировать отдельно."
    },
    copyPrivateKeys: {
      // Copy {seedWords/viewKey/spendKey}
      title: "Скопировать: {type}",
      message:
        "Будьте внимательны, владелец приватных ключей может контролировать ваши средства.",
      seedWords: "Seed-фраза",
      viewKey: "Ключ Просмотра",
      spendKey: "Ключ Отправки"
    },
    deleteWallet: {
      title: "Удалить кошелек",
      message:
        "Уверены, что хотите удалить кошелек?\nУбедитесь, что сохранили приватные ключи в надежном месте.\nЭТО НЕОБРАТИМЫЙ ПРОЦЕСС!",
      ok: "УДАЛИТЬ"
    },
    exit: {
      title: "Выйти",
      message: "Уверены, что хотите выйти?",
      ok: "ВЫЙТИ"
    },
    keyImages: {
      title: "{type} ключевых образов",
      message: "Вы уверены, что хотите произвести {type} ключевых образов?",
      export: "Экспорт",
      import: "Импорт"
    },
    noPassword: {
      title: "Пароль не задан",
      message: "Вы уверены, что хотите создать кошелек без пароля?",
      ok: "СОЗДАТЬ"
    },
    password: {
      title: "Пароль",
      message: "Введите пароль кошелька"
    },
    registerMasterNode: {
      title: "Регистрация сервисной ноды",
      message: "Вы уверены, что хотите зарегистрировать сервисную ноду?",
      ok: "ЗАРЕГИСТРИРОВАТЬ"
    },
    rescan: {
      title: "Пересканировать кошелек",
      message:
        "Внимание: Часть информации о предыдущих тразакциях\n(например, адрес получателя) будет потеряна.",
      ok: "ПЕРЕСКАНИРОВАТЬ"
    },
    restart: {
      title: "ПЕРЕЗАГРУЗИТЬ",
      message: "Изменения требуют перезагрузки. Выполнить сейчас?",
      ok: "ПЕРЕЗАГРУЗИТЬ"
    },
    showPrivateKeys: {
      title: "Показать приватные ключи",
      message: "Вы уверены, что хотите посмотреть приватные ключи?",
      ok: "ПОКАЗАТЬ"
    },
    stake: {
      title: "Стейк",
      message: "Вы уверены, что хотите начать стейк ноды?",
      ok: "ПРОДОЛЖИТЬ"
    },
    sweepAll: {
      title: "Sweep all",
      message: "Do you want to sweep all?",
      ok: "SWEEP ALL"
    },
    sweepAllWarning: {
      title: "Sweep all warning",
      message:
        "You are about to combine all of your unspent funds by sending a transaction to yourself, your wallet may show a balance of 0 temporarily, after 10 blocks your funds will unlock and you may stake normally.",
      ok: "CONTINUE"
    },
    switchWallet: {
      title: "Переключить кошельки",
      closeMessage: "Вы уверены, что хотите закрыть текущий кошелек?",
      restartMessage:
        "Запущен RPC кошелька.\nЕсли вы хотите переключить кошельки, перезапустите приложение. \nПрогресс синхронизации будет потерян и вам придется пересканировать блокчейн."
    },
    transactionDetails: {
      title: "Детали транзакции",
      ok: "ЗАКРЫТЬ"
    },
    transfer: {
      title: "Перевод",
      message: "Вы уверены, что хотите отправить эту транзакцию?",
      ok: "ОТПАРВИТЬ"
    },
    unlockConfirm: {
      title: "Подтвердить разблокировку",
      ok: "РАЗБЛОКИРОВАТЬ"
    },
    unlockMasterNode: {
      title: "Разблокировать сервисную ноду",
      confirmTitle: "Подтверждение разблокировки",
      message: "Вы уверены, что хотите разблокировать сервисную ноду?",
      ok: "РАЗБЛОКИРОВАТЬ"
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
    address: "АДРЕС",
    amount: "СУММА",
    confirmPassword: "ПОДТВЕРЖДЕНИЕ ПАРОЛЯ",
    daemonLogLevel: "УРОВЕНЬ ЛОГА ДЕМОНА",
    daemonP2pPort: "P2P ПОРТ ДЕМОНА",
    dataStoragePath: "ПАПКА ХРАНИЛИЩА ДАННЫХ",
    data: "Данные",
    filter: "Фильтр",
    filterTransactionType: "ТИП ТРАНЗАКЦИИ",
    internalWalletPort: "ВНУТРЕННЫЙ ПОРТ КОШЕЛЬКА",
    keyImages: {
      exportDirectory: "ПАПКА ЭКСПОРТА КЛЮЧЕВОГО ОБРАЗА",
      importFile: "ФАЙЛ ИМПОРТА КЛЮЧЕВОГО ОБРАЗА"
    },
    limitDownloadRate: "ОГРАНИЧИТЬ СКОРОСТЬ ЗАГРУЗКИ",
    limitUploadRate: "ОГРАНИЧИТЬ СКОРОСТЬ АПЛОАДА",
    localDaemonIP: "IP ЛОКАЛЬНОГО ДЕМОНА",
    localDaemonPort: "ПОРТ ЛОКАЛЬНОГО ДЕМОНА",
    maxIncomingPeers: "МАКСИМУМ ВХОДЯЩИХ ПИРОВ",
    maxOutgoingPeers: "МАКСИМУМ ИСХОДЯЩИХ ПИРОВ",
    message: "Сообщение",
    mnemonicSeed: "МНЕМОНИЧЕСКАЯ SEED-ФРАЗА",
    name: "ИМЯ",
    newWalletName: "ИМЯ НОВОГО КОШЕЛЬКА",
    notes: "ЗАМЕТКИ",
    optional: "НЕОБЯЗАТЕЛЬНО",
    password: "ПАРОЛЬ",
    paymentId: "PAYMENT ID",
    priority: "ПРИОРИТЕТ",
    remoteNodeHost: "ХОСТ УДАЛЕННОЙ НОДЫ",
    remoteNodePort: "ПОРТ УДАЛЕННОЙ НОДЫ",
    restoreFromBlockHeight: "ВОССТАНОВИТЬ НАЧИНАЯ С ВЫСОТЫ БЛОКА",
    restoreFromDate: "ВОССТАНОВИТЬ НАЧИНАЯ С ДАТЫ",
    seedLanguage: "ЯЗЫК SEED-ФРАЗЫ",
    masterNodeCommand: "КОМАНДА РЕГИСТРАЦИИ СЕРВИСНОЙ НОДЫ",
    masterNodeKey: "КЛЮЧ СЕРВИСНОЙ НОДЫ",
    signature: "Подпись",
    totalBalance: "Итоговый баланс",
    transactionId: "ID транзакции",
    to: "К",
    walletFile: "ФАЙЛ КОШЕЛЬКА",
    walletLogLevel: "УРОВЕНЬ ЛОГА КОШЕЛЬКА",
    walletName: "ИМЯ КОШЕЛЬКА",
    walletRPCPort: "RPC ПОРТ КОШЕЛЬКА",
    walletStoragePath: "ПАПКА КОШЕЛЬКА",

    // These are specific labels which do not get uppercased
    confirmNewPassword: "Подтвердите Новый Пароль",
    newPassword: "Новый Пароль",
    oldPassword: "Старый Пароль",
    rescanFullBlockchain: "Пересканировать весь блокчейн",
    rescanSpentOutputs: "Пересканировать потраченные выходы",
    transactionNotes: "Заметки Транзакции",
    chooseNetwork: "Выберите сеть",
    network: "Сеть"
  },
  footer: {
    ready: "СИНХРОНИЗИРОВАН",
    scanning: "СКАНИРОВАНИЕ",
    status: "Статус",
    syncing: "СИНХРОНИЗАЦИЯ",
    remote: "Удаленная нода",
    wallet: "Кошелек"
  },
  menuItems: {
    about: "Информация",
    changePassword: "Сменить Пароль",
    copyAddress: "Копировать адрес",
    copyQR: "Копировать QR код",
    copySeedWords: "Копировать seed-фразу",
    copySpendKey: "Копировать Ключ Отправки",
    copyMasterNodeKey: "Copy master node key",
    copyTransactionId: "Копировать ID транзакции",
    copyViewKey: "Копировать Ключ Просмотра",
    createNewWallet: "Создать новый кошелек",
    deleteWallet: "Удалить Кошелек",
    exit: "Закрыть Кошелек Beldex",
    importOldGUIWallet: "Импортировать кошельки из старого GUI",
    manageKeyImages: "Управлять Ключевыми Образами",
    openWallet: "Открыть кошелек",
    rescanWallet: "Пересканировать кошелек",
    restoreWalletFile: "Восстановить кошелек из файла",
    restoreWalletSeed: "Восстановить кошелек из seed-фразы",
    saveQR: "Сохранить QR код в файл",
    sendToThisAddress: "Отправить на этот адрес",
    settings: "Настройки",
    showDetails: "Показать подробности",
    showPrivateKeys: "Показать приватные ключи",
    showQRCode: "Показать QR Код",
    switchWallet: "Переключить Кошелек",
    viewOnExplorer: "Посмотреть в обозревателе блокчейна"
  },
  notification: {
    positive: {
      addressCopied: "Адрес скопирован в буфере",
      bannedPeer: "{host} забанен до {time}",
      copied: "{item} скопирован в буфер",
      itemSaved: "{item} сохранен в {filename}",
      keyImages: {
        exported: "Ключевые образы экспортированы в {filename}",
        imported: "Ключевые образы импортированы"
      },
      passwordUpdated: "Пароль обновлен",
      qrCopied: "QR код скопирован в буфер",
      registerMasterNodeSuccess: "Сервисная нода успешно зарегистрирована",
      sendSuccess: "Транзакция успешно отправлена",
      signatureCopied: "Signature copied to clipboard",
      stakeSuccess: "Стейк успешно начат",
      transactionNotesSaved: "Заметка о транзакции сохранена"
    },
    errors: {
      banningPeer: "Ошибка бана пира",
      cannotAccessRemoteNode:
        "Не удалось подключиться к удаленной ноде, пожалуйста выберите другую ноду",
      changingPassword: "Ошибка смены пароля",
      copyWalletFail: "Не удалось скопировать кошелек",
      copyingPrivateKeys: "Не удалось скопировать приватные ключи",
      dataPathNotFound: "Папка хранилища данных не найдена",
      differentNetType: "Удаленная нода использует другой тип сети (nettype)",
      enterSeedWords: "Введите seed-фразу",
      enterTransactionId: "Enter transaction ID",
      enterTransactionProof: "Enter transaction proof",
      enterWalletName: "Введите имя кошелька",
      errorSavingItem: "Ошибка сохранения {item}",
      failedMasterNodeUnlock: "Не удалось разблокировать сервисную ноду",
      failedToSetLanguage: "Не удалось переключить язык: {lang}",
      failedWalletImport: "Не удалось импортировать кошелек",
      failedWalletOpen: "Не удалось открыть кошелек. Попробуйте еще раз.",
      internalError: "Внутренняя ошибка",
      invalidAddress: "Адрес не верен",
      invalidAmount: "Сумма не верна",
      invalidOldPassword: "Старый пароль не верен",
      invalidPassword: "Неверный пароль",
      invalidPaymentId: "Payment id не верен",
      invalidPrivateViewKey: "Неверный приватный ключ просмотра",
      invalidPublicAddress: "Неверный публичный адрес",
      invalidRestoreDate: "Неверная дата восстановления",
      invalidRestoreHeight: "Неверная высота блока восстановления",
      invalidSeedLength: "Неверная длина seed-фразы",
      invalidMasterNodeCommand:
        "Пожалуйста введите команду регистрации сервисной ноды",
      invalidMasterNodeKey: "Ключ сервисной ноды указан неверно",
      invalidWalletPath: "Неверный путь к кошельку",
      keyImages: {
        exporting: "Ошибка экспорта ключевых образов",
        reading: "Ошибка чтения ключевых образов",
        importing: "Ошибка импорта ключевых образов"
      },
      negativeAmount: "Сумма не может быть отрицательной",
      newPasswordNoMatch: "Новые пароли не совпадают",
      newPasswordSame: "Новый пароль должен отличаться от старого",
      notEnoughBalance: "Разблокированный баланс недостаточен",
      passwordNoMatch: "Пароли не совпадают",
      remoteCannotBeReached: "Не удалось связаться с удаленным демоном",
      selectWalletFile: "Select a wallet file",
      unknownError: "Произошла неизвестная ошибка",
      walletAlreadyExists: "Кошелек с таким именем уже существует",
      walletPathNotFound: "Путь к хранилищу данных кошелька не найден",
      zeroAmount: "Сумма должна быть больше нуля"
    },
    warnings: {
      noKeyImageExport: "Не найдено ключевых образов для экспорта",
      usingLocalNode:
        "Не удалось подключиться к удаленной ноде, переключаемся на локальную ноду",
      usingRemoteNode: "Не найден файл beldexd, используется удаленная нода"
    }
  },
  placeholders: {
    additionalNotes: "Дополнительные заметки",
    addNotesOptional: "Добавьте примечания (необязательно)",
    addressBookName: "Имя для этого адреса",
    addressOfSigner: "Публичный адрес кошелька подписавшего",
    beldexAddress: "Белдекс Адрес",
    filterTx: "Введите идентификатор, имя, адрес или сумму",
    hexCharacters: "Шестнадцатеричных символов: {count}",
    mnemonicSeed: "Seed-фраза, состоящая из 25 или 24 слов",
    pasteTransactionId: "Вставить идентификатор транзакции",
    pasteTransactionProof: "Вставить подтверждение транзакции",
    dataToSign:
      "Данные, которые вы хотите подписать закрытым ключом вашего основного адреса",

    proveOptionalMessage:
      "Необязательное сообщение, против которого подписывается подпись",
    recipientWalletAddress: "Адрес кошелька получателя",
    selectAFile: "Пожалуйста, выберите файл",
    signature: "Подпись для проверки",
    unsignedData:
      "Данные, как они должны выглядеть до того, как они были подписаны",

    transactionNotes: "Дополнительные заметки для приосединения к транзакции",
    walletName: "Имя вашего кошелька",
    walletPassword: "Пароль кошелька (необязательно)"
  },
  strings: {
    addAddressBookEntry: "Добавить запись в адресную книгу",
    addressBookDetails: "Детальные данные адресной книги",
    addressBookIsEmpty: "Адресная книга пуста",
    addresses: {
      myPrimaryAddress: "Мой основной адрес",
      myUnusedAddresses: "Мои неиспользованные адреса",
      myUsedAddresses: "Мои использованные адреса",
      // primaryAddress: "Основной адрес",
      subAddress: "Суб-адрес",
      subAddressIndex: "Индекс {index}",
      primaryAccount: "Основная учетная запись"
    },
    advancedOptions: "Расширенные настройки",
    bannedPeers: {
      title: "Забаненные пиры (баны будут сняты при перезагрузке кошелька)",
      bannedUntil: "Забанено до {time}"
    },
    blockHeight: "Высота блока",
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
    closing: "Закрытие",
    connectingToBackend: "Подключение...",
    contribution: "Contribution",
    daemon: {
      local: {
        title: "Только Локальная Нода",
        description:
          "Полная безопасность, кошелек загрузит весь блокчейн. Вы не сможете совершать платежи до завершения синхронизации."
      },
      localRemote: {
        title: "Локальная + Удаленная Нода",
        description:
          "Начните рабоать с кошельком быстрее, используя эту опцию (по-умолчанию). Кошелек загрузит весь блокчейн, но до окончания синхронизации будет использовать удаленную ноду."
      },
      remote: {
        title: "Только Удаленная Нода",
        description:
          "Меньшая безопасность, кошелек подключится к удаленной ноде для проведения всех транзакций."
      }
    },
    destinationUnknown: "Назначение Неизвестно",
    editAddressBookEntry: "Редактировать запись адресной книги",
    loadingSettings: "Загрузка настроек",
    oxenBalance: "Баланс",
    oxenUnlockedBalance: "Разблокированый баланс",
    oxenUnlockedShort: "Разблокировано",
    noTransactionsFound: "Транзакции не найдены",
    notes: "Заметки",
    numberOfUnspentOutputs: "Количество непотраченных выходов",
    paymentID: "Payment ID",
    peerList: "Список пиров",
    proveTransactionDescription:
      "Generate a proof of your incoming/outgoing payment by supplying the transaction ID, the recipient address and an optional message.\nFor the case of outgoing payments, you can get a 'Spend Proof' that proves the authorship of a transaction. In this case, you don't need to specify the recipient address.",
    priorityOptions: {
      automatic: "Автоматически",
      slow: "Медленно",
      normal: "Нормально",
      fast: "Быстро",
      fastest: "Очень быстро",
      flash: "вспышка"
    },
    readingWalletList: "Получение списка кошельков",
    recentIncomingTransactionsToAddress:
      "Недавние входящие транзакции на этот адрес",
    recentTransactionsWithAddress: "Недавние транзакции с этим адресом",
    rescanModalDescription:
      "Выберите полное пересканирование или персканирование только потраченных выходов.",
    saveSeedWarning:
      "Пожалуйста, скопируйте фразу и храните ее в безопасном месте!",
    saveToAddressBook: "Сохранить в адресной книге",
    seedWords: "Seed-фраза",
    selectLanguage: "Выберите язык",
    masterNodeRegistrationDescription:
      'Введите команду {registerCommand}, созданную демоном при регистрации Сервисной Ноды с помощью команды "{prepareCommand}"',
    spendKey: "Ключ Отправки",
    startingDaemon: "Запуск демона",
    startingWallet: "Запуск кошелька",
    switchToDateSelect: "Переключиться на выбор даты",
    switchToHeightSelect: "Переключиться на выбор высоты блока",
    transactionID: "ID транзакции",
    transactionConfirmed: "подтверждено",
    transactions: {
      amount: "Сумма",
      description: "Транзакция: {type}",
      fee: "Комиссия",
      paidBySender: "оплачивается отправителем",
      received: "Получено",
      sent: "Отправлено",
      sentTo: "Транзакция отправлена: {type}",
      timestamp: "Отметка времени",
      types: {
        all: "Все",
        incoming: "Входящие",
        outgoing: "Исходящие",
        pending: "Ожидающие",
        pendingIncoming: "Ожидающие входящие",
        pendingOutgoing: "Ожидающие исходящие",
        miner: "Майнинг",
        masterNode: "Сервисная Нода",
        governance: "Управление",
        stake: "Стейк",
        failed: "Не удавшиеся"
      }
    },
    unspentOutputs: "Непотраченные выходы",
    userNotUsedAddress: "Вы не использовали этот адрес",
    userUsedAddress: "Вы использовали этот адрес",
    viewKey: "Ключ Просмотра",
    viewOnlyMode:
      "Режим просмотра. Пожалуйста загрузите полный кошелек, чтобы отправлять монеты."
  },
  titles: {
    addressBook: "Адресная книга",
    addressDetails: "Данные адреса",
    advanced: {
      checkTransaction: "Проверить транзакцию",
      prove: "Доказывать",
      signAndVerify: "Подписать/Подтвердить",
      sign: "знак",
      verify: "Проверять"
    },
    changePassword: "Сменить пароль",
    configure: "Настройки",
    currentlyStakedNodes: "Currently staked nodes",
    privateKeys: "Приватные ключи",
    rescanWallet: "Пересканировать кошелек",
    masterNode: {
      registration: "РЕГИСТРАЦИЯ",
      staking: "СТЕЙК",
      myStakes: "Мои ставки"
    },
    settings: {
      title: "Настройки",
      tabs: {
        general: "Общие",
        language: "Язык",
        peers: "Пиры"
      }
    },
    transactionDetails: "Данные транзакции",
    transactions: "Транзакции",
    wallet: {
      createNew: "Создать новый кошелек",
      createdOrRestored: "Кошелек создан/восстановлен",
      importFromFile: "Импортировать кошелек из файла",
      importFromLegacyGUI: "Импортировать кошелек из предыдущего GUI",
      importFromOldGUI: "Импортировать кошелек из старого  GUI",
      restoreFromSeed: "Восстановить кошелек из seed-фразы",
      restoreViewOnly: "Восстановить кошелек только-для-чтения"
    },
    welcome: "Добро пожаловать",
    yourWallets: "Ваши Кошельки"
  }
};
