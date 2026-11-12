<template>
  <q-input
    ref="input"
    v-bind="$attrs"
    :value="value"
    :type="revealed ? 'text' : 'password'"
    v-on="listeners"
  >
    <template v-slot:append>
      <button
        type="button"
        class="password-input__reveal"
        tabindex="-1"
        :aria-label="
          revealed
            ? $t('dialog.password.hidePassword')
            : $t('dialog.password.showPassword')
        "
        :aria-pressed="revealed"
        @click="revealed = !revealed"
      >
        <img v-if="revealed" src="~assets/icons/password-eye.svg" alt="" />
        <img v-else src="~assets/icons/eye-off.svg" alt="" />
      </button>
    </template>
  </q-input>
</template>

<script>
// q-input for passwords with a show/hide toggle. Drop-in: use v-model as usual.
export default {
  name: "PasswordInput",
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      required: false,
      default: ""
    }
  },
  data() {
    return { revealed: false };
  },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: val => this.$emit("input", val)
      };
    }
  },
  methods: {
    focus() {
      if (this.$refs.input) this.$refs.input.focus();
    }
  }
};
</script>

<style lang="stylus">
.password-input__reveal {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 16px;
  height: 16px;
  padding: 0;
  background: transparent;
  border: 0;
  cursor: pointer;

  img {
    display: block;
    width: 16px;
    height: 16px;
  }
}
</style>
