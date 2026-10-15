const net = require("net");

// Plain TCP relay between beldex-wallet-rpc and a remote daemon, used in
// remote mode only. beldex-wallet-rpc scans blocks on its single RPC thread
// and ignores SIGTERM until a scan finishes, so on quit the app could not
// save the wallet and had to SIGKILL it, losing all scan progress. Closing
// this relay makes the scan fail with no_connection_to_daemon, after which
// wallet-rpc answers store/close_wallet normally - the same thing that
// already happens in local mode when beldexd is stopped.
export class DaemonRelay {
  constructor(host, port) {
    this.host = host;
    this.port = port;
    this.server = null;
    this.sockets = new Set();
  }

  // Resolves with the 127.0.0.1 port wallet-rpc should use as its daemon.
  listen() {
    return new Promise((resolve, reject) => {
      const server = net.createServer(client => {
        const upstream = net.connect(this.port, this.host);
        this.track(client);
        this.track(upstream);
        client.on("error", () => upstream.destroy());
        upstream.on("error", () => client.destroy());
        client.on("close", () => upstream.destroy());
        upstream.on("close", () => client.destroy());
        client.pipe(upstream);
        upstream.pipe(client);
      });
      server.once("error", reject);
      server.listen(0, "127.0.0.1", () => {
        server.removeListener("error", reject);
        server.on("error", () => {});
        this.server = server;
        resolve(server.address().port);
      });
    });
  }

  track(socket) {
    this.sockets.add(socket);
    socket.on("close", () => this.sockets.delete(socket));
  }

  close() {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
    for (const socket of this.sockets) {
      socket.destroy();
    }
    this.sockets.clear();
  }
}
