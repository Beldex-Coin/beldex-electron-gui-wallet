import { clipboard } from "src/shims/electron-renderer";

// Shared by every "copy a value to the clipboard, then notify" action
// (address, BNS records, etc.) so the writeText/notify pairing only
// needs to be written - and kept correct - once.
export default {
  methods: {
    copyToClipboardAndNotify(value, message, timeout = 2000) {
      if (!value) return;
      clipboard.writeText(value.trim());
      this.$q.notify({
        type: "positive",
        timeout,
        message
      });
    }
  }
};
