<template>
  <q-item
    v-close-popup
    clickable
    :class="{ 'beldex-menu__danger': danger }"
    @click.native="clickedItem($event)"
  >
    <q-icon v-if="icon" :name="icon" size="16px" class="beldex-menu__icon" />
    <q-item-section>
      {{ $t(i18n) }}
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: "ContextMenuItem",
  props: {
    action: {
      type: String,
      required: true
    },
    i18n: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: ""
    },
    danger: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    clickedItem(event) {
      this.$emit("clicked", event);
    }
  }
};
</script>

<style></style>
