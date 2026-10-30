<template>
  <span> {{ value }} <span class="coin-extensions">BDX</span> </span>
</template>

<script>
export default {
  name: "FormatBeldex",
  props: {
    amount: {
      type: Number,
      required: true
    },
    round: {
      type: Boolean,
      required: false,
      default: false
    },
    rawValue: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    value() {
      let value = this.amount / 1e9;
      if (this.round) value = value.toFixed(3);
      return this.rawValue ? value : value.toLocaleString();
    }
  }
};
</script>

<style>
.coin-extensions {
  color: #00ad07;
}
</style>
