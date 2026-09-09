# Beldex Electron GUI Wallet

### Introduction

Beldex is a private cryptocurrency based on Monero. Beldex aims to provide a private data transmission layer using a second layer of Master Nodes.
More information on the project can be found on the [website](https://beldex.io) and in the [whitepaper](https://beldex.io/whitepaper). Beldex is an open source project, and we encourage contributions from anyone with something to offer.

![Beldex wallet image](./src-electron/icons/Beldex-team.png)

### About this project

This is the new Electron GUI for Beldex. It is open source and completely free to use without restrictions, anyone may create an alternative implementation of the Beldex Electron GUI that uses the protocol and network in a compatible manner.

Please submit any changes as pull requests to the development branch, all changes are assessed in the development branch before being merged to master, release tags are considered stable builds for the GUI.

#### Pre-requisites

- Download latest [beldexd](https://github.com/Beldex-Coin/beldex/releases/latest)
- Extract the beldexd binaries to a folder

#### Commands

```
nvm use 24.15.0
npm install -g @quasar/cli
git clone https://github.com/Beldex-Coin/beldex-electron-gui-wallet
cd beldex-electron-gui-wallet
cp path_to_beldexd_binaries/beldexd bin/
cp path_to_beldexd_binaries/beldex-wallet-rpc bin/
npm install
```

For dev:

```
npm run dev
```

For building:

**Note:** This will only build the binaries for the system you run the command on. Running this command on `linux` will only make `linux` binaries, no `mac` or `windows` binaries.

```
npm run build
```

### Adding language support

Adding a new language is fairly simple.

1. Duplicate the language file `src/i18n/en-us.js` and rename it to the relevant language code.
2. Translate all the strings in that duplicated file. Take note that capitalization matters.
   - The translated string must go in-between the quotes (`""`)
     - E.G `all: "ALL"` -> `all: "ВСЕ"`
   - If possible try and stick to the general string formatting already present.
     - E.G if there is a new line then try and keep that in your translation.
     - The same goes for the pipe character `|`. **DO NOT REMOVE IT**.
   - Please don't translate strings inside `{}` brackets. They are meant as placeholders for other values.
     - Some examples include `{type}` and `{count}`.
     - E.G if you have a string `A {index}` then you may translate it as `B {index}` or `{index} B` depending on how the string makes sense in your language. You are allowed to reposition the placeholders for the string to make sense **BUT DO NOT DELETE OR REPLACE THE PLACEHOLDERS WITH OTHER VALUES**
3. Add the language to the `languages` array in `src/i18n/index.js`. The `flag` property is the [ISO 3166-1-alpha-2 code](https://www.iso.org/obp/ui/#search/code/) of a country.
   - **NOTE: DO NOT ADD THE LANGUAGE TO `export default`**. Dynamic language loading is handled by the application.
4. Submit a PR with your changes.
