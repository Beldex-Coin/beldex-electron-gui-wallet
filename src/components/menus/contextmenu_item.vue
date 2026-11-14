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
    <svg
      v-else-if="icon === 'app_send'"
      class="beldex-menu__icon beldex-menu__icon--svg"
      width="16"
      height="16"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path
        d="M8.48167 12.6525C8.52709 12.7667 8.63918 12.8401 8.76198 12.8362C8.88478 12.8323 8.99195 12.7518 9.03 12.635L12.8217 1.55167C12.86 1.44532 12.8335 1.32639 12.7535 1.24645C12.6736 1.16652 12.5547 1.13997 12.4483 1.17833L1.365 4.97C1.2487 5.00935 1.16949 5.11732 1.16688 5.24008C1.16427 5.36283 1.23881 5.47407 1.35333 5.51833L5.97917 7.37333C6.27422 7.49191 6.50809 7.72578 6.62667 8.02083L8.48167 12.6525Z"
      />
      <path d="M12.7458 1.25417L6.36417 7.63" />
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
