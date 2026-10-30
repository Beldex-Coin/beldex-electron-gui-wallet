<template>
  <div class="beldex-field" :class="{ disable, 'disable-hover': disableHover }">
    <div v-if="label" class="label row items-center" :disabled="disable">
      {{ label }}
      <span
        v-if="optional"
        class="optional"
        :class="{
          'optional--bracket': bracketOptional,
          'optional--right': optionalRight
        }"
        >{{ bracketOptional ? "[" : optionalRight ? "" : "("
        }}{{ $t("fieldLabels.optional")
        }}{{ bracketOptional ? "]" : optionalRight ? "" : ")" }}</span
      >
      <q-btn
        v-if="enableStar"
        v-model="starred"
        class="q-ml-sm"
        color="accent"
        :icon="starred ? 'star' : 'star_border'"
        @click="updateStarred"
      >
        <q-tooltip anchor="bottom right" self="top right" :offset="[0, 5]">
          {{ starred ? "Remove favourite" : "Add favourite" }}
        </q-tooltip>
      </q-btn>
    </div>
    <div class="content row items-center" :class="{ error }">
      <slot></slot>
    </div>
    <div v-if="error && errorLabel" class="error-label" :disabled="disable">
      {{ errorLabel }}
    </div>
  </div>
</template>

<script>
export default {
  name: "BeldexField",
  props: {
    label: {
      type: String,
      required: false,
      default: undefined
    },
    error: {
      type: Boolean,
      required: false,
      default: false
    },
    errorLabel: {
      type: String,
      required: false,
      default: undefined
    },
    // Writes "[Optional]" in mixed case instead of "(OPTIONAL)".
    bracketOptional: {
      type: Boolean,
      required: false,
      default: false
    },
    // Right-aligns a plain "Optional" on the label row.
    optionalRight: {
      type: Boolean,
      required: false,
      default: false
    },
    optional: {
      type: Boolean,
      required: false,
      default: false
    },
    disable: {
      type: Boolean,
      required: false,
      default: false
    },
    disableHover: {
      type: Boolean,
      required: false,
      default: false
    },
    enableStar: {
      type: Boolean,
      required: false,
      default: false
    },
    starred: {
      type: Boolean,
      required: false,
      default: false
    },

    updateStarred: {
      type: Function,
      required: false,
      default: undefined
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss">
.beldex-field {
  .label {
    margin: 6px 0;
    // font-weight: bold;
    font-size: 16px;
    // font-family: "Poppins-Medium";
    // Disable text selection
    -webkit-user-select: none;
    user-select: none;
    cursor: default;

    .optional {
      font-weight: 400;
      margin-left: 4px;

      &--bracket,
      &--right {
        text-transform: capitalize;
      }

      &--right {
        margin-left: auto;
      }
    }

    .q-btn {
      font-size: 11px;
      min-width: unset !important;
      width: 32px;
      height: 30px;
      border-radius: 7px;
      .q-icon {
        color: #2879fb;
      }
    }
  }

  .content {
    border-radius: 3px;
    padding: 6px 8px;
    min-height: 46px;

    > * {
      margin-right: 4px;
    }

    > *:last-child {
      margin-right: 0px;
    }

    .q-input,
    .q-select {
      flex: 1;
      margin: 0;

      * {
        // Oxen navy, can't use vars here :(
        color: #fff;
      }
    }

    .q-select {
      .row {
        color: red;
      }
    }

    .q-date {
      min-width: 100%;
      max-width: 100%;
      background: #2f2f40 !important;
    }

    .q-btn {
      padding: 4px 8px;
      font-size: 12px !important;
    }
  }
}
</style>
