// Shared helpers for supervising a spawned child process (the local daemon
// and the wallet RPC process). Both daemon.js and wallet-rpc.js used to
// carry byte-identical copies of the output-tail tracking, RPC error
// formatting, and startup-timer helpers below, plus three duplicated
// constants - about 60 lines that could (and did start to) drift between
// the two files. They also each hand-rolled their own SIGTERM-then-SIGKILL
// termination sequence, in three slightly different ways across the two
// files (daemon.js's killProcess() and quit(), and wallet-rpc.js's quit());
// one of those three copies had a real bug (see terminateProcess() below).
// This module holds one shared version of each.

export const SHOULD_LOG_PROCESS_OUTPUT =
  process.env.BELDEX_VERBOSE_LOGS === "true";
export const PROCESS_OUTPUT_TAIL_LIMIT = 20;
export const START_POLL_INTERVAL_MS = 1000;

// Appends a chunk of process stdout/stderr to a rolling tail buffer used
// for diagnostics, capped at PROCESS_OUTPUT_TAIL_LIMIT lines.
export function appendProcessOutput(target, data) {
  const value = data.toString().trim();
  if (!value) {
    return;
  }

  target.push(value);
  if (target.length > PROCESS_OUTPUT_TAIL_LIMIT) {
    target.shift();
  }
}

// Picks the best available message out of an RPC error response.
export function formatRPCError(error, fallbackMessage) {
  if (!error) {
    return fallbackMessage;
  }

  if (typeof error === "string") {
    return error;
  }

  const cause = error.cause || {};
  return error.message || cause.message || cause.code || fallbackMessage;
}

// Builds a short, user-safe failure message and logs the full raw
// stderr/stdout tail to the console instead of putting it in that message.
// The raw tail can be dozens of lines long and carry local absolute paths
// or peer IPs, which isn't appropriate for the short-lived toast this
// message ends up in (see backend.js's show_notification calls) - it's
// still useful for debugging, so it goes to the console rather than being
// dropped entirely.
export function getProcessFailureDetails(prefix, stderrTail, stdoutTail) {
  const stderr = stderrTail.join("\n");
  const stdout = stdoutTail.join("\n");
  const detail = stderr || stdout;
  if (detail) {
    console.error(`${prefix}\n${detail}`);
  }
  return prefix;
}

// Clears the startup-related timer/interval handles a supervisor keeps.
// `target` is the Daemon/WalletRPC instance.
export function clearStartTimers(target) {
  clearInterval(target.startupPoll);
  clearTimeout(target.startupTimeout);
  target.startupPoll = null;
  target.startupTimeout = null;
}

// Sends `signal` to `childProcess`, then waits for it to actually exit -
// a one-time "close" listener is registered *before* the SIGKILL timer is
// armed, so the timer can never be cleared before it has a chance to fire.
// (The bug this replaces had the order reversed: it armed the timer, then
// called the same completion callback that clears it, in the same tick -
// see the fix in wallet-rpc.js's quit(), which is where this was first
// caught.) Escalates to SIGKILL after `forceKillTimeoutMs` if the process
// is still alive by then. Resolves once the process has actually closed,
// or immediately if there was nothing to terminate.
export function terminateProcess(childProcess, signal, forceKillTimeoutMs) {
  return new Promise(resolve => {
    if (!childProcess) {
      resolve();
      return;
    }

    let settled = false;
    childProcess.once("close", () => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(forceKillTimer);
      resolve();
    });

    const forceKillTimer = setTimeout(() => {
      childProcess.kill("SIGKILL");
    }, forceKillTimeoutMs);

    childProcess.kill(signal);
  });
}
