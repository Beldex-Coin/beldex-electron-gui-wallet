<template>
  <q-item
    v-close-popup
    clickable
    :class="{ 'beldex-menu__danger': danger }"
    @click.native="clickedItem($event)"
  >
    <svg
      v-if="icon === 'app_copy'"
      class="beldex-menu__icon beldex-menu__icon--svg"
      width="16"
      height="16"
      viewBox="0 0 16.5789 16.5789"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M5.52621 0.691406V3.45456H2.07227V15.198H11.7433V12.4348H15.1973V4.34773L11.5409 0.691406H5.52621ZM6.217 1.3822H11.0525V4.83614H14.5065V11.744H6.217V1.3822ZM11.7433 1.87061L14.0181 4.14535H11.7433V1.87061ZM2.76306 4.14535H5.52621V12.4348H11.0525V14.5072H2.76306V4.14535Z"
      />
    </svg>
    <q-icon
      v-else-if="icon"
      :name="icon"
      size="16px"
      class="beldex-menu__icon"
    />
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
