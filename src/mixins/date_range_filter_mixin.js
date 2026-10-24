export default {
  methods: {
    isTxInDateRange(tx, dateRange) {
      if (!dateRange) return true;

      const { from, to } = dateRange;
      if (!from && !to) return true;

      const txDate = new Date(tx.timestamp * 1000);

      // Pending/pool transactions may not carry a usable timestamp, which
      // would make txDate invalid (NaN) and both comparisons below silently
      // evaluate to false. Treat that explicitly as "always in range"
      // instead of relying on that IEEE-754 side effect, so the behaviour
      // is a stated rule rather than an accident that breaks if a third
      // bound is ever added.
      if (isNaN(txDate.getTime())) return true;

      if (from) {
        const fromDate = new Date(from);
        fromDate.setHours(0, 0, 0, 0);
        if (txDate < fromDate) return false;
      }

      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        if (txDate > toDate) return false;
      }

      return true;
    }
  }
};
