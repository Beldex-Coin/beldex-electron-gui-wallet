export default {
  methods: {
    isTxInDateRange(tx, dateRange) {
      if (!dateRange) return true;

      const { from, to } = dateRange;
      if (!from && !to) return true;

      const txDate = new Date(tx.timestamp * 1000);

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
