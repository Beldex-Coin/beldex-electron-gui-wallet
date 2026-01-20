export default {
  buttons: {
    // All button text is uppercased in the gui
    advanced: "Передовой",
    addAddressBook: "Добавить в адресную книгу",
    addWallet: "Добавить кошелек",
    all: "Все",
    back: "Назад",
    browse: "Просматривать",
    cancel: "Отмена",
    change: "Изменять",
    check: "Проверять",
    clear: "прозрачный",
    clearAll: "Очистить все",
    close: "Закрывать",
    contacts: "Контакты",
    copy: "копировать",
    copyAddress: "Копировать адрес",
    copyData: "Копировать данные",
    copySignature: "Копировать подпись",
    createWallet: "Создать кошелек",
    decrypt: "РАСШИФРОВАТЬ",
    addRecord: "Добавить БНС",
    delete: "УДАЛИТЬ",
    edit: "Редактировать",
    editNotes: "Редактировать примечания",
    export: "ЭКСПОРТИРОВАТЬ",
    fromBlockheight: "Из Блокхайта",
    generate: "Создать",
    import: "Импорт",
    importWallet: "ИИмпорт кошелька | Импорт кошельков",
    bns: "Служба имен BELDEX",
    next: "ДАЛЕЕ",
    min: "Мин.",
    max: "Макс",
    openWallet: "Открыть кошелек",
    purchase: "Покупка",
    receive: "Получать",
    registerMasterNode: "Зарегистрировать мастер-ноду",
    renew: "Продлить",
    rescan: "Повторное сканирование",
    restoreWallet: "Восстановить кошелек",
    refresh: "Обновить",
    save: "Сохранять",
    saveTxNotes: "Сохранить заметки",
    selectLocation: "Расположение",
    selectWalletFile: "Выберите файл",
    send: "Отправлять",
    sendCoins: "Отправить монеты",
    masterNode: "Главный узел",
    settings: "Настройки",
    showQRCode: "Показать QR-код",
    showTxDetails: "Подробности транзакции",
    sign: "Знак",
    stake: "Ставка",
    sweepAll: "разверткаВсе",
    unlock: "Разблокировать",
    update: "Обновлять",
    verify: "Проверять",
    viewOnExplorer: "Посмотреть в проводнике",
    add: "Добавлять",
    bnsUpdate: "Обновление БНС",
    bnsRenew: "БНС Продлить"
  },
  dialog: {
    // Generic buttons
    buttons: {
      ok: "ОК",
      cancel: "Отмена",
      open: "Открыть"
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
    deleteAddress: {
      title: "Удалить адрес",
      message: "Вы уверены, что хотите удалить этот адрес?"
    },
    discardEdit: {
      title: "Вы уверены?",
      message: "Вы уверены, что хотите отменить редактирование?"
    },
    showMasterNode: {
      title: "Показать главный узел",
      message: "Вы хотите продолжить?",
      masterNode: "Главный узел"
    },
    deleteWallet: {
      title: "Удалить кошелек",
      message: "Вы уверены, что хотите удалить текущий кошелек?",
      ok: "УДАЛИТЬ"
    },
    exit: {
      title: "Выйти",
      message: "Вы уверены, что хотите выйти из кошелька?",
      ok: "ВЫЙТИ"
    },
    keyImages: {
      title: "{тип} ключевых образов",
      message: "Вы уверены, что хотите произвести {type} ключевых образов?",
      export: "Экспорт",
      import: "Импорт"
    },
    bnsUpdate: {
      title: "Обновить запись BNS",
      message: "Вы хотите обновить запись BNS?",
      ok: "Обновлять"
    },
    noPassword: {
      title: "Пароль не задан",
      message: "Вы уверены, что хотите создать кошелек без пароля?",
      ok: "СОЗДАТЬ"
    },
    password: {
      title: "Введите пароль своего кошелька",
      message: "Введите пароль кошелька"
    },
    purchase: {
      title: "Название покупки",
      message: "Вы хотите приобрести это имя?",
      ok: "Покупка"
    },
    renew: {
      title: "Обновить имя",
      message: "Вы хотите обновить название?",
      ok: "Продлить"
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
      title: "Очистить все",
      message: "Вы хотите всё подмести?",
      ok: "ПРОВЕРИТЬ ВСЕ"
    },
    sweepAllWarning: {
      title: "Отмените все предупреждения",
      message:
        "Вы собираетесь объединить все свои неизрасходованные средства, отправив транзакцию самому себе. В вашем кошельке временно может отображаться баланс 0. После 10 блоков ваши средства разблокируются, и вы сможете продолжить стейкинг в обычном режиме.",
      ok: "ПРОДОЛЖАТЬ"
    },
    switchWallet: {
      title: "Переключить кошельки",
      closeMessage: "Вы уверены, что хотите закрыть текущий кошелек?",
      restartWalletMessage:
        "Вы уверены, что хотите закрыть и перезапустить кошелек?",
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
    confirmTransaction: {
      title: "Подтвердить отправку",
      sendTo: "Отправить",
      priority: "Приоритет"
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
      title: "Предупреждение о разблокировке главного узла",
      message:
        "Разблокировка частичной доли в узле также приведет к снятию стейкинга с других участников. Если вы размещаете средства в общем узле, лучше всего сообщить об этом оператору и другим участникам.",
      ok: "ПРОДОЛЖАТЬ"
    }
  },
  fieldLabels: {
    // Field labels are also all uppercased
    address: "Адрес",
    recipientAddress: "Адрес получателя",
    amount: "Количество",
    belnetId: "Идентификатор Белнета",
    eth: "ЭТХ",
    backupOwner: "Владелец резервной копии",
    confirmPassword: "Подтвердите пароль (необязательно)",
    daemonLogLevel: "Уровень журнала демона",
    daemonP2pPort: "Демон P2P-порт",
    dataStoragePath: "Путь хранения данных",
    decryptRecord: "Добавить запись",
    data: "Данные",
    filter: "Фильтр",
    filterTransactionType: "ТИП ТРАНЗАКЦИИ",
    internalWalletPort: "Внутренний порт кошелька",
    keyImages: {
      exportDirectory: "Каталог экспорта ключевых изображений",
      importFile: "Файл импорта ключевого изображения"
    },
    limitDownloadRate: "Ограничить скорость загрузки",
    limitUploadRate: "ОГРАНИЧИТЬ СКОРОСТЬ АПЛОАДА",
    bnsType: "ТИП ЗАПИСИ BNS",
    localDaemonIP: "IP-адрес локального демона",
    localDaemonPort: "Локальный порт демона",
    belnetFullAddress: "ПОЛНЫЙ АДРЕС БЕЛНЕТА",
    maxIncomingPeers: "Максимальное количество входящих пользователей",
    maxOutgoingPeers: "Максимальное количество исходящих коллег",
    message: "Сообщение",
    mnemonicSeed: "Семя восстановления",
    name: "ИМЯ",
    newWalletName: "Имя кошелька",
    notes: "Примечания",
    addressBookNotes: "Примечания к адресной книге",
    optional: "необязательный",
    owner: "Владелец",
    password: "ПАРОЛЬ",
    paymentId: "ИДЕНТИФИКАТОР ПЛАТЕЖА",
    priority: "Приоритет",
    remoteNodeHost: "Хост удаленного узла",
    remoteNodePort: "Порт удаленного узла",
    restoreFromBlockHeight: "Восстановить с высоты блока",
    restoreFromDate: "Restore from Date",
    seedLanguage: "Семенной язык",
    masterNodeCommand: "Команда главного узла",
    masterNodeKey: "Ключ главного узла",
    bchatId: "БЧАТ-идентификатор",
    signature: "Подпись",
    totalBalance: "Итоговый баланс",
    transactionId: "ID транзакции",
    to: "К",
    walletFile: "Файл кошелька",
    walletLogLevel: "Уровень журнала кошелька",
    walletName: "Имя кошелька",
    walletRPCPort: "Порт RPC кошелька",
    walletStoragePath: "Путь хранения кошелька",
    confirmNewPassword: "Подтвердите Новый Пароль",
    newPassword: "Новый Пароль",
    oldPassword: "Старый Пароль",
    rescanFullBlockchain: "Пересканировать весь блокчейн",
    rescanSpentOutputs: "Пересканировать потраченные выходы",
    transactionNotes: "Заметки Транзакции",
    chooseNetwork: "Выберите сеть",
    network: "Сеть",
    OwnerWalletaddress: "Адрес кошелька владельца",
    backupOwnerWalletAddress: "Адрес кошелька владельца резервной копии",
    updateOwner: "Обновить владельца",
    updateValues: "Обновить значения"
  },
  footer: {
    ready: "Синхронизировано",
    scanning: "Сканирование",
    status: "Статус",
    syncing: "Синхронизация",
    remote: "Удаленная нода",
    wallet: "Кошелек",
    updateRequired: "ТРЕБУЕТСЯ ОБНОВЛЕНИЕ"
  },
  menuItems: {
    about: "Информация",
    changePassword: "Сменить Пароль",
    copyAddress: "Копировать адрес",
    copySeed: "Копировать семя",
    copyBackupOwner: "Копировать владельца резервной копии",
    copyBelnetAddress: "Скопировать адрес Belnet",
    copyBelnetName: "Скопировать имя бельнет",
    copyName: "Копировать имя",
    copyOwner: "Копировать владельца",
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
    viewOnExplorer: "Посмотреть в обозревателе блокчейна",
    favourite: "Любимый"
  },
  notification: {
    positive: {
      addressCopied: "Адрес скопирован в буфере",
      linkCopied: "Ссылка скопирована в буфер обмена",
      backupOwnerCopied: "Резервный владелец скопирован в буфер обмена",
      bannedPeer: "{host} забанен до {time}",
      copied: "{item} скопирован в буфер",
      decryptedBNSRecord:
        "Registro BNS descriptografado com sucesso para {name}",
      itemSaved: "{item} сохранен в {filename}",
      keyImages: {
        exported: "Ключевые образы экспортированы в {filename}",
        imported: "Ключевые образы импортированы"
      },
      bnsRecordUpdated: "Запись BNS успешно обновлена",
      belnetAddressCopied: "Полный адрес Belnet скопирован",
      belnetNameCopied: "Название Белнет скопировано",
      passwordUpdated: "Пароль обновлен",
      namePurchased: "Имя успешно куплено",
      nameRenewed: "Имя успешно продлено",
      nameCopied: "Имя скопировано в буфер обмена",
      ownerCopied: "Владелец скопировал текст в буфер обмена",
      qrCopied: "QR код скопирован в буфер",
      registerMasterNodeSuccess: "Сервисная нода успешно зарегистрирована",
      sendSuccess: "Транзакция успешно отправлена",
      masterNodeInfoFilled:
        "Ключ главного узла и минимальное количество заполнены",
      bchatIdCopied: "Идентификатор Bchat скопирован в буфер обмена",
      signatureCopied: "Подпись скопирована в буфер обмена",
      signatureVerified: "Подпись проверена",
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
      enterTransactionId: "Введите идентификатор транзакции",
      enterTransactionProof: "Enter transaction proof",
      enterWalletName: "Введите имя кошелька",
      enterName: "Введите имя",
      errorSavingItem: "Ошибка сохранения {item}",
      failedMasterNodeUnlock: "Не удалось разблокировать сервисную ноду",
      failedToSetLanguage: "Не удалось переключить язык: {lang}",
      failedWalletImport: "Не удалось импортировать кошелек",
      failedWalletOpen: "Не удалось открыть кошелек. Попробуйте еще раз.",
      failedWalletRead: "Failed to read wallets",
      internalError: "Внутренняя ошибка",
      invalidAddress: "Адрес не верен",
      invalidAmount: "Сумма не верна",
      invalidBackupOwner: "Адрес резервного владельца недействителен",
      invalidNameLength: "Неверная длина имени",
      invalidNameFormat:
        "Имя может содержать только буквенно-цифровые символы и дефисы",
      invalidNameHypenNotAllowed:
        "Имя может начинаться или заканчиваться только буквенно-цифровыми символами или символом подчеркивания",
      invalidOldPassword: "Старый пароль не верен",
      invalidOwner: "Адрес владельца недействителен",
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
      invalidBchatId: "Идентификатор Bchat недействителен",
      invalidSignature: "Неверная подпись",
      invalidWalletPath: "Неверный путь к кошельку",
      keyImages: {
        exporting: "Ошибка экспорта ключевых образов",
        reading: "Ошибка чтения ключевых образов",
        importing: "Ошибка импорта ключевых образов"
      },
      negativeAmount: "Сумма не может быть отрицательной",
      newPasswordNoMatch: "Новые пароли не совпадают",
      newPasswordSame:
        "Нельзя использовать старый пароль. Установите другой пароль",
      passwordFieldEmpty: "Пожалуйста введите ваш пароль",
      notEnoughBalance: "Разблокированный баланс недостаточен",
      passwordNoMatch: "Пароли не совпадают",
      remoteCannotBeReached: "Не удалось связаться с удаленным демоном",
      selectWalletFile: "Выберите файл кошелька",
      unknownError: "Произошла неизвестная ошибка",
      walletAlreadyExists: "Кошелек с таким именем уже существует",
      walletPathNotFound: "Путь к хранилищу данных кошелька не найден",
      zeroAmount: "Сумма должна быть больше нуля",
      greaterHeight: "Введенное значение больше текущей высоты блока"
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
    beldexAddress: "Введите адрес или название BNS",
    dataToSign:
      "Данные, которые вы хотите подписать закрытым ключом вашего основного адреса",
    filterTx: "Введите идентификатор, имя, адрес или сумму",
    hexCharacters: "Шестнадцатеричных символов: {count}",
    bnsName: "Название, которое можно приобрести через Beldex Name Service",
    bnsOwner: "Адрес кошелька владельца",
    bnsBackupOwner: "Адрес кошелька резервного владельца",
    bnsDecryptName: "Имя BNS, которое принадлежит вам.",
    belnetFullAddress:
      "Полный адрес Belnet для сопоставления имени BNS (без расширения .bdx)",
    enterName: "Введите имя",
    enterAddress: "Введите адрес",
    enteroldPassword: "Введите старый пароль",
    enterNewPassword: "Введите новый пароль",
    reEnterPassword: "Повторно введите пароль",
    mnemonicSeed: "Seed-фраза, состоящая из 25 или 24 слов",
    pasteTransactionId: "Вставить идентификатор транзакции",
    pasteTransactionProof: "Вставить подтверждение транзакции",
    proveOptionalMessage:
      "Необязательное сообщение, против которого подписывается подпись",
    recipientWalletAddress: "Адрес кошелька получателя",
    selectAFile: "Пожалуйста, выберите файл",
    bchatId: "Идентификатор Bchat для привязки к службе имен Beldex",
    signature: "Подпись для проверки",
    unsignedData:
      "Данные, как они должны выглядеть до того, как они были подписаны",
    transactionNotes: "Дополнительные заметки для приосединения к транзакции",
    walletName: "Имя вашего кошелька",
    walletPassword: "Пароль кошелька (необязательно)",
    reEnterWalletPassword: "Повторно введите пароль",
    enterEthAddress: "Введите свой ETH-адрес",
    enterBelnetId: "Введите свой идентификационный номер Belnet.",
    enterBchatId: "Введите свой BChat ID",
    enterWalletAddress: "Введите адрес вашего кошелька"
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
    awaitingConfirmation: "Awaiting confirmation",
    bannedPeers: {
      title: "Забаненные пиры (баны будут сняты при перезагрузке кошелька)",
      bannedUntil: "Забанено до {time}"
    },
    blockHeight: "Высота блока",
    height: "Высота",
    cannotSign:
      "Подписать документ с помощью кошелька, предназначенного только для просмотра, невозможно.",
    checkTransaction: {
      description:
        "Убедитесь, что средства были переведены на указанный адрес, предоставив идентификатор транзакции, адрес получателя, сообщение, использованное для подписи, и подпись.\nДля подтверждения расходования средств адрес получателя указывать не нужно.",
      infoTitles: {
        confirmations: "Подтверждения",
        inPool: "В бассейне",
        validTransaction: "Действительная транзакция",
        received: "Полученная сумма"
      },
      validTransaction: {
        no: "НЕТ",
        yes: "ДА"
      }
    },
    closing: "Закрытие",
    connectingToBackend: "Подключение...",
    contribution: "Вклад",
    contributor: "Автор",
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
    expirationHeight: "Высота выдоха",
    bns: {
      bchatID: "Идентификатор Бчата",
      belnetName1Year: "Бельнет Имя 1 год",
      belnetNameXYears: "Бельнет Имя {years} лет",
      prices: "Цены :",
      note: "Примечание",
      bnsRegistration: "Название BNS для регистрации",
      ownerNotes:
        "Укажите текущий адрес (оставьте поле пустым, если используется тот же кошелек) или укажите адрес, если используется другой кошелек.",
      ethNotes: "Наш ETH-адрес совместим со всеми цепочками EVM.",
      records: "БНС отчеты",
      addRecord: "Добавить запись",
      fetchNewRecord: "Получение записи BNS из сети..."
    },
    bnsPurchaseDescription:
      "Приобретите или обновите запись в BNS. Если вы приобретаете имя, может потребоваться одна-две минуты, чтобы оно появилось в списке.",
    bnsDescription:
      "Здесь вы можете найти все имена BNS, принадлежащие этому кошельку. Расшифровка принадлежащей вам записи вернет имя и значение этой записи BNS.",
    loadingSettings: "Загрузка настроек",
    oxenBalance: "Баланс",
    belnetNameDescription:
      "Приобретите или обновите имя на Belnet. После покупки имени может потребоваться минута-две, чтобы оно появилось в списке. Для получения дополнительной информации о Belnet посетите: ",
    oxenUnlockedBalance: "Разблокированый баланс",
    oxenUnlockedShort: "Разблокировано",
    me: "Мне",
    noTransactionsFound: "Транзакции не найдены",
    notes: "Заметки",
    numberOfUnspentOutputs: "Количество непотраченных выходов",
    operator: "Operator",
    paymentID: "Идентификатор платежа",
    peerList: "Список пиров",
    proveTransactionDescription:
      "Создайте подтверждение входящего/исходящего платежа, указав идентификатор транзакции, адрес получателя и, при желании, сообщение. В случае исходящих платежей вы можете получить «Подтверждение расходования», которое доказывает авторство транзакции. В этом случае указывать адрес получателя не требуется.",
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
    walletCreated: "Кошелек создан",
    selectLanguage: "Выберите язык",
    masterNodeContributionDescription:
      "Стейкинг способствует безопасности сети Beldex. За ваш вклад вы получаете BDX. После размещения стейкинга вам придется подождать 15 или 30 дней, пока ваши BDX будут разблокированы, в зависимости от того, был ли стейкинг разблокирован участником сети или узел был дерегистрирован. Для получения дополнительной информации о стейкинге, пожалуйста, ознакомьтесь с документацией",
    masterNodeRegistrationDescription:
      'Введите команду {registerCommand}, созданную демоном при регистрации Сервисной Ноды с помощью команды "{prepareCommand}"',
    masterNodeStartStakingDescription:
      "Для начала обучения, пожалуйста, посетите",
    masterNodeStartStakingDescription1: "Вкладка -->",
    noMasterNodesCurrentlyAvailable:
      "В настоящее время нет доступных для добавления главных узлов.",
    masterNodeDetails: {
      contributors: "Авторы",
      lastRewardBlockHeight: "Высота блока последней награды",
      lastUptimeProof: "Последнее подтверждение работоспособности",
      maxContribution: "Максимальный вклад",
      minContribution: "Минимальный вклад",
      operatorFee: "Комиссия оператора",
      registrationHeight: "Высота регистрации",
      unlockHeight: "Высота разблокировки",
      reserved: "Сдержанный",
      masterNodeKey: "Ключ главного узла",
      snKey: "Миннесота Ключ",
      stakingRequirement: "Требование к стейкингу",
      totalContributed: "Всего внесено"
    },
    signAndVerifyDescription:
      "Подписывайте данные закрытым ключом вашего основного адреса или проверяйте подпись по общедоступному адресу.",
    spendKey: "Ключ Отправки",
    startingDaemon: "Запуск демона",
    startingWallet: "Запуск кошелька",
    switchToDateSelect: "Переключиться на выбор даты",
    switchToHeightSelect: "Переключиться на выбор высоты блока",
    syncingDaemon: "Демон синхронизации",
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
      date: "Дата",
      types: {
        all: "Все",
        incoming: "Получать",
        outgoing: "Отправил",
        pending: "Ожидающие",
        pendingIncoming: "Ожидающие входящие",
        pendingOutgoing: "Ожидающие исходящие",
        miner: "Майнинг",
        masterNode: "Сервисная Нода",
        governance: "Управление",
        bns: "Бнс",
        stake: "Стейк",
        failed: "Не удавшиеся"
      }
    },
    unlockingAtHeight: "Разблокировка на высоте {number}",
    unspentOutputs: "Непотраченные выходы",
    userNotUsedAddress: "Вы не использовали этот адрес",
    userUsedAddress: "Вы использовали этот адрес",
    viewKey: "Ключ Просмотра",
    viewOnlyMode:
      "Режим просмотра. Пожалуйста загрузите полный кошелек, чтобы отправлять монеты.",
    website: "Веб-сайт"
  },
  titles: {
    addressBook: "Адресная книга",
    addressDetails: "Данные адреса",
    contactBook: "Контактная книга",
    advanced: {
      checkTransaction: "Проверить транзакцию",
      prove: "Доказывать",
      signAndVerify: "Подписать/ Подтвердить",
      sign: "знак",
      verify: "Проверять"
    },
    availableForContribution: "Главные узлы доступны для внесения вклада",
    changePassword: "Сменить пароль",
    configure: "Параметры конфигурации",
    currentlyStakedNodes: "Текущие застейканные узлы",
    bnsRecordDetails: "Детали записи BNS",
    bnsBchatRecords: "Бчат записи",
    bnsBelnetRecords: "Рекорды Белнета",
    importFromFile: "Импорт из файла",
    privateKeys: "Приватные ключи",
    rescanWallet: "Пересканировать кошелек",
    restoreFromSeed: "Восстановить из семян",
    bnsServices: "БНС Сервис",
    bns: {
      purchase: "Купить БНС",
      myBns: "Мой БНС"
    },
    masterNode: {
      registration: "РЕГИСТРАЦИЯ",
      staking: "СТЕЙК",
      myStakes: "Мои ставки"
    },
    masterNodeDetails: "Подробная информация о мастерноде",
    settings: {
      title: "Настройки",
      tabs: {
        general: "Общие",
        language: "Язык",
        peers: "Пиры"
      }
    },
    transactionDetails: "Данные транзакции",
    details: "Подробности",
    transactions: "Транзакции",
    wallet: {
      createNew: "Создать новый кошелек",
      createdOrRestored: "Кошелек создан/восстановлен",
      walletRestored: "Кошелек восстановлен",
      walletCreated: "Кошелек создан",
      walletImported: "Кошелек импортирован",
      importFromFile: "Импортировать кошелек из файла",
      useExistingWallet: "Использовать существующий кошелек",
      importFromLegacyGUI: "Импортировать кошелек из предыдущего GUI",
      importFromOldGUI: "Импортировать кошелек из старого  GUI",
      restoreFromSeed: "Восстановить кошелек из seed-фразы",
      restoreViewOnly: "Восстановить кошелек только-для-чтения"
    },
    chooseLanguage: "Выберите язык",
    yourWallets: "Ваши Кошельки",
    swap: {
      swap: "Менять",
      exchange: "Обмен",
      history: "История",
      unsupportedpair: "Неподдерживаемая обменная пара",
      minimumAmt: "Минимальная сумма",
      maximumAmt: "Максимальная сумма",
      transactionDetails: "Детали транзакции",
      youSend: "Вы отправляете",
      exchangeRate: "Обменный курс",
      fixedRate: "Фиксированная ставка",
      fixedRateUpdateSec:
        "Фиксированная скорость обновляется каждые 30 секунд.",
      serviceFee: "Комиссия за обслуживание 0,25%",
      fees: "Сборы",
      allTheFees: "Все сборы включены в стоимость проживания",
      networkFee: "Сетевая плата",
      youGet: "Вы получаете",
      floatingExchangeRate: "Плавающий обменный курс",
      fixedExchangeRate: "Фиксированный обменный курс",
      stillProcessing:
        "Ваша предыдущая транзакция все еще обрабатывается. Создать новый можно за 15 минут.",
      minimumExchangeAmtAbove: "Минимальная сумма обмена указана выше",
      for: "для",
      maximumExchangeAmtUnder: "Максимальная сумма обмена не превышает",
      floatingRateDisc:
        "Плавающая ставка может измениться в любой момент в зависимости от рыночных условий, поэтому вы можете получить больше или меньше криптовалюты, чем ожидалось.",
      fixedRateExactAmtDisc:
        "При фиксированной ставке вы получите именно ту сумму криптовалюты, которую видите на этом экране.",
      walletAddress: "Адрес кошелька",
      myWalletRequire: "Мой кошелек требует",
      agreeWith: "я согласен с",
      termOfUse: "Условия эксплуатации",
      and: "и",
      privacyPolicy: "политика конфиденциальности",
      checkout: "Проверить",
      blockchain: "блокчейн",
      exchangefee: "Комиссия за обмен",
      exchangeFeeIncluded:
        "Комиссия за обмен уже включена в отображаемую сумму, которую вы получите.",
      networkFeeIncluded:
        "Комиссия за сеть уже включена в отображаемую сумму, которую вы получите.",
      guaranteeFee: "Гарантированная ставка",
      refundAddress: "Адрес возврата",
      exchanging: "Обмен",
      confirmingProcess: "Подтверждение в процессе",
      Once: "Один раз",
      confirmedInBlockchain:
        "подтвержден в блокчейне, мы начнем его обменивать на",
      seenInputExplorer: "Посмотреть входной хэш в проводнике",
      to: "к",
      pleaseWait: "Процесс займет несколько минут. пожалуйста, подождите.",
      sendFundsToWallet: "Отправка средств на ваш кошелек",
      waitHere: "Вам не придется ждать здесь",
      newTransaction: "Вы можете инициировать новую транзакцию.",
      checkStatus:
        "Вы всегда можете проверить статус этой транзакции в транзакции",
      transactionPreview: "Предварительный просмотр транзакции",
      transactionID: "ID транзакции",
      changellyAddress: "Адрес Чангли",
      completed: "Завершенный",
      amountTo: "Равняться",
      amountReceived: "Полученная сумма",
      amountSend: "Отправленная сумма",
      inputHash: "Входной хеш",
      outputHash: "Выходной хэш",
      amountFrom: "Сумма от",
      paymentNotReceived:
        "Деньги не поступили в течение 3 часов. Пожалуйста, проверьте тарифы и создайте новую транзакцию.",
      downloadCsv: "Скачать CSV-файл",
      status: "Положение дел",
      date: "Дата",
      exchangeAmount: "Сумма обмена",
      receiver: "Получатель",
      sendFundDisc: "Отправьте средства на адрес ниже",
      timeLeft: "Осталось время отправить",
      guaranteedRateDisc: "Гарантированная ставка прекращена",
      sendFundsAboveAddress:
        "Обратите внимание, что вы можете отправить средства только на указанный выше адрес.",
      once: "один раз",
      swapMaintenance: "Своп временно находится на обслуживании",
      tryAgainSomeTimes: "Пожалуйста, повторите попытку через несколько раз",
      afterYourFirstTxn: "После вашей первой транзакции",
      youWillBeViewHere: "вы сможете просмотреть это здесь",
      openHistory: "Открыть историю",
      newTransactionBtn: "Новая транзакция",
      exchangePair: "Биржевая пара",
      exchangePairDisc: "Установите предпочтительную обменную пару",
      walletAddressDisc: "Заполните данные адреса криптокошелька",
      payment: "Оплата",
      paymentDisc: "Внесите необходимую для обмена сумму",
      exchangeDisc: "Дождитесь завершения транзакции",
      paymentConfirm: "Подтвердите и произведите оплату",
      minimumAmtChanged: "Минимальное значение суммы изменено, новое значение ",
      maximumAmtChanged:
        "Максимальное значение суммы изменено, новое значение равно ",
      network: "СЕТЬ",
      giveCorrectAddress:
        "Пожалуйста, убедитесь, что вы указали правильный адрес выбранной сети ({type}). В противном случае вы потеряете свои средства."
    }
  }
};
