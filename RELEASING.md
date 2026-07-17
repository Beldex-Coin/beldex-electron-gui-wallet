# Releasing

Releasing the application to work with auto update is very simple.

Current runtime support floor for this branch:

- Windows 10 and newer
- macOS 12 Monterey and newer

1. Increment the application version in `package.json`.
2. Push changes to master to trigger github actions to build the binaries.
   - Ensure that `.yml` files aren't being left out in the artifacts. These are needed for auto-update to work correctly.
   - Linux release artifacts are built on `ubuntu-20.04` to keep compatibility with older Linux versions.
3. Create a github release with the **tag** being in the format `v[Version]`.
   - E.g if the version was `2.1.1` then the github tag would be `v2.1.1`
4. Add release notes
5. Publish the release!

If you need to produce Linux release artifacts locally from a newer distro such as Ubuntu 24.04, use:

```bash
GH_TOKEN=your_token_here npm run release:linux:compat
```
