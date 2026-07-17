# Building

Building Beldex Electron Wallet binaries is done using GitHub Actions. Windows builds work as-is, but Linux compatibility depends on the build environment you use.

## Supported OS baseline

The current app runtime is Electron `42.4.1`, so the practical support floor is:

- Windows: `Windows 10` and newer
- macOS: `macOS 12 Monterey` and newer
- Linux: build on an older baseline if you want older distro compatibility

Building on a newer host OS does not lower these Windows/macOS minimums. If you need support below those floors, that requires a separate legacy build on an older Electron version.

## Linux compatibility

If you build the Linux package on a very new distro such as Ubuntu 24.04, the generated Electron artifacts can inherit newer glibc/runtime expectations and fail on older Linux releases.

To avoid that:

1. GitHub Actions now builds Linux artifacts on `ubuntu-20.04`.
2. For local Linux builds, use the compatibility container:

```bash
npm run build:linux:compat
```

This builds inside the pinned Docker image defined in [build/linux-compat.Dockerfile](/Users/blockhash/Documents/my-workspace/work/beldex-electron-gui-wallet/build/linux-compat.Dockerfile), which gives you a lower Linux userspace baseline than building directly on Ubuntu 24.

If you want to publish a Linux release from your machine instead of CI:

```bash
GH_TOKEN=your_token_here npm run release:linux:compat
```

These commands require Docker on the build machine.

## Mac OS

The build script for Mac OS requires you to have a valid `Developer ID Application` certificate. Without this the build script cannot sign and notarize the mac binary which is needed for Catalina 10.15 and above.
If you would like to disable this then comment out `"afterSign": "build/notarize.js",` in package.json.

You will also need an [App-specific password](https://support.apple.com/en-al/HT204397) for the apple account you wish to notarize with

### Setup

Once you have your `Developer ID Application` you need to export it into a `.p12` file. Keep a note of the password used to encrypt this file as it will be needed later.

We need to Base64 encode this file, so run the following command:

```
base64 -i certificate.p12 -o encoded.txt
```

#### On GitHub:

1.  Navigate to the main page of the repository.
2.  Under your repository name, click **Settings**.
3.  In the left sidebar, click **Secrets**.
4.  Add the following secrets:
    1.  Certificate
        - Name: `MAC_CERTIFICATE`
        - Value: The encoded Base64 certificate
    2.  Certificate password
        - Name: `MAC_CERTIFICATE_PASSWORD`
        - Value: The password that was set when the certificate was exported.
    3.  Apple ID
        - Name: `SIGNING_APPLE_ID`
        - Value: The apple id (email) to use for signing
    4.  Apple Password
        - Name: `SIGNING_APP_PASSWORD`
        - Value: The app-specific password that was generated for the apple id
    5.  Team ID (Optional)
        - Name: `SIGNING_TEAM_ID`
        - Value: The apple team id if you're sigining the application for a team
